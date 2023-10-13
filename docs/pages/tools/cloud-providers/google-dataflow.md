---
title: "GCP Dataflow"
description: "GCP DataFlow is a managed service for batch and streaming data processing pipelines. GCP DataFlow is based on Apache Beam."
tags: "java, third party tools, etl, workflow"
icon: "https://awesome-astra.github.io/docs/img/google-cloud-dataflow/dataflow-logo.svg"
recommended: "true"
developer_title: "Google"
developer_url: "https://cloud.google.com/dataflow/"
---

## Overview

GCP DataFlow is a managed service for batch and streaming data processing pipelines and is based on Apache Beam. Apache Beam is an open-source, unified programming model for batch and streaming data processing pipelines which simplifies large-scale data processing dynamics. Thousands of organizations around the world choose Apache Beam due to its unique data processing features, proven scale, and powerful yet extensible capabilities.

- [Learn more about Apache Beam](https://beam.apache.org/get-started/beam-overview/)

<div class="nosurface" markdown="1">
??? abstract "Apache Beam Overview"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_beam.png" />

    **Objectives**

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/apache_beam.png" />

    **Main Concepts**

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/beam_concepts.png" />

    - **`Pipeline`:** A `Pipeline` encapsulates your entire data processing task, from start to finish. This includes reading input data, transforming that data, and writing output data. All Beam driver programs must create a Pipeline. When you create the Pipeline, you must also specify the execution options that tell the Pipeline where and how to run.

    - **`PCollection`**: A `PCollection` represents a distributed data set that your Beam pipeline operates on. The data set can be bounded, meaning it comes from a fixed source like a file, or unbounded, meaning it comes from a continuously updating source via a subscription or other mechanisms. Your pipeline typically creates an initial PCollection by reading data from an external data source, but you can also create a PCollection from in-memory data within your driver program. From there, PCollections are the inputs and outputs for each step in your pipeline.

    - **`PTransform`:** A `PTransform` represents a data processing operation, or a step, in your pipeline. Every PTransform takes one or more PCollection objects as input, performs a processing function that you provide on the elements of that PCollection, and produces zero or more output PCollection objects.

    - **Input and Output so called `I/O transforms`**: Beam comes with a number of “IOs” - library PTransforms that read or write data to various external storage systems.

    **I/O Connectors**
    
    Apache Beam I/O connectors provide read and write transforms for the most popular data storage systems so that Beam users can benefit from natively optimised connectivity. With the available I/Os, Apache Beam pipelines can read and write data to and from an external storage type in a unified and distributed way.

    > **Integration with DataStax Astra is inspired by the built-in `CassandraIO` and `PulsarIO` connectors**. This integration leverages a new **`AstraIO`** connector.

    **Runners**

    A runner in Apache Beam is responsible for executing pipelines on a particular processing engine or framework, such as Apache Flink or Google Cloud Dataflow. The runner translates the Beam pipeline into the appropriate format for the underlying engine, manages job execution, and provides feedback on job progress and status.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/runners.png" />

</div>

- [Learn more about Google DataFlow](https://cloud.google.com/dataflow/)

<div class="nosurface" markdown="1">
??? abstract "Rational on technical integrations Choices"

    Astra allows both bulk and real time operations through AstraDB and Astra Streaming. For each service there are multiple interfaces available and integration with Apache Beam/Google Dataflow is possible in different ways. Some of the design choices for this integration are below:

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-interfaces.png" />

    **Data Bulk Operations**

    The Astra service which handles massive amount of data is `Astra DB`. It provides multiples ways to load data but some methods are preferred over others.

    - **`Cassandra and CQL`: This is the way to go.** It is the most mature and provides an efficient way to execute queries. With the native drivers you can run reactive queries and token range queries to distribute the load across the nodes.  This is the approach that was taken with the original `CassandraIO` connector. The existing `CassandraIO` connector does not support Astra but we leveraged it to create a new `AstraIO` connector.

    - **`CQL over REST`**: This interface can be use with any HTTP client. While the Astra SDKs provides a built-in client, this interface is not the best for bulk loading as it introduces an extra layer of serialization.

    - **`CQL over GraphQL`**: This interface can be used with any HTTP Client. While the Astra SDKs provides a built-in client, this interface is not the best for bulk loading as it introduces an extra layer of serialization.

    - **`CQL over GRPC`**: This interface is stateless, with an optimized serialization component (grpc), and reactive interfaces so it is a viable option. Currently, the operations exposed are CQL and the token metadata information is not available to perform range queries.

    **Data Streaming Operations**

    The Astra service to handle streaming data is `Astra Streaming`. It provides multiple interfaces like `JMS`, `RabbitMQ`, `Kafka`, and built-in Apache Beam support is available in [standard connectors](https://beam.apache.org/documentation/io/connectors/).

    To leverage the split capabilities of Pulsar, a `PulsarIO` connector was released in 2022. To learn more about its development you can follow [this video](https://www.youtube.com/embed/xoQRDzqdODk) from the Beam Summit 2022.

</div>

- Connectivity to Astra is implemented through a custom I/O Connector named `beam-sdks-java-io-astra` available on central Maven.

<div class="nosurface" markdown="1">
??? abstract "AstraDBIO Connector"

    The Astra I/O connectors implements the different operations needed across the pipelines in the page: Read, Write, Delete, ReadAll.

    This is the dependency to add to the project.

    ```xml
    <dependency>
       <groupId>com.datastax.astra</groupId>
       <artifactId>beam-sdks-java-io-astra</artifactId>
       <version>${latest-version}</version>
    </dependency>
    ```

    - **Read From Astra**

    To Read Data from AstraDb use `AstraDbIO.Read<Entity>` where the entity should be a `Serializable` object. In the sample we can leverage the cassandra object mapping of Driver 4x.

    ```java
    byte[] scbZip = ...
   
    AstraDbIO.Read<LanguageCode> read = AstraDbIO.<LanguageCode>read()
      .withToken("token")
      .withKeyspace("keyspace")
      .withSecureConnectBundle(scbZip)
      .withTable("table")
      .withMinNumberOfSplits(20)
      .withCoder(SerializableCoder.of(LanguageCode.class))
      .withMapperFactoryFn(new LanguageCodeDaoMapperFactoryFn())
      .withEntity(LanguageCode.class);
    ```

    - The `mapperFactoryFn` should implements ` SerializableFunction<CqlSession, AstraDbMapper<Entity>>`

    - You can also specify a query, the table is name is not mandatory anymore

    ```java
     AstraDbIO.Read<LanguageCode> read2 = AstraDbIO.<LanguageCode>read()
      .withToken("token")
      .withKeyspace("keyspace")
      .withSecureConnectBundle(scbZip)
      .withQuery("select * from table where ...")
      .withMinNumberOfSplits(20)
      .withCoder(SerializableCoder.of(LanguageCode.class))
      .withMapperFactoryFn(new LanguageCodeDaoMapperFactoryFn())
      .withEntity(LanguageCode.class);
    ```

    - **Write data into Astra**

    To write Data into Astra use the `AstraDbIO.Write<Entity>`

    ```java
    AstraDbIO.Write<LanguageCode> write = AstraDbIO.<LanguageCode>write()
      .withToken("token")
      .withKeyspace("keyspace")
      .withSecureConnectBundle(scbZip)
      .withMapperFactoryFn(new LanguageCodeDaoMapperFactoryFn())
      .withEntity(LanguageCode.class);
    ```

</div>

## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have Java11+, Maven, and Git installed</li>
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
    
</ul>

<div class="nosurface" markdown="1">
<!-- Prequisites for Java And Maven -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-java-maven.md"
</div>

<div class="nosurface" markdown="1">
<!-- Prequisite Astra DB including SCB -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-astra-db-scb.md"
</div>


## Installation and Setup

- Clone the Repository with sample flows. The different flows are distributed in 2 different modules. `sample-beams` contains flows that do not interact with Google Cloud solutions and will be run with a direct runner. `sample-dataflows` contains flows that could be executed.

```bash
git clone https://github.com/DataStax-Examples/astra-dataflow-starter.git
```

- Navigate to the repository and build the project with maven.

```bash
cd astra-dataflow-starter
mvn clean install -Dmaven.test.skip=true
```

<div class="nosurface" markdown="1">
??? abstract "More on the `maven` project setup locally"

    - [x] **Clone the Repository with `AstraIO` and sample flows**

    ```
    git clone https://github.com/DataStax-Examples/astra-dataflow-starter.git
    ```

    - [x] **Build the project with maven**

    ```
    cd astra-dataflow-starter
    mvn clean install -Dmaven.test.skip=true
    ```

    The different flows are distributed in 2 different modules: 
    
    - `sample-beams` contains flows that do not interact with Google Cloud solutions and will be run with a direct runner. 
    
    <img src="../../../../img/google-cloud-dataflow/flows-locally.png" />

    - `sample-dataflows` contains flow that could be executed 

    <img src="../../../../img/google-cloud-dataflow/flows-dataflows.png" />
</div>    

## Beam Samples


### 1. Import a CSV File

> In this flow a `CSV` file is parsed to populate a table with same structure in Astra. The mapping from CSV to the table is done manually. The dataset is a list of languages.

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/csv-to-astra.png" />

- **Access folder `samples-beam` in the project.**

```
cd samples-beam
pwd
```

- **Setup Environment variables**

```bash
# Database name (use with CLI)
export ASTRA_DB=<your-db-name>
# Keyspace name 
export ASTRA_KEYSPACE=<your-keyspace-name>
# Path of local secure connect bundle
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
# Astra Token starting by AstraCS:...
export ASTRA_TOKEN=<your-token>
```

- **Run Beam pipeline**

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.Csv_to_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --csvInput=`pwd`/src/test/resources/language-codes.csv"
```

- **Check output data in Astra**

```bash
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM languages LIMIT 10;"
```

### 2. Export Table as CSV

> In this flow a Cassandra table is exported as a CSV file. The mapping from table to csv row is done manually. The same objects are reused from `#1`

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-csv.png" />

- **Access folder**


```
cd samples-beam
pwd
```

- **Setup Environment variables**

```bash
# Database name (use with CLI)
export ASTRA_DB=<your-db-name>
# Keyspace name 
export ASTRA_KEYSPACE=<your-keyspace-name>
# Path of local secure connect bundle
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
# Astra Token starting by AstraCS:...
export ASTRA_TOKEN=<your-token>
```

- **Run Beam pipeline**

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.AstraDb_To_Csv \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --table=languages \
 --csvOutput=`pwd`/src/test/resources/out/language"
```

- **Check output data in astra**

```bash
ls -l `pwd`/src/test/resources/out
cat `pwd`/src/test/resources/out/language-00001-of-00004
```

### 3. Import Cassandra Table

> Similar to ZDM a cassandra Table is imported into Astra. We are reusing the same data model as before. Mapping is manual. We can note that Cassandra reading is operated with `CassandraIO` (driver3x) where the load is done with `AstraDbIO` (drivers4x).

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/cassandra-to-astra.png" />

- **Access folder**

```bash
cd samples-beam
pwd
```

- **Start Cassandra as a docker image with docker compose**: Project propose a docker-compose to run Cassandra locally. Use `docker-compose` to start the containers

```bash
docker-compose -f ./src/main/docker/docker-compose.yml up -d
```

- **Wait a few seconds for Cassandra to Start.** The following command give you the status of the container

```bash
docker-compose -f ./src/main/docker/docker-compose.yml ps | cut -b 55-61
```

- **Validate Cassandra is ready**: By connecting with `cqlsh` and displaying the datacenter.

```bash
docker exec -it `docker ps | \
  grep cassandra:4.1.1 | \
  cut -b 1-12` cqlsh -e "SELECT data_center FROM system.local;"
```

- **Setup Env variables**

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace-name>
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
export ASTRA_TOKEN=<your-token>
```

- **Run the pipeline**: Keyspaces and Tables are created in local cassandra before starting the copy into Astra.

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.Cassandra_To_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --cassandraHost=localhost \
 --cassandraKeyspace=demo \
 --cassandraTableName=languages \
 --cassandraPort=9042 \
 --tableName=languages"
```

- **Check data in Cassandra with `cqlsh`**

```bash
docker exec -it `docker ps \
  | grep cassandra:4.1.1 \
  | cut -b 1-12` \
  cqlsh -e "SELECT *  FROM samples_beam.languages LIMIT 10;"
```

- **Check data in Astra destination with `cqlsh` (CLI)**

```bash
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM languages LIMIT 10;"
```

### 4. Generative AI

> This use cases is divided in 2 flows. In the first step we will import a CSV file as before mapping the CSV schema in destination table. Second flow will alter the table to add the embeddings vector and populate it after calling [OpenAI Embedding API](https://platform.openai.com/docs/guides/embeddings)

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/genai-01.png" />


- **Access folder**

```bash
cd samples-beam
pwd
```

- **Setup Env variables**

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace-name>
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
export ASTRA_TOKEN=<your-token>
```

- **Import Data with first flow**

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.genai.GenAI_01_ImportData \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --csvInput=`pwd`/src/main/resources/fables_of_fontaine.csv"
```

A table is created with the following structure:

```sql
CREATE TABLE IF NOT EXISTS ai.fable (
    document_id text PRIMARY KEY,
    document text,
    title text
);
```

- **Check output data in Astra**

```bash
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM fable LIMIT 10;"
```

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/genai-02.png" />


- **Add extra environment variables**

```bash
export ASTRA_TABLE=fable
export OPENAI_KEY=<change_me>
```

- **Run pipeline**

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.genai.GenAI_02_CreateEmbeddings \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --openAiKey=${OPENAI_KEY} \
 --table=${ASTRA_TABLE}"
```

## Google Dataflow Samples

### 1. Setup gCloud CLI

- **Create GCP Project**

> Note: If you don't plan to keep the resources that you create in this guide, create a project instead of selecting an existing project. After you finish these steps, you can delete the project, removing all resources associated with the project. Create a new Project in Google Cloud Console or select an existing one.

In the Google Cloud console, on the project selector page, select or [create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

- **Enable Billing**

Make sure that billing is enabled for your Cloud project. Learn how to [check if billing is enabled on a project](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled)

- **Save project ID**

_The project identifier is available in the column `ID`. We will need it so let's save it as an environment variable_

```bash
export GCP_PROJECT_ID=<your-gcp-project-id>
export GCP_PROJECT_CODE=<your-gcp-project-code>
export GCP_USER=<your-gcp-email>
export GCP_COMPUTE_ENGINE=${GCP_PROJECT_CODE}-compute@developer.gserviceaccount.com
```

- **Install gCloud CLI**

```
curl https://sdk.cloud.google.com | bash
```

- **Login to gCloud**: Run the following command to authenticate with Google Cloud:

```
gcloud auth login
```

- **Setup your project**: If you haven't set your project yet, use the following command to set your project ID:

```
gcloud config set project ${GCP_PROJECT_ID}
gcloud projects describe ${GCP_PROJECT_ID}
```

- **Enable needed APIs**

```
gcloud services enable dataflow compute_component \
   logging storage_component storage_api \
   bigquery pubsub datastore.googleapis.com \
   cloudresourcemanager.googleapis.com
```

- **Add Roles**

To complete the steps, your user account must have the Dataflow Admin role and the Service Account User role. The Compute Engine default service account must have the Dataflow Worker role. To add the required roles in the Google Cloud console:

```
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
    --member="user:${GCP_USER}" \
    --role=roles/iam.serviceAccountUser
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  \
    --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
    --role=roles/dataflow.admin
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  \
    --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
    --role=roles/dataflow.worker
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  \
    --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
    --role=roles/storage.objectAdmin
```

### 2. GCS to AstraDB

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/gcs-to-astra.png" />


- **Access Folder**

- Make sure you are in `samples-dataflow` folder

```bash
cd samples-dataflow
pwd
```

- **Create `buckets`**: Create the bucket for the for the project in cloud storage:

```bash
export GCP_BUCKET_INPUT=gs://astra_dataflow_inputs
gsutil mb -c STANDARD -l US ${GCP_BUCKET_INPUT}
```

Copy the CSV file in the bucket

```bash
gsutil cp src/test/resources/language-codes.csv ${GCP_BUCKET_INPUT}/csv/
gsutil ls
```

- **Create Secrets**

[Create secrets for the project in secret manager](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#secretmanager-create-secret-gcloud)**. To connect to `AstraDB` you need a token (credentials) and a zip used to secure the transport. Those two inputs should be defined as _secrets_.

```bash
export GCP_SECRET_TOKEN=token
export GCP_SECRET_SECURE_BUNDLE=cedrick-demo-scb
gcloud secrets create ${GCP_SECRET_TOKEN} \
  --data-file <(echo -n "${ASTRA_TOKEN}") \
  --replication-policy="automatic"

gcloud secrets add-iam-policy-binding ${GCP_SECRET_TOKEN} \
   --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
   --role='roles/secretmanager.secretAccessor'

gcloud secrets create ${GCP_SECRET_SECURE_BUNDLE} \
  --data-file ${ASTRA_SCB_PATH} \
  --replication-policy="automatic"

gcloud secrets add-iam-policy-binding ${GCP_SECRET_SECURE_BUNDLE} \
   --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
   --role='roles/secretmanager.secretAccessor'
        
gcloud secrets list
```

- **Create Keyspace**

```bash
astra db create-keyspace demo \
   -k samples_dataflow \
   --if-not-exist
```

- **Setup Env. variables**

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_INPUT_CSV=${GCP_BUCKET_INPUT}/csv/language-codes.csv
```

- **Run the demo**

```bash
 mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.Gcs_To_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --csvInput=${GCP_INPUT_CSV} \
 --project=${GCP_PROJECT_ID} \
 --runner=DataflowRunner \
 --region=us-central1"
```

- **Check Astra table is populated**

```bash
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM languages LIMIT 10;"
```

### 3. AstraDb to GCS

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-gcs.png" />

<admonition markdown="1">
!!! note "Note"
    We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up.
</admonition>

- **Environment Variables**

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_TABLE=<your-table>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_PROJECT_ID=<your-gcp-project-id>
```

- **Create output bucket**

```bash
export GCP_OUTPUT_CSV=gs://astra_dataflow_outputs
gsutil mb -c STANDARD -l US ${GCP_OUTPUT_CSV}
```

- **Access folder**

```bash
cd samples-dataflow
pwd
```

- **Run the pipeline**

```bash
 mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.AstraDb_To_Gcs \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --table=${ASTRA_TABLE} \
 --outputFolder=${GCP_OUTPUT_CSV} \
 --project=${GCP_PROJECT_ID} \
 --runner=DataflowRunner \
 --region=us-central1"
```

### 4. AstraDb to BigQuery

<admonition markdown="1">
!!! note "Note"
    We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up.
</admonition>

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-bigquery.png" />

- **Access Folder**

```bash
cd samples-dataflow
pwd
```

- **Setup Env. Variables**

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_PROJECT_ID=<your-gcp-project-id>
```

- **Create BigQuery dataset**

- Create a dataset in `dataflow_input_us` BigQuery with the following command

```bash
export GCP_BIGQUERY_DATASET=dataflow_input_us
bq mk ${GCP_BIGQUERY_DATASET}
bq ls --format=pretty
```

- **Create BigQuery Schema**

- Create a json `schema_language_codes.json` file with the schema of the table** We have created it for you [here](https://github.com/DataStax-Examples/astra-dataflow-starter/blob/main/samples-dataflow/src/main/resources/schema_language_codes.json)
 
```json
[
  {
    "mode": "REQUIRED",
    "name": "code",
    "type": "STRING"
  },
  {
    "mode": "REQUIRED",
    "name": "language",
    "type": "STRING"
  }
]
```

- **Create BigQuery Table**

```bash
export GCP_BIGQUERY_TABLE=destination
bq mk --table --schema src/main/resources/schema_language_codes.json ${GCP_BIGQUERY_DATASET}.${GCP_BIGQUERY_TABLE}
```

- **List tables dataset**

```bash
bq ls --format=pretty ${GCP_PROJECT_ID}:${GCP_BIGQUERY_DATASET}
```

- **Show Table schema**

```bash
bq show --schema --format=prettyjson ${GCP_PROJECT_ID}:${GCP_BIGQUERY_DATASET}.${GCP_BIGQUERY_TABLE}
```

- **>Run the pipeline**

```bash
mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.AstraDb_To_BigQuery \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --table=languages \
 --bigQueryDataset=${GCP_BIGQUERY_DATASET} \
 --bigQueryTable=${GCP_BIGQUERY_TABLE} \
 --runner=DataflowRunner \
 --project=${GCP_PROJECT_ID} \
 --region=us-central1"
```

- **Show Output Table**

```bash
bq head -n 10 ${GCP_BIGQUERY_DATASET}.${GCP_BIGQUERY_TABLE}
```

### 5. BigQuery to AstraDb

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/bigquery-to-astra.png" />
 
<admonition markdown="1">
!!! note "Note"
    We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up. We also assume that you have a bigquery table populated as describe in `#F`,
</admonition>

- **Access Folder**

```bash
cd samples-dataflow
pwd
```

- **Setup Env. Variables**

_Replace with values coming from your gcp project. 
The destination table has been created in flow `3.3`_

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_TABLE=languages
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_PROJECT_ID=<your-gcp-project-id>
export GCP_BIGQUERY_DATASET=dataflow_input_us
export GCP_BIGQUERY_TABLE=destination
```

- **Clear astra table**

```bash
astra db cqlsh ${ASTRA_DB} \
  -k ${ASTRA_KEYSPACE} \
  -e "TRUNCATE ${ASTRA_TABLE};"
```

- **Clear the Pipeline**

```bash
mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.BigQuery_To_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --astraKeyspace=${ASTRA_KEYSPACE} \
 --bigQueryDataset=${GCP_BIGQUERY_DATASET} \
 --bigQueryTable=${GCP_BIGQUERY_TABLE} \
 --runner=DataflowRunner \
 --project=${GCP_PROJECT_ID} \
 --region=us-central1"
```

- **Check output data**

```bash
astra db cqlsh ${ASTRA_DB} \
  -k ${ASTRA_KEYSPACE} \
  -e "select * FROM languages LIMIT 10;"
```

### 6. BigQuery Dynamic Mapping

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-bigquery.png" />

<admonition markdown="1">
!!! note "Note"
    We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up.
</admonition>

- **Access Folder**

```bash
cd samples-dataflow
pwd
```

- **Setup Env. Variables**

```bash
export GCP_PROJECT_ID=<your-gcp-project-id>
export GCP_PROJECT_CODE=<your-gcp-project-code>
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_TABLE=<your-table>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
```

- **Run the pipeline**

```bash
mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.AstraDb_To_BigQuery_Dynamic \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --keyspace=${ASTRA_KEYSPACE} \
 --table=${ASTRA_TABLE} \
 --runner=DataflowRunner \
 --project=${GCP_PROJECT_ID} \
 --region=us-central1"
```

- **Show Content of Table**

A dataset with the keyspace name and a table 
with the table name have been created in BigQuery.

```bash
bq head -n 10 ${ASTRA_KEYSPACE}.${ASTRA_TABLE}
```

