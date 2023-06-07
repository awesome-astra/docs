---
title: "GCP Dataflow"
description: "GCP DataFlow is a managed service for batch and streaming data processing pipelines. GCP DataFlow is based on Apache Beam."
tags: "java, third party tools, etl, workflow"
icon: "https://awesome-astra.github.io/docs/img/google-cloud-dataflow/dataflow-logo.svg"
recommended: "true"
developer_title: "Google"
developer_url: "https://cloud.google.com/dataflow/"
---

## GCP DataFlow and Apache Beam Overview

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

## A. Import CSV

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/csv-to-astra.png" />

### <span class="nosurface"> 1. </span> Access folder

```
cd samples-beam
pwd
```

### <span class="nosurface"> 2. </span> Setup Env variables

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace-name>
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
export ASTRA_TOKEN=<your-token>
```

### <span class="nosurface"> 3. </span> Run the demo

```
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.Csv_to_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --keyspace=${ASTRA_KEYSPACE} \
 --csvInput=`pwd`/src/test/resources/language-codes.csv"
```

### <span class="nosurface"> 4. </span> Check output data

```
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM languages LIMIT 10;"
```

## B. Export CSV

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-csv.png" />

### <span class="nosurface"> 1. Access folder</span> 

```bash
cd samples-beam
pwd
```

### <span class="nosurface"> 2. </span> Setup Env variables

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace-name>
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
export ASTRA_TOKEN=<your-token>
```

### <span class="nosurface"> 3. </span> Run the demo

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.AstraDb_To_Csv \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --keyspace=${ASTRA_KEYSPACE} \
 --table=languages \
 --csvOutput=`pwd`/src/test/resources/out/language"
```

### <span class="nosurface"> 4. </span> Check output data

```bash
ls -l `pwd`/src/test/resources/out
cat `pwd`/src/test/resources/out/language-00001-of-00004
```

## C. Import Cassandra Table

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/cassandra-to-astra.png" />

### <span class="nosurface"> 1. </span> Access folder

```bash
cd samples-beam
pwd
```

### <span class="nosurface"> 2. </span> Start Cassandra

- Project propose a docker-compose to run Cassandra locally. Use `docker-compose` to start the containers

```bash
docker-compose -f ./src/main/docker/docker-compose.yml up -d
```

- Wait a few seconds for Cassandra to Start.

```bash
docker-compose -f ./src/main/docker/docker-compose.yml ps | cut -b 55-61
```

- Validate Cassandra is ready

```bash
docker exec -it `docker ps | grep cassandra:4.1.1 | cut -b 1-12` cqlsh -e "SELECT data_center FROM system.local;"
```

### <span class="nosurface"> 3. </span> Setup Env variables

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace-name>
export ASTRA_SCB_PATH=<your-secure-connect-bundle>
export ASTRA_TOKEN=<your-token>
```

### <span class="nosurface"> 3. </span> Run the demo

```bash
 mvn clean compile exec:java \
 -Dexec.mainClass=com.datastax.astra.beam.Cassandra_To_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SCB_PATH} \
 --keyspace=${ASTRA_KEYSPACE} \
 --cassandraHost=localhost \
 --cassandraPort=9042 \
 --tableName=languages"
```

### <span class="nosurface"> 4. </span> Check output data

```bash
docker exec -it `docker ps \
  | grep cassandra:4.1.1 \
  | cut -b 1-12` \
  cqlsh -e "SELECT *  FROM samples_beam.languages LIMIT 10;"
```

- Validate Astra Table is populated

```bash
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM languages LIMIT 10;"
```

## D. Import from Cloud Storage

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/gcs-to-astra.png" />

### <span class="nosurface"> 1. </span> Create GCP Project

> Note: If you don't plan to keep the resources that you create in this guide, create a project instead of selecting an existing project. After you finish these steps, you can delete the project, removing all resources associated with the project. Create a new Project in Google Cloud Console or select an existing one.

