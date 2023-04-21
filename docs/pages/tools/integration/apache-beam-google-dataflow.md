## Apache Beam Overview

??? abstract "Introduction to Apache Beam"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_beam.png" />

    **Objectives**

    [Apache Beam](https://beam.apache.org/) is an open-source, unified programming model for batch and streaming data processing pipelines that simplifies large-scale data processing dynamics. Thousands of organizations around the world choose Apache Beam due to its unique data processing features, proven scale, and powerful yet extensible capabilities.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/apache_beam.png" />

    **Main Concepts**

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/beam_concepts.png" />

    - **`Pipeline`:** A `Pipeline` encapsulates your entire data processing task, from start to finish. This includes reading input data, transforming that data, and writing output data. All Beam driver programs must create a Pipeline. When you create the Pipeline, you must also specify the execution options that tell the Pipeline where and how to run.

    - **`PCollection`**: A `PCollection` represents a distributed data set that your Beam pipeline operates on. The data set can be bounded, meaning it comes from a fixed source like a file, or unbounded, meaning it comes from a continuously updating source via a subscription or other mechanism. Your pipeline typically creates an initial PCollection by reading data from an external data source, but you can also create a PCollection from in-memory data within your driver program. From there, PCollections are the inputs and outputs for each step in your pipeline.

    - **`PTransform`:** A `PTransform` represents a data processing operation, or a step, in your pipeline. Every PTransform takes one or more PCollection objects as input, performs a processing function that you provide on the elements of that PCollection, and produces zero or more output PCollection objects.

    - **Input and Output so called `I/O transforms`**: Beam comes with a number of “IOs” - library PTransforms that read or write data to various external storage systems.

    **I/O Connectors**
    
    Apache Beam I/O connectors provide read and write transforms for the most popular data storage systems so that Beam users can benefit from native optimised connectivity. With the available I/Os, Apache Beam pipelines can read and write data from and to an external storage type in a unified and distributed way.

    > **Integration with DataStax Astra we will leverage or get inspiration from both built-in`CassandraIO` and `PulsarIO`**. Now specifities of Astra requires a dedicated **`AstraIO`**.

    **Runners**

    A runner in Apache Beam is responsible for executing pipelines on a particular processing engine or framework, such as Apache Flink or Google Cloud Dataflow. The runner translates the Beam pipeline into the appropriate format for the underlying engine, manages job execution, and provides feedback on job progress and status.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/runners.png" />


## Google DataFlow Overview

??? abstract "Introduction to Google Dataflow"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_dataflow.png" height="30px" />

    Google Dataflow is an hosted version of `Apache Beam` running in google cloud platform, it is also called an **Apache Beam Runner** It allows users to build and execute data pipelines. It enables the processing of large amounts of data in a parallel and distributed manner, making it scalable and efficient. Dataflow supports both batch and streaming processing, allowing for real-time data analysis. Users can write data processing pipelines using a variety of programming languages such as Java, Python, and SQL. Dataflow  provides **native integration** with main Google Cloud services, such as **BigQuery** and **Pub/Sub**.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/dataflow-ecosystem.png" />

    Dataflow provides built-in integrations with most in use Google Cloud Platform products suchh as Cloud Storage, Pub/Sub, Datastore or Big Query. The plaform can be extended and run any java code and I/O connectors deployed form the CLI.

    > **Integration with DataStax** comes with the integration of proper runners but also some best practice on how to handle the credentials.
    
## Integrating Beam and Astra

???+ abstract "Use cases and Interfaces"

    Astra allows both bulk and real time operations with respectively AstraDB and Astra Streaming. For each service there are multiple interfaces available and as such integrating with Dataflow is possible in different ways.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/astra-interfaces.png" />

    **Data Bulk Operations**

    Astra service to handle massive amount of Data is `Astra DB`. It provides multiples ways to load data but some are preferred over others.

    - **`Cassandra and CQL`: This is the way to go.** It is the most mature provides efficient way to execute queries. With the native drivers you can run reactive queries and token range queries to distribute the load across nodes.  This is the approach taken with the build-in IO `CassandraIO`. Now `CassandraIO` is outdated and does not support and we leveraged it to create `AstraIO`.

    - **`CQL over REST`**: This interface can be use with any HTTP Client. Now Astra SDKs provides you a built-in client. The interface is not the best for bulk loading at it introduces an extra layer of serialization.

    - **`CQL over GraphQL`**: This interface can be use with any HTTP Client. Now Astra SDKs provides you a built-in client. The interface is not the best for bulk loading at it introduces an extra layer of serialization.

    - **`CQL over GRPC`**: Consider as a cloud native drivers (stateless) with an optimize serialization complnent (grpc) and reactive interfaces it is a viable interface. Now current operations exposes are CQL and the token metadata informations are not available to perform range queries.

    **Data Streaming Operations**

    Astra service to handle streaming data is `Astra Streaming`. It provides multiples interfaces like `JMS`, `RabbitMQ` or `Kafka` built-in Apache Bean and available in [standard connector](https://beam.apache.org/documentation/io/connectors/).

    Now to leverage the split capabilities of Pulsar a `PulsarIO` is available since 2022. To know more about its development you can follow [this video]() from the Beam Summit 2022.

    ![](https://www.youtube.com/embed/xoQRDzqdODk)
    

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

<!-- Prequisites for Java And Maven -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-java-maven.md"

<!-- Prequisite Astra DB including SCB -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-astra-db-scb.md"

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



