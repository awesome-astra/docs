## Apache Beam Overview

???+ note "Introduction to Apache Beam"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_beam.png" />

    **Definition**

    [Apache Beam](https://beam.apache.org/) is an open-source, unified programming model for batch and streaming data processing pipelines that simplifies large-scale data processing dynamics. Thousands of organizations around the world choose Apache Beam due to its unique data processing features, proven scale, and powerful yet extensible capabilities.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/apache_beam.png" />

    **Pipeline**

    A pipeline is made up of multiple steps, that takes some input, operates on that data, and finally produces output. The steps that operates on the data are called PTransforms (parallel transforms), and the data is always stored in PCollections (parallel collections). The PTransform takes one item at a time from the PCollection and operates on it. The PTransform are assumed to be hermetic, using no global state, thus ensuring it will always produce the same output for the given input. These properties allow the data to be sharded into multiple smaller dataset and processed in any order across multiple machines. The code you write ends up being very simple, but is able to seamlessly split across 100s of machines.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/beam_concepts.png" />

    To connect data with an Apache Beam pipeline you can:

    - **Read Data** as input
    - Map, Enrich, work with data in a **Transform** (mapping, enrich)
    - Mutation Data as **Output** (write, delete, update)

    **I/O Connectors**

    Apache Beam I/O connectors provide read and write transforms for the most popular data storage systems so that Beam users can benefit from native optimised connectivity. With the available I/Os, Apache Beam pipelines can read and write data from and to an external storage type in a unified and distributed way.

    I/O connectors denoted via X-language have been made available using the Apache Beam multi-language pipelines framework. Integration of Dataflow would leverage `CassandraIO` and `PulsarIO`.


## Google DataFlow Overiew

???+ note "Introduction to Google Dataflow"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_dataflow.png" height="30px" />

    Google Dataflow is an hosted version of `Apache Beam` running in google cloud platform. It allows users to build and execute data pipelines. It enables the processing of large amounts of data in a parallel and distributed manner, making it scalable and efficient. Dataflow supports both batch and streaming processing, allowing for real-time data analysis. Users can write data processing pipelines using a variety of programming languages such as Java, Python, and SQL. Dataflow also provides integration with other Google Cloud services, such as BigQuery and Pub/Sub.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/dataflow-ecosystem.png" />

    Dataflow provides built-in integrations with most in use Google Cloud Platform products suchh as Cloud Storage, Pub/Sub, Datastore or Big Query. The plaform can be extended and run any java code and I/O connectors deployed form the CLI.

    To integration withg Astra we will liverage Custom sources and Sinks.
    
## Astra Integrations

???+ abstract "Use cases and Interfaces"

    Astra allows both bulk and real time operation with respectively AstraDB and Astra Streaming. For each there are multiple interfaces available and as such integrating with Dataflow could take multiple forms. 

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-interfaces.png" />

    - **`Cassandra and CQL`:** This is the way to go. It is the most mature provides efficient way to execute queries but not only. With the native drivers you can run reactive queries and token range queries to distribute the load across nodes. Now `CassandraIO` is outdated and does not support and we forked it to create `AstraIO`

    - With the Astra SDK it is also totally possible to use other Astra DB interfaces but it is not the recommended approach used in the templates.

    - **Apache Pulsar**
   
## Bulk Data Operations

???+ abstract "From CassandraIO to AstraIO"

    outdated
    no support for cloud secure bundlle
    best solutions to distribute read (token range)


### Load data with Apache Beam

- Definition of the pipeline

- Configuration of `AstraIO.<>Write`

- Run Sample

### Load data with Google DataFlow

- Definition of the pipeline

- Managing secrets (cloud secure bundle and token)

- Configuration of `AstraIO.<>Write`

- Run Sample

### Export data with Apache Beam

- Definition of the pipeline

- Configuring Read

### Export data with Google DataFlow

- Definition of the pipeline

- Configuring Read

- Configuration of Target location

## Streaming Data Operations

???+ abstract "Introduction to PulsarIO"

    outdated
    no support for cloud secure bundlle
    best solutions to distribute read (token range)


- Pub/Sub VS Astra Streaming


# astra-dataflow-starter

This repository proposes some integration of Astra with Apache Beam and GCP Dataflow.

### Prerequisites

| Astra                        | GCP                                    | Local Environment          |
|-------------------------------------------|----------------------------------------|----------------------------|
| [Create Account](#1-get-an-astra-account) | [Create Project](#1-get-an-astra-account) | [Install Java](#1-get-an-astra-account) |
 | [Create Token](#2-get-an-astra-token)     | [Setup gCloud CLI](#2-get-an-astra-token) | [Install Maven](#1-get-an-astra-account) |
| [Setup CLI](#3-setup-astra-cli)           | [Setup Project](#2-get-an-astra-token) | [Clone and Build](#1-get-an-astra-account) |
| [Setup DB](#4-setup-databases)            |                                        |                            |

### Sample Pipelines

| Label                                         | Runner         | Description                                                        |
|-----------------------------------------------|----------------|--------------------------------------------------------------------|
| [Write Static Data ](#1-get-an-astra-account) | local (direct) | Load 100 record into an Astra Table                                |
| [Write Static Data ](#1-get-an-astra-account) | GCP (dataflow) | Load 100 record into an Astra Table. SC is in google cloud storage |

## Prerequisites

### 1. Get an Astra Account

`✅` - Access [https://astra.datastax.com](https://astra.datastax.com) and register with `Google` or `Github` account

![](https://github.com/DataStax-Academy/cassandra-for-data-engineers/blob/main/images/setup-astra-1.png?raw=true)

### 2. Get an astra token

`✅` - Locate `Settings` (#1) in the menu on the left, then `Token Management` (#2)

`✅` - Select the role `Organization Administrator` before clicking `[Generate Token]`

![](https://github.com/DataStax-Academy/cassandra-for-data-engineers/blob/main/images/setup-astra-2.png?raw=true)

`✅` - Copy your token in the clipboard. With this token we will now create what is needed for the training.

![](https://github.com/DataStax-Academy/cassandra-for-data-engineers/blob/main/images/setup-astra-3.png?raw=true)

`✅` - Save you token as environment variable

```
export ASTRA_TOKEN=<paste_your_token_value_here>
```

### 3. Setup Astra CLI

`✅` - Install Cli
```
curl -Ls "https://dtsx.io/get-astra-cli" | bash
source ~/.astra/cli/astra-init.sh
```

`✅` - Setup CLI

```
astra setup --token ${ASTRA_TOKEN}
```

### 4. Setup Databases

`✅` - Create database `demo` with keyspace `demo`
```
astra db create demo -k demo
```

`✅` - Create table `simpledata`

```
astra db cqlsh demo -k demo \
  -e "CREATE TABLE IF NOT EXISTS simpledata(id int PRIMARY KEY, data text);" \
  --connect-timeout 20 \
  --request-timeout 20
```

`✅` - Validate table `simpledata` exists
```
astra db cqlsh demo -k demo \
  -e "select * from simpledata" \
  --connect-timeout 20 \
  --request-timeout 20
```

## Google Cloud Platform Prerequisites

### 1. Create project

`✅` - In the Google Cloud console, on the project selector page, select or [create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

> Note: If you don't plan to keep the resources that you create in this procedure, create a project instead of selecting an existing project. After you finish these steps, you can delete the project, removing all resources associated with the project.
Create a new Project in Google Cloud Console or select an existing one.

![](img/gcp-create-project.png)

`✅` - Make sure that billing is enabled for your Cloud project. Learn how to [check if billing is enabled on a project](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled)

`✅` - Save project ID. The project identifier is available in the column `ID`. We will need it so let's save it as an environment variable
```
export GCP_PROJECT_ID=integrations-379317
export GCP_USER=cedrick.lunven@datastax.com
export GCP_COMPUTE_ENGINE=747469159044-compute@developer.gserviceaccount.com
```

### 2. Setup gCloud CLI

`✅` - Install gCloud CLI
```
curl https://sdk.cloud.google.com | bash
```

`✅` - Associated CLI with project in GCP

```
gcloud init
```

`✅` - Describe the project
```
gcloud projects describe ${GCP_PROJECT_ID}
```

### 3. Setup your project

`✅` - Enable APIS
```
gcloud services enable dataflow compute_component logging storage_component storage_api bigquery pubsub datastore.googleapis.com cloudresourcemanager.googleapis.com
```

`✅` - Add Roles. To complete the steps, your user account must have the Dataflow Admin role and the Service Account User role. The Compute Engine default service account must have the Dataflow Worker role. To add the required roles in the Google Cloud console:
```
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} --member="user:${GCP_USER}" --role=roles/iam.serviceAccountUser
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  --member="serviceAccount:${GCP_COMPUTE_ENGINE}" --role=roles/dataflow.admin
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  --member="serviceAccount:${GCP_COMPUTE_ENGINE}" --role=roles/dataflow.worker
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  --member="serviceAccount:${GCP_COMPUTE_ENGINE}" --role=roles/storage.objectAdmin
```

## Local Environment Prerequisites

### 1. Tools

`✅` - Install [Java 11+](https://www.oracle.com/java/technologies/downloads/) 

`✅` - Install [Apache Maven](https://maven.apache.org/install.html)

### 2. Project 

`✅` - Clone and build project

```
git clone https://github.com/clun/astra-dataflow-starter.git
mvn clean install -Dmaven.test.skip=true
cd https://github.com/clun/astra-dataflow-starter/tree/main/samples-astra-beam-pipelines
```

`✅` - Download secure bundle

```
astra db download-scb demo -f /tmp/secure-connect-bundle-demo.zip
ls -l /tmp/secure-connect-bundle-demo.zip
```



----

### Example 1 - Load Simple Static Data (locally)

`✅` - Run Flow
```
 mvn compile exec:java -Pdirect-runner \
  -Dexec.mainClass=com.dtx.astra.pipelines.LoadDataLocally \
  -Dexec.args="\
    --keyspace=demo \
    --secureConnectBundle=/tmp/secure-connect-bundle-demo.zip \
    --token=${ASTRA_TOKEN}"
```

`✅` - Validate table `simpledata` has been populated
```
astra db cqlsh demo -k demo \
  -e "select * from simpledata" \
  --connect-timeout 20 \
  --request-timeout 20
```

### Example 2 - Load Simple Static Google Data Flow ()

`✅` - Create a `bucket` in the project
```
gsutil mb -c STANDARD -l US gs://astra_dataflow_inputs
gsutil mb -c STANDARD -l US gs://astra_dataflow_outputs
gsutil ls
```

`✅` - Copy Cloud Secure Bundle to GCS
```
gsutil cp /tmp/secure-connect-bundle-demo.zip gs://astra_dataflow_inputs/secure-connect-bundle-demo.zip
gsutil ls gs://astra_dataflow_inputs/
gsutil stat gs://astra_dataflow_inputs/secure-connect-bundle-demo.zip
```

`✅` - Make the secure connect bundle public

```
gsutil acl ch -u AllUsers:R gs://astra_dataflow_inputs/secure-connect-bundle-demo.zip
```

`✅` - Run the JOB
```
mvn -Pdataflow-runner compile exec:java \
    -Dexec.mainClass=com.dtx.astra.pipelines.LoadDataLocally \
    -Dexec.args="\
    --keyspace=demo \
    --secureConnectBundle=https://storage.googleapis.com/astra_dataflow_inputs/secure-connect-bundle-demo.zip \
    --token=${ASTRA_TOKEN} \
    --runner=DataflowRunner \
    --project=${GCP_PROJECT_ID} \
    --region=us-central1 \
    --gcpTempLocation=gs://dataflow-apache-quickstart_integrations-379317/temp/"  
```

`✅` - Show the populated table
```
astra db cqlsh demo -k demo \
  -e "select * from simpledata" \
  --connect-timeout 20 \
  --request-timeout 20
```

### Example 3 - 

```
astra db cqlsh demo -k demo \
  -e "truncate simpledata" \
  --connect-timeout 20 \
  --request-timeout 20
```


`✅` - Run Flow
```
 mvn compile exec:java -Pdirect-runner \
  -Dexec.mainClass=com.dtx.astra.pipelines.LoadStaticDataIntoAstraCql \
  -Dexec.args="\
    --keyspace=demo \
    --secureConnectBundle=/tmp/secure-connect-bundle-demo.zip \
    --token=${ASTRA_TOKEN}"
```


- Security
```
gcloud secrets add-iam-policy-binding cedrick-demo-scb \
        --member="serviceAccount:747469159044-compute@developer.gserviceaccount.com" \
        --role='roles/secretmanager.secretAccessor'
gcloud secrets add-iam-policy-binding cedrick-demo-scb \
        --member="serviceAccount:747469159044-compute@developer.gserviceaccount.com" \
        --role='roles/secretmanager.secretAccessor'
```

- Run
```
mvn -Pdataflow-runner compile exec:java \
    -Dexec.mainClass=com.dtx.astra.pipelines.test.ReadSecretAndConnectDataFlow \
    -Dexec.args="\
    --astraToken=projects/747469159044/secrets/astra-token/versions/1 \
    --secureConnectBundle=projects/747469159044/secrets/cedrick-demo-scb/versions/1 \
    --runner=DataflowRunner \
    --project=integrations-379317 \
    --region=us-central1 \
    --gcpTempLocation=gs://dataflow-apache-quickstart_integrations-379317/temp/"  
```