In the Google Cloud console, on the project selector page, select or [create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

### <span class="nosurface"> 2. </span> Enable Billing 

Make sure that billing is enabled for your Cloud project. Learn how to [check if billing is enabled on a project](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled)

### <span class="nosurface"> 3. </span> Save project ID

_The project identifier is available in the column `ID`. We will need it so let's save it as an environment variable_

```bash
export GCP_PROJECT_ID=<your-gcp-project-id>
export GCP_PROJECT_CODE=<your-gcp-project-code>
export GCP_USER=<your-gcp-email>
export GCP_COMPUTE_ENGINE=${GCP_PROJECT_CODE}-compute@developer.gserviceaccount.com
```

### <span class="nosurface"> 4. </span> Install gCloud CLI

```
curl https://sdk.cloud.google.com | bash
```

### <span class="nosurface"> 5. </span> Login to gCloud

Run the following command to authenticate with Google Cloud:
```
gcloud auth login
```

### <span class="nosurface"> 6. </span> Setup your project 

- If you haven't set your project yet, use the following command to set your project ID:

```
gcloud config set project ${GCP_PROJECT_ID}
gcloud projects describe ${GCP_PROJECT_ID}
```

### <span class="nosurface"> 7. </span> Enable needed APIs

```
gcloud services enable dataflow compute_component \
   logging storage_component storage_api \
   bigquery pubsub datastore.googleapis.com \
   cloudresourcemanager.googleapis.com
```

### <span class="nosurface"> 8. </span> Add Roles

- To complete the steps, your user account must have the Dataflow Admin role and the Service Account User role. The Compute Engine default service account must have the Dataflow Worker role. To add the required roles in the Google Cloud console:

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

### <span class="nosurface"> 9. </span> Access Folder

- Make sure you are in `samples-dataflow` folder

```bash
cd samples-dataflow
pwd
```

### <span class="nosurface"> 10. </span> Create `buckets`

- Create the bucket for the for the project in cloud storage:

```bash
export GCP_BUCKET_INPUT=gs://astra_dataflow_inputs
gsutil mb -c STANDARD -l US ${GCP_BUCKET_INPUT}
```

- Copy the CSV file in the bucket

```bash
gsutil cp src/test/resources/language-codes.csv ${GCP_BUCKET_INPUT}/csv/
gsutil ls
```

### <span class="nosurface"> 11. </span> Create Secrets

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

### <span class="nosurface"> 12. </span> Create Keyspace

```bash

astra db create-keyspace demo -k samples_dataflow --if-not-exist
```

### <span class="nosurface"> 13 </span> Setup Env. variables

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_INPUT_CSV=${GCP_BUCKET_INPUT}/csv/language-codes.csv
```

### <span class="nosurface"> 14 </span> Run the demo

```bash
 mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.Gcs_To_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --keyspace=${ASTRA_KEYSPACE} \
 --csvInput=${GCP_INPUT_CSV} \
 --project=${GCP_PROJECT_ID} \
 --runner=DataflowRunner \
 --region=us-central1"
```
### <span class="nosurface"> 15 </span> Check output DATA

```bash
astra db cqlsh ${ASTRA_DB} \
   -k ${ASTRA_KEYSPACE} \
   -e "SELECT * FROM languages LIMIT 10;"
```

## E. Export to GCS

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-gcs.png" />

!!! note "Note"
        We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up.

### <span class="nosurface"> 1. </span> Environment Variables

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_PROJECT_ID=<your-gcp-project-id>
```

### <span class="nosurface"> 2. </span> Create output bucket

```bash
export GCP_OUTPUT_CSV=gs://astra_dataflow_outputs
gsutil mb -c STANDARD -l US ${GCP_OUTPUT_CSV}
```

### <span class="nosurface"> 3. </span> Access folder

```bash
cd samples-dataflow
pwd
```

### <span class="nosurface"> 4. </span> Run the pipeline

```bash
 mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.AstraDb_To_Gcs \
 -Dexec.args="\
 --astraToken=projects/747469159044/secrets/astra-token/versions/2 \
 --astraSecureConnectBundle=projects/747469159044/secrets/secure-connect-bundle-demo/versions/1 \
 --keyspace=samples_dataflow \
 --table=languages \
 --outputFolder=gs://astra_dataflow_output \
 --runner=DataflowRunner \
 --project=integrations-379317 \
 --region=us-central1"
```

## F. Export to BigQuery

!!! note "Note"
        We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up.

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-bigquery.png" />

### <span class="nosurface"> 1. </span> Access Folder

```bash
cd samples-dataflow
pwd
```

### <span class="nosurface"> 2. </span>Setup Env. Variables

```bash
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
export GCP_PROJECT_ID=<your-gcp-project-id>
```

### <span class="nosurface"> 3. </span>Create BigQuery dataset

- Create a dataset in `dataflow_input_us` BigQuery with the following command

```bash
export GCP_BIGQUERY_DATASET=dataflow_input_us
bq mk ${GCP_BIGQUERY_DATASET}
bq ls --format=pretty
```

### <span class="nosurface"> 4. </span>Create BigQuery Schema

- Create a json `schema_language_codes.json` file with the schema of the table** We have created it for you [here](samples-dataflow/src/main/resources/schema_language_codes.json)
 
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

### <span class="nosurface"> 5. </span>Create BigQuery Table

```bash
export GCP_BIGQUERY_TABLE=destination
bq mk --table --schema src/main/resources/schema_language_codes.json ${GCP_BIGQUERY_DATASET}.${GCP_BIGQUERY_TABLE}
```

### <span class="nosurface"> 6. </span>List tables dataset

```bash
bq ls --format=pretty ${GCP_PROJECT_ID}:${GCP_BIGQUERY_DATASET}
```

### <span class="nosurface"> 7. </span>Show Table schema

```bash
bq show --schema --format=prettyjson ${GCP_PROJECT_ID}:${GCP_BIGQUERY_DATASET}.${GCP_BIGQUERY_TABLE}
```

### <span class="nosurface"> 8. </span>Run the pipeline

```bash
mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.AstraDb_To_BigQuery \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --keyspace=${ASTRA_KEYSPACE} \
 --table=languages \
 --bigQueryDataset=${GCP_BIGQUERY_DATASET} \
 --bigQueryTable=${GCP_BIGQUERY_TABLE} \
 --runner=DataflowRunner \
 --project=${GCP_PROJECT_ID} \
 --region=us-central1"
```

### <span class="nosurface"> 9. </span>Show Output Table

```bash
bq head -n 10 ${GCP_BIGQUERY_DATASET}.${GCP_BIGQUERY_TABLE}
```

## G. Import From BigQuery

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/bigquery-to-astra.png" />
 
!!! note "Note"
    We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up. We also assume that you have a bigquery table populated as describe in `#F`,

### <span class="nosurface"> 1. </span>Access Folder

```bash
cd samples-dataflow
pwd
```

### <span class="nosurface"> 2. </span>Setup Env. Variables

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

### <span class="nosurface"> 2. </span>Clear astra table

```bash
astra db cqlsh ${ASTRA_DB} \
  -k ${ASTRA_KEYSPACE} \
  -e "TRUNCATE ${ASTRA_TABLE};"
```

### <span class="nosurface"> 3. </span>Clear the Pipeline

```bash
mvn compile exec:java \
 -Dexec.mainClass=com.datastax.astra.dataflow.BigQuery_To_AstraDb \
 -Dexec.args="\
 --astraToken=${ASTRA_SECRET_TOKEN} \
 --astraSecureConnectBundle=${ASTRA_SECRET_SECURE_BUNDLE} \
 --keyspace=${ASTRA_KEYSPACE} \
 --bigQueryDataset=${GCP_BIGQUERY_DATASET} \
 --bigQueryTable=${GCP_BIGQUERY_TABLE} \
 --runner=DataflowRunner \
 --project=${GCP_PROJECT_ID} \
 --region=us-central1"
```

### <span class="nosurface"> 4. </span>Check output data

```bash
astra db cqlsh ${ASTRA_DB} \
  -k ${ASTRA_KEYSPACE} \
  -e "select * FROM languages LIMIT 10;"
```

## H. Simple BigQuery export

<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-to-bigquery.png" />

!!! note "Note"
        We assume that you have already executed pipeline described in `D.1` to `D.5` and that gcloud is set up.

### <span class="nosurface"> 1. </span>Access Folder

```bash
cd samples-dataflow
pwd
```

### <span class="nosurface"> 2. </span>Setup Env. Variables

```bash
export GCP_PROJECT_ID=<your-gcp-project-id>
export GCP_PROJECT_CODE=<your-gcp-project-code>
export ASTRA_DB=<your-db-name>
export ASTRA_KEYSPACE=<your-keyspace>
export ASTRA_TABLE=<your-table>
export ASTRA_SECRET_TOKEN=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_TOKEN}/versions/1
export ASTRA_SECRET_SECURE_BUNDLE=projects/${GCP_PROJECT_CODE}/secrets/${GCP_SECRET_SECURE_BUNDLE}/versions/1
```

### <span class="nosurface"> 3. </span>Run the pipeline

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

### <span class="nosurface"> 4. </span>Show Content of Table

A dataset with the keyspace name and a table 
with the table name have been created in BigQuery.

```bash
bq head -n 10 ${ASTRA_KEYSPACE}.${ASTRA_TABLE}
```



