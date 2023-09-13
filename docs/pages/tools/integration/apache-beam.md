<img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_beam.png" />

## Overview

!!! note "[Beam Official documentation](https://beam.apache.org/get-started/beam-overview/)"

Apache Beam is an open-source, unified programming model for batch and streaming data processing pipelines which simplifies large-scale data processing dynamics. Thousands of organizations around the world choose Apache Beam due to its unique data processing features, proven scale, and powerful yet extensible capabilities.

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

## Examples

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