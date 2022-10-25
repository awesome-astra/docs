---
title: "JanusGraph"
description: "JanusGraph is a scalable graph database optimized for storing and querying graphs containing hundreds of billions of vertices and edges distributed across a multi-machine cluster."
tags: "java, graph, jdbc, third party tools, database"
icon: "https://awesome-astra.github.io/docs/img/janusgraph/janusgraph.svg"
developer_title: "Linux Foundation"
developer_url: "https://janusgraph.org"
links:
- title: "Introduction to JanusGraph"
  url: "https://docs.janusgraph.org/"
- title: "JanusGraph Installation"
  url: "https://docs.janusgraph.org/getting-started/installation/"
- title: "JanusGraph and Astra"
  url: "https://docs.janusgraph.org/storage-backend/cassandra/#deploying-on-datastax-astra"
---

<div class="nosurface" markdown="1">
- _This article includes information that was originally written by **Erick Ramirez** on [DataStax Community](https://community.datastax.com/articles/12264/how-to-connect-to-astra-db-from-janusgraph.html)_ 
- *Documented on JanusGraph [official documentation](https://docs.janusgraph.org/storage-backend/cassandra/#deploying-on-datastax-astra)*

<img src="https://awesome-astra.github.io/docs/img/janusgraph/janusgraph.png" height="180px" />
</div>

## A - Overview

JanusGraph is designed to support the processing of graphs so large that they require storage and computational capacities beyond what a single machine can provide. Scaling graph data processing for real time traversals and analytical queries is JanusGraph’s foundational benefit. This section will discuss the various specific benefits of JanusGraph and its underlying, supported persistence solutions.

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to JanusGraph](https://docs.janusgraph.org/)
- 📥 [JanusGraph Installation](https://docs.janusgraph.org/getting-started/installation/)
</div>

JanusGraph uses the [Java driver](https://docs.janusgraph.org/changelog/#datastax-cassandra-driver-upgrade-from-390-to-4130) to connect to Cassandra as the storage backend. The Java driver itself supports connections to Astra DB natively. For example:
```
CqlSession session = CqlSession.builder()
  .withCloudSecureConnectBundle(Paths.get("/path/to/secure-connect-db_name.zip"))
  .withAuthCredentials("token", ASTRA_APP_TOKEN)
  .withKeyspace("keyspace_name")
  .build();
```
However, JanusGraph does not expose this functionality so you will need to manually unpack the secure connect bundle and use its contents to configure JanusGraph which you will obtain in the **Prerequisites**.

## B - Prerequisites
<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
</ul>

This article assumes you have a running installation of JanusGraph server. This was written and tested on JanusGraph v0.6.0. It has not been tested on older versions of JanusGraph. 

You will need to choose which keyspace to use to store your graph. If it doesn't exist, you will need to [create the keyspace](https://docs.datastax.com/en/astra/docs/managing-keyspaces.html) on the Astra UI


## C - Installation and Setup
**Note:** For simplicity, the secure connect bundle has been placed in `/path/to/scb`

### <span class="nosurface">✅</span> Step 1: DB Information

On the JanusGraph server, unpack your secure bundle. For example:
```
$ cd /path/to/scb
$ unzip secure-connect-janusgraph.zip
```
Here is an example file listing after unpacking the bundle:

```
/
  path/
    to/
      scb/
        ca.crt
        cert
        cert.pfx
        config.json
        cqlshrc
        identity.jks
        key
        trustStore.jks
```
Obtain information about your database from the config.json file. Here is an example:

```
{
  "host": "70bf8560-105f-11ec-a3ea-0800200c9a66-us-west1.db.astra.datastax.com",
  "port": 98765,
  "cql_port": 34567,
  "keyspace": "janusgraph",
  "localDC": "us-west1",
  "caCertLocation": "./ca.crt",
  "keyLocation": "./key",
  "certLocation": "./cert",
  "keyStoreLocation": "./identity.jks",
  "keyStorePassword": "Kga1OJ83EF2oBQYR5",
  "trustStoreLocation": "./trustStore.jks",
  "trustStorePassword": "n8F9ptJO3H7YRxTW1",
  "csvLocation": "./data",
  "pfxCertPassword": "9b3HgFChtY60m4nfJ"
}
```

We will use this information to configure Astra DB as the storage backend for JanusGraph.

### <span class="nosurface">✅</span> Step 2: Graph Storage
On the JanusGraph server, modify the CQL storage configuration file:
```
$ cd janusgraph-0.6.0
$ vi conf/janusgraph-cql.properties
```
Make the necessary changes using this template:
```
# basic CQL settings
gremlin.graph=org.janusgraph.core.JanusGraphFactory
storage.backend=cql
storage.hostname=CONFIG-JSON-HOST
storage.port=CONFIG-JSON-CQL-PORT
storage.username=token               <----- do NOT change this
storage.password=ASTRA_APP_TOKEN
storage.cql.keyspace=GRAPH_KEYSPACE
storage.cql.local-datacenter=CONFIG-JSON-LOCALDC
 
# SSL related settings
storage.cql.ssl.enabled=true
storage.cql.ssl.truststore.location=/path/to/scb/trustStore.jks
storage.cql.ssl.truststore.password=CONFIG-JSON-TRUSTSTOREPASSWORD
storage.cql.ssl.keystore.location=/path/to/scb/identity.jks
storage.cql.ssl.keystore.keypassword=CONFIG-JSON-KEYSTOREPASSWORD
storage.cql.ssl.keystore.storepassword=CONFIG-JSON-KEYSTOREPASSWORD
storage.cql.ssl.client-authentication-enabled=true
 
# consistency settings
storage.cql.read-consistency-level=LOCAL_QUORUM
storage.cql.write-consistency-level=LOCAL_QUORUM
```

!!! warning "WARNING"

    The username to connect to Astra is the literal string `token`. Do NOT set this value to your DB's client ID.

!!! info "IMPORTANT"

    The **ASTRA_APP_TOKEN** is from the token you generated in the **Prerequisites** section above.

Using the example values in the config.json above, my conf/janusgraph-cql.properties would contain:
```
# basic CQL settings
gremlin.graph=org.janusgraph.core.JanusGraphFactory
storage.backend=cql
storage.hostname=70bf8560-105f-11ec-a3ea-0800200c9a66-us-west1.db.astra.datastax.com
storage.port=34567
storage.username=token
storage.password=AstraCS:AbCwZYOKqvXHZWRvpbvHqXYz:47820923e5be3b7b9e689bc18614c631d5fdd8b435e68613433651fd20fexyz0
storage.cql.keyspace=janusgraph
storage.cql.local-datacenter=us-west1
 
# SSL related settings
storage.cql.ssl.enabled=true
storage.cql.ssl.truststore.location=/path/to/scb/trustStore.jks
storage.cql.ssl.truststore.password=n8F9ptJO3H7YRxTW1
storage.cql.ssl.keystore.location=/path/to/scb/identity.jks
storage.cql.ssl.keystore.keypassword=Kga1OJ83EF2oBQYR5
storage.cql.ssl.keystore.storepassword=Kga1OJ83EF2oBQYR5
storage.cql.ssl.client-authentication-enabled=true
 
# consistency settings
storage.cql.read-consistency-level=LOCAL_QUORUM
storage.cql.write-consistency-level=LOCAL_QUORUM
```
### <span class="nosurface">✅</span> Step 3: Final Test
Start a Gremlin console:
```
$ bin/gremlin.sh
 
         \,,,/
         (o o)
-----oOOo-(3)-oOOo-----
gremlin>
```
Load a graph using Astra as the storage backend with:
```
gremlin> graph = JanusGraphFactory.open('conf/janusgraph-cql.properties')
==>standardjanusgraph[cql:[70bf8560-105f-11ec-a3ea-0800200c9a66-us-west1.db.astra.datastax.com]]
```

!!! abstract "Note"

    It is normal to see some warnings on the Gremlin console. I have attached a <a href="https://awesome-astra.github.io/docs/img/janusgraph/gremlin-console-output.txt">text file</a> with a sample output so you know what to expect.

In the [Astra CQL Console](https://docs.datastax.com/en/astra/docs/connecting-to-astra-databases-using-cqlsh.html), I can see JanusGraph created the following tables in the `janusgraph` keyspace:
```
token@cqlsh> USE janusgraph;
token@cqlsh:janusgraph> DESCRIBE TABLES;
 
edgestore_lock_  graphindex_lock_         janusgraph_ids   
txlog            systemlog                graphindex       
edgestore        system_properties_lock_  system_properties
```

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>
