---
title: "Temporal"
description: "Temporal.io is an open source microservice orchestration platform that assists in tracking workflows in your application development. It provides the user with a plug-and-play persistence layer that lets the user choose and configure their Temporal Server with their preferred backend. Currently, Temporal is compatible with Postgres, MySQL, and Apache CassandraⓇ as backend dependencies."
tags: "go, cql, third party tools, framework"
icon: "https://awesome-astra.github.io/docs/img/temporal/temporal.svg"
developer_title: "Temporal"
developer_url: "https://docs.temporal.io/"
links:
- title: "Temporal on Github"
  url: "https://github.com/temporalio/temporal"
- title: "Install Temporal Docs"
  url: "https://docs.temporal.io/clusters/quick-install/"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/temporal/temporal-logo-dark.svg" height="100px" />
</div>

## Overview

Temporal.io is an open source microservice orchestration platform that assists in tracking workflows in your application development. It provides the user with a plug-and-play persistence layer that lets the user choose and configure their Temporal Server with their preferred backend. Currently, Temporal is compatible with Postgres, MySQL, and Apache CassandraⓇ as backend dependencies. 

<div class="nosurface" markdown="1">
- <span class="nosurface" markdown="1">📥 </span>[Temporal Quick Install](https://docs.temporal.io/docs/clusters/quick-install/)
- <span class="nosurface" markdown="1">ℹ️ </span>[Introduction to Temporal](https://docs.temporal.io/docs/temporal-explained/introduction)
- <span class="nosurface" markdown="1">ℹ️ </span>[Part 1: Introduction to Temporal and Cassandra, Astra DB](https://medium.com/building-the-open-data-stack/easily-manage-workflows-at-scale-with-temporal-io-and-astra-db-144f93a21ff3)
- <span class="nosurface" markdown="1">ℹ️ </span>[Part 2: Connect Temporalio to Astra DB in 5 Easy Steps](https://medium.com/building-the-open-data-stack/connect-temporal-io-to-astra-db-in-5-easy-steps-with-cql-proxy-768c62579289)
- <span class="nosurface" markdown="1">ℹ️ </span>[Part 3: Connect Temporalio to Astra DB With Kubernetes](https://medium.com/building-the-open-data-stack/how-to-connect-temporal-io-to-astra-db-with-kubernetes-3a6337900eb)
- <span class="nosurface" markdown="1">🎥 </span>[Workflow with Temporal and Astra DB in 5 minutes](https://www.youtube.com/watch?v=rdmJErBLxtE)
</div>

## Prerequisites
<ul class="prerequisites">
  <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
</ul>

!!! note "Note"
    This runbook was written using Mac OS Monterey but it will also work with Windows. Any Windows-specific instructions will be noted as such.  

## Installation and Setup

### <span class="nosurface">✅ Step 1: </span>Setup Astra

1. In your Astra database, create two new keyspaces called **"temporal"** and **"temporal_visibility".** You will be using both of these in the next steps.
2. Make sure to create an Astra token with **Admin Role**
3. Get your **Database ID**

???+ tip "Find your Database ID in one of two ways:"
     1. Navigate to your your database and get the last ID in the URL: `https://astra.datastax.com/org/.../database/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
     2. Copy and paste the **Datacenter ID** without the trailing `-1` from the **Regions** section of your Astra Dashboard. 

### <span class="nosurface">✅ Step 2: </span>Temporal Pre-setup

1. Clone this GitHub [repository](https://github.com/mpenick/temporal-astra-cql-proxy)
2. Navigate to your cloned repository and using your preferred text editor (e.g. VisualStudio or Sublime), update the .env file with your Astra Token and Astra Database ID that you obtained above. 
   
```bash
ASTRA_TOKEN=<your Astra token>
ASTRA_DATABASE_ID=<your DB ID>
```

### <span class="nosurface">✅ Step 3: </span>Temporal Schema Migration to Astra DB

For this step, you will set up the keyspaces you created earlier in the Astra prerequisites (**temporal** and **temporal_visibility**). You will be using `temporal-cassandra-tool` which is part of the Temporal repo and it relies on schema definition. 

1. Navigate to your cloned `temporal-astra-cql-proxy` directory
2. Run the following commands to initialize the keyspaces that we created through Astra. Note that there are two sets of commands, one for `temporal` keyspace and one for `temporal_visibility` keyspace:

```bash
docker-compose -f docker-compose-schema.yaml run temporal-admin-tools \
  -ep cql-proxy -k temporal setup-schema -v 0.0
docker-compose -f docker-compose-schema.yaml run temporal-admin-tools \
  -ep cql-proxy -k temporal update-schema -d schema/cassandra/temporal/versioned/

docker-compose -f docker-compose-schema.yaml run temporal-admin-tools \
  -ep cql-proxy -k temporal_visibility setup-schema -v 0.0
docker-compose -f docker-compose-schema.yaml run temporal-admin-tools \
  -ep cql-proxy -k temporal_visibility update-schema -d schema/cassandra/visibility/versioned/
```

Once the process is completed, you should see a message similar to this: 

```bash
2022-03-02T22:23:27.618Z	INFO	Validating connection to cassandra cluster.	{"logging-call-at": "cqlclient.go:112"}
2022-03-02T22:42:53.526Z	INFO	Connection validation succeeded.	{"logging-call-at": "cqlclient.go:118"}
2022-03-02T22:42:53.526Z	INFO	Starting schema setup	{"config": {"SchemaFilePath":"","InitialVersion":"0.0","Overwrite":false,"DisableVersioning":false}, "logging-call-at": "setuptask.go:57"}
2022-03-02T22:42:53.526Z	DEBUG	Setting up version tables	{"logging-call-at": "setuptask.go:67"}
2022-03-02T22:42:54.120Z	DEBUG	Current database schema version 1.6 is greater than initial schema version 0.0. Skip version upgrade	{"logging-call-at": "setuptask.go:116"}
2022-03-02T22:42:54.120Z	INFO	Schema setup complete	{"logging-call-at": "setuptask.go:131"}
```

Great! Your schemas have been migrated with Astra DB. 

???+ info "Confirm your tables exist in Astra"
     * You can double-check to make sure the correct tables have been created by querying your database in Astra DB’s CQL Console.
     * Run `DESC tables;` in both your `temporal` and `temporal_visibility` keyspaces. You should see there are tables loaded in that were created by the schema migration with `temporal-cassandra-tool`. 

```bash
token@cqlsh> use temporal;
token@cqlsh:temporal> desc tables;

history_node        tasks             cluster_metadata_info
cluster_membership  namespaces        cluster_metadata     
schema_version      namespaces_by_id  schema_update_history
executions          queue_metadata  
queue               history_tree    

token@cqlsh:temporal> use temporal_visibility;
token@cqlsh:temporal_visibility> desc tables;

open_executions  schema_update_history  schema_version  closed_executions
```

### <span class="nosurface">✅ Step 4: </span>Run Docker Compose
In this step, the `docker-compose.yaml` file is already provided for you in the `temporal-astra-cql-proxy` repo. This file creates different docker containers to run Temporal server. The persistence layer is configured for you to connect with `cql-proxy`, and it should pull your Astra credentials from when you set it earlier:

```bash
services:
 cql-proxy:
   container_name: cqlproxy
   image: datastax/cql-proxy:v${CQL_PROXY_VERSION}
   ...
   environment:
     - ASTRA_TOKEN=${ASTRA_TOKEN}
     - ASTRA_DATABASE_ID=${ASTRA_DATABASE_ID}
     - HEALTH_CHECK=true
```

Now you can run the docker-compose command to start up Temporal: 
```bash
docker-compose up
```

### <span class="nosurface">✅ Step 5: </span>Test and Validate
You can test your connection and play with your Temporal cluster with these instructions.

1. Make sure to use tctl to create namespaces dedicated to certain workflows:
```bash
bash-5.0# tctl --namespace test namespace re
Namespace test successfully registered.
```
2. When using the sample apps, keep in mind that you want to modify the starter and worker code so that it points to this specific Temporal deployment. For example:
```bash
c, err := client.NewClient(client.Options{HostPort: "127.0.0.1:7233", Namespace: "test"})
```

Once you have this all running, you should be able to see your workflows reflect on both the Temporal UI and Astra UI.

<img src="https://awesome-astra.github.io/docs/img/temporal/temporal-06-test-validate.png"  />

<span class="nosurface">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/)
</span>