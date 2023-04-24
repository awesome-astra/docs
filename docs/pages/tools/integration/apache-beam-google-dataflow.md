## Overview

### 1. Apache Beam

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


### 2. Google DataFlow

??? abstract "Introduction to Google Dataflow"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_dataflow.png" height="30px" />

    Google Dataflow is an hosted version of `Apache Beam` running in google cloud platform, it is also called an **Apache Beam Runner** It allows users to build and execute data pipelines. It enables the processing of large amounts of data in a parallel and distributed manner, making it scalable and efficient. Dataflow supports both batch and streaming processing, allowing for real-time data analysis. Users can write data processing pipelines using a variety of programming languages such as Java, Python, and SQL. Dataflow  provides **native integration** with main Google Cloud services, such as **BigQuery** and **Pub/Sub**.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/dataflow-ecosystem.png" />

    Dataflow provides built-in integrations with most in use Google Cloud Platform products suchh as Cloud Storage, Pub/Sub, Datastore or Big Query. The plaform can be extended and run any java code and I/O connectors deployed form the CLI.

    > **Integration with DataStax** comes with the integration of proper runners but also some best practice on how to handle the credentials.
    
### 3. Integrating with Astra

??? abstract "DataFlow Access Patterns and Astra Interfaces"

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

    Now to leverage the split capabilities of Pulsar a `PulsarIO` is available since 2022. To know more about its development you can follow [this video](https://www.youtube.com/embed/xoQRDzqdODk) from the Beam Summit 2022.
    

## Apache Beam

### 1. Prerequisites 

<!-- Prequisites for Java And Maven -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-java-maven.md"

<!-- Prequisite Astra DB including SCB -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-astra-db-scb.md"

### 2. Installation and Setup

???+ abstract "Setup the `maven` project locally"

    - [x] **Clone the Repository with `AstraIO` and sample flows**

    ```
    git clone https://github.com/clun/astra-dataflow-starter.git
    ```

    - [x] **Build the project with maven**

    ```
    cd astra-dataflow-starter
    mvn clean install -Dmaven.test.skip=true
    ```

### 3. Bulk Data Load

???+ abstract "Description of Pipeline `BulkDataLoadWithBeam`."

    In this pipeline, 100 records are generated randomly to populate a table `simpledata` in Cassandra in AstraDB.The `simpledata` table looks like:

    ```sql
    CREATE TABLE simpledata (
        id int PRIMARY KEY,
        data text
    );
    ```

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/load-data-beam.png" />

??? abstract "Implementation of Pipeline `BulkDataLoadWithBeam`"

    - We create a pipeline with 3 arguments:

    | Parameter Name | Description |
    |:----------|:------|
    |  `token` | Credentials to connect to Astra platform, it should sart with `AstraCS:...` |
    | `secureConnectBundle` | Zip containing certificates to open a secured connection and endpoint definition to pick the proper database |
    |  `keyspace` | Target keyspace in Astra DB |

    - Those parameters are parsed using a specialized `PipelineOptions` interface

    ```java 
    public interface AstraPipelineOptions extends PipelineOptions {

    @Description("SecureConnectBundle")
    @Validation.Required
    String getSecureConnectBundle();
    void setSecureConnectBundle(String path);

    @Description("Astra Token")
    @Validation.Required
    String getToken();
    void setToken(String token);

    @Description("Target Keyspace")
    @Validation.Required
    String getKeyspace();
    void setKeyspace(String keyspace);
    ```

    - Parsing the inputs

    ```java
    AstraPipelineOptions astraOptions = PipelineOptionsFactory
            .fromArgs(args)
            .withValidation()
            .as(AstraPipelineOptions.class);
    Pipeline pipelineWrite = Pipeline.create(astraOptions);
    FileSystems.setDefaultPipelineOptions(astraOptions);
    ```

    - Run the pipeline

    ```java
     pipelineWrite
        // Create 100 records randomly
        .apply(Create.of(AstraIOTestUtils.generateTestData(100)))
        // Create the target table
        .apply(new CreateTableTransform<SimpleDataEntity>(astraOptions))
        // Write data in tables
        .apply(AstraIO.<SimpleDataEntity>write()
          .withToken(astraOptions.getToken())
          .withKeyspace(astraOptions.getKeyspace())
          .withSecureConnectBundle(new File(astraOptions.getSecureConnectBundle()))
          .withEntity(SimpleDataEntity.class));

    // Pipeline Execution
    pipelineWrite.run().waitUntilFinish();
    ```

??? abstract "Executing the Pipeline `BulkDataLoadWithBeam`."

    - [x] **Setup parameters**

    ```
    cd samples-astra-beam-pipelines
    export ASTRA_KEYSPACE=demo
    export ASTRA_SCB_PATH=/tmp/scb-demo.zip
    export ASTRA_TOKEN=AstraCS:uZclXTY....
    ```

    - [x] **Run the pipeline**

    ```
    mvn -Pdirect-runner compile \
      exec:java \
      -Dexec.mainClass=com.dtx.astra.pipelines.BulkDataLoadWithBeam \
      -Dexec.args="\
          --keyspace=${ASTRA_KEYSPACE} \
          --secureConnectBundle=${ASTRA_SCB_PATH} \
          --token=${ASTRA_TOKEN}"
    ```

    - [x] **Validate table `simpledata` has been populated**
    ```
    astra db cqlsh demo -k demo \
      -e "select * from simpledata" \
      --connect-timeout 20 \
      --request-timeout 20
    ```

### 4. Bulk Data Export

???+ abstract "Description of Pipeline `BulkDataExportWithBeam`"

    In this pipeline, the content of an Astra Table is exported as set of CSV Files. The read is split in token ranges for maximum performance (read are distributed accross the nodes). Multiple files are produced in the output directory.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/export-data-beam.png" />

??? abstract "Implementation of Pipeline `BulkDataExportWithBeam`"

    - We create a pipeline with 5 arguments:

    | Parameter Name | Description |
    |:----------|:------|
    |  `token` | Credentials to connect to Astra platform, it should sart with `AstraCS:...` |
    | `secureConnectBundle` | Zip containing certificates to open a secured connection and endpoint definition to pick the proper database |
    |  `keyspace`    | Target keyspace in Astra DB |
    |  `table`       | The table name to be exported |
    | `targetFolder` | Destination for the files on disk |

    - Those parameters are parsed using a specialized `PipelineOptions` interface:

    ```java 
    public interface ExportTablePipelineOptions extends PipelineOptions {

        @Description("AstraToken Value")
        @Validation.Required
        ValueProvider<String> getAstraToken();
        void setAstraToken(ValueProvider<String> token);

        @Description("Location of fie on disk")
        @Validation.Required
        ValueProvider<String> getSecureConnectBundle();
        void setSecureConnectBundle(ValueProvider<String> path);

        @Description("Source Keyspace")
        @Validation.Required
        String getKeyspace();
        void setKeyspace(String keyspace);

        @Description("Source Table")
        String getTable();
        void setTable(String table);

        @Description("Destination folder")
        @Validation.Required
        String getTargetFolder();
        void setTargetFolder(String folder);
    }
    ```

    - Iteam are read with a `AstraIO.read()` as entity, then serialized as string

    ```java
    @ProcessElement
    public void processElement(ProcessContext c) {
      String csvLine = c.element().getId() + ";" + c.element().getData();
      LOGGER.info("CSV Line: {}", csvLine);
      c.output(csvLine);
    }
    ```

    - Run the pipeline

    ```java
    // Build Read
        Pipeline exportCsvPipeline = Pipeline.create(options);
        exportCsvPipeline
                .apply("Read Table", AstraIO
                        .<SimpleDataEntity>read()
                        .withToken(options.getAstraToken().get())
                        .withSecureConnectBundle(new File(options.getSecureConnectBundle().get()))
                        .withKeyspace(options.getKeyspace())
                        .withTable(options.getTable())
                        .withCoder(SerializableCoder.of(SimpleDataEntity.class))
                        .withEntity(SimpleDataEntity.class))
                .apply("MapCsv", ParDo.of(new MapRecordAsCsvLine()))
                .apply("WriteCsvInCloudStorage", TextIO.write().to(options.getTargetFolder()));
        exportCsvPipeline
                .run()
                .waitUntilFinish(Duration.standardSeconds(30));
    ```

??? abstract "Executing of Pipeline `BulkDataExportWithBeam`"
    
    - [x] **Setup parameters**

    ```
    cd samples-astra-beam-pipelines
    export ASTRA_KEYSPACE=demo
    export ASTRA_SCB_PATH=/tmp/scb-demo.zip
    export ASTRA_TABLE=simpledata
    export DESTINATION=/tmp
    export ASTRA_TOKEN=AstraCS:uZclXTY....

    ```

    - [x] **Run the pipeline**

    ```
    mvn -Pdirect-runner compile exec:java \
      -Dexec.mainClass=com.dtx.astra.pipelines.BulkDataExportWithBeam \
      -Dexec.args="\
        --astraToken=${ASTRA_TOKEN} \
        --secureConnectBundle=${ASTRA_SCB_PATH} \
        --keyspace=${ASTRA_KEYSPACE} \
        --table=${ASTRA_TABLE} \
        --targetFolder=${DESTINATION}"
    ```

## Google DataFlow

### 1. Prerequisites 

<!-- Prequisites for Java And Maven -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-java-maven.md"

<!-- Prequisite Astra DB including SCB -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-astra-db-scb.md"

???+ abstract "Setup `GCP Project`"

    - [x] **1. Create project**

    In the Google Cloud console, on the project selector page, select or [create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

    > Note: If you don't plan to keep the resources that you create in this procedure, create a project instead of selecting an existing project. After you finish these steps, you can delete the project, removing all resources associated with the project. Create a new Project in Google Cloud Console or select an existing one.

    - [x] **2. Enable Billing**: Make sure that billing is enabled for your Cloud project. Learn how to [check if billing is enabled on a project](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled)

    - [x] **3. Save project ID**: The project identifier is available in the column `ID`. We will need it so let's save it as an environment variable

    ```
    export GCP_PROJECT_ID=integrations-379317
    export GCP_USER=cedrick.lunven@datastax.com
    export GCP_COMPUTE_ENGINE=747469159044-compute@developer.gserviceaccount.com
    ```

    - [x] **4. Download and install gCoud CLI**

    ```
    curl https://sdk.cloud.google.com | bash
    ```

    - [x] **5. Associated CLI with project in GCP**

    ```
    gcloud init
    ```

    - [x] **6. Describe the project**

    ```
    gcloud projects describe ${GCP_PROJECT_ID}
    ```

    - [x] **7. Enable expected API**

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/enable-apis.png" />
    
    ```
    gcloud services enable dataflow compute_component logging storage_component storage_api bigquery pubsub datastore.googleapis.com cloudresourcemanager.googleapis.com
    ```

    - [x] **8. Add Roles.** To complete the steps, your user account must have the Dataflow Admin role and the Service Account User role. The Compute Engine default service account must have the Dataflow Worker role. To add the required roles in the Google Cloud console:
    
    ```
    gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} --member="user:${GCP_USER}" --role=roles/iam.serviceAccountUser
    gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  --member="serviceAccount:${GCP_COMPUTE_ENGINE}" --role=roles/dataflow.admin
    gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  --member="serviceAccount:${GCP_COMPUTE_ENGINE}" --role=roles/dataflow.worker
    gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID}  --member="serviceAccount:${GCP_COMPUTE_ENGINE}" --role=roles/storage.objectAdmin
    ```

    - [x] **9. Create `buckets` for the project in cloud storage**

    ```
    gsutil mb -c STANDARD -l US gs://astra_dataflow_inputs
    gsutil mb -c STANDARD -l US gs://astra_dataflow_outputs
    gsutil ls
    ```

    - [x] **10. Create secrets for the project in secret manager**

    ```
    gcloud secrets add-iam-policy-binding cedrick-demo-scb \
        --member="serviceAccount:747469159044-compute@developer.gserviceaccount.com" \
        --role='roles/secretmanager.secretAccessor'
    gcloud secrets add-iam-policy-binding cedrick-demo-scb \
        --member="serviceAccount:747469159044-compute@developer.gserviceaccount.com" \
        --role='roles/secretmanager.secretAccessor'
    ```

    - [x] **11.  Check that your secrets can be read**

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


### 2. Bulk Data Load

???+ abstract "Description of Pipeline `BulkDataLoadWithDataFlow`"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/load-dataflow" />

??? abstract "Implementation of Pipeline `BulkDataLoadWithDataFlow`"

    `todo`

??? abstract "Execution of Pipeline `BulkDataLoadWithDataFlow`"

    `todo`

### 3. Bulk Data Export

???+ abstract "Description of Pipeline `BulkDataExportWithDataFlow`"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/export-dataflow" />

    
??? abstract "Implementation of Pipeline `BulkDataExportWithDataFlow`"

    `todo`

??? abstract "Execution of Pipeline `BulkDataExportWithDataFlow`"

    `todo`


