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
- *Documented on JanusGraph [official documentation](https://docs.janusgraph.org/storage-backend/cassandra/#deploying-on-datastax-astra)*

<img src="https://awesome-astra.github.io/docs/img/janusgraph/janusgraph.png" height="180px" />
</div>

## Overview

JanusGraph is designed to support the processing of graphs so large that they require storage and computational capacities beyond those that a single machine can provide. Scaling graph data processing for real time traversals and analytical queries is JanusGraph’s foundational benefit. This section will discuss the various specific benefits of JanusGraph and its underlying, supported persistence solutions.

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to JanusGraph](https://docs.janusgraph.org/)
- 📥 [JanusGraph Installation](https://docs.janusgraph.org/getting-started/installation/)
</div>

JanusGraph uses the [Java driver](https://docs.janusgraph.org/changelog/#datastax-cassandra-driver-upgrade-from-390-to-4130) to connect to Cassandra as the storage backend. The Java driver itself supports connections to Astra DB natively. For example:
```
CqlSession session = CqlSession.builder()
  .withCloudSecureConnectBundle(Paths.get("/path/to/secure-connect-db_name.zip"))
  .withAuthCredentials("CLIENT_ID", "CLIENT_SECRET")
  .withKeyspace("keyspace_name")
  .build();
```

## Prerequisites
<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
</ul>

This article assumes you have a running installation of JanusGraph server. This was written and tested on JanusGraph [`v0.6.2`](https://docs.janusgraph.org/changelog/#version-062-release-date-may-31-2022). If JanusGraph [`v0.6.0`](https://docs.janusgraph.org/changelog/#version-060-release-date-september-3-2021) is used instead, refer to [this article](https://community.datastax.com/articles/12264/how-to-connect-to-astra-db-from-janusgraph.html). It has not been tested on older versions of JanusGraph. 

You will need to choose which keyspace to use to store your graph. If it doesn't exist, you will need to [create the keyspace](https://docs.datastax.com/en/astra/docs/managing-keyspaces.html) on the Astra UI. For simplicity, the keyspace is created as `janusgraph`.

## Installation and Setup
**Note:** For simplicity, the secure connect bundle has been placed in `/path/to/scb`

### <span class="nosurface">✅ Step 1:</span> DB Information

On the JanusGraph server, move your secure bundle using secure copy or other techniques. For example:
```
$ cd /path/to/scb
$ ls -l secure-connect-janusgraph.zip
```

We will use this information to configure Astra DB as the storage backend for JanusGraph.

### <span class="nosurface">✅ Step 2:</span> Graph Storage

While connecting to Astra DB from JanusGraph, it is preferred to make use of the secure connect bundle file
as-is without extracting it. There are multiple ways in which a secure connect bundle file can be passed on to
the JanusGraph configuration to connect to Astra DB using the DataStax driver.

#### <span class="nosurface">✅ Step 2a:</span> Internal string configuration

Set the property `storage.cql.internal.string-configuration` to `datastax-java-driver { basic.cloud.secure-connect-bundle=/path/to/scb/secure-connect-janusgraph.zip }`
and set the username, password and keyspace details.

For example:
```properties
gremlin.graph=org.janusgraph.core.JanusGraphFactory
storage.backend=cql
storage.cql.keyspace=<keyspace name which was created in AstraDB>
storage.username=<clientID>
storage.password=<clientSecret>
storage.cql.internal.string-configuration=datastax-java-driver { basic.cloud.secure-connect-bundle=/path/to/scb/secure-connect-janusgraph.zip }
```

Also, you can set a JVM argument to pass the secure connect bundle file as shown below and remove that property
`(storage.cql.internal.string-configuration)` from the list above.

```
-Ddatastax-java-driver.basic.cloud.secure-connect-bundle=/path/to/scb/secure-connect-janusgraph.zip
```

#### <span class="nosurface">✅ Step 2b:</span> Internal file configuration

Set the property `storage.cql.internal.file-configuration` to an external configuration file if you would like to
externalize the astra connection related properties to a separate file and specify the secure bundle and credentials information on that file.

For example:
```properties
gremlin.graph=org.janusgraph.core.JanusGraphFactory
storage.backend=cql
storage.cql.keyspace=janusgraph
# Link to the external file that DataStax driver understands
storage.cql.internal.file-configuration=/path/to/scb/astra.conf
```

`astra.conf` (external file) to contain:
```
datastax-java-driver {
  basic.cloud {
    secure-connect-bundle = "/path/to/scb/secure-connect-janusgraph.zip"
  }
  basic.request {
    timeout = "10 seconds"
  }
  advanced.auth-provider {
    class = PlainTextAuthProvider
    username = "<ClientID>"
    password = "<ClientSecret>"
  }
}
```

!!! info "IMPORTANT"
    The **ClientID** and **ClientSecret** are from the token you generated in the **Prerequisites** section above.

```
### <span class="nosurface">✅ Step 3:</span> Final Test
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
