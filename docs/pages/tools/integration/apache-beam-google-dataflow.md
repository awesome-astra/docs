???+ abstract "Integrating Astra and Beam/Dataflow"

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
    

## Apache Beam

### 1. Overview

??? abstract "Introduction to Apache Beam"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_beam.png" />

    **Objectives**

    [Apache Beam](https://beam.apache.org/) is an open-source, unified programming model for batch and streaming data processing pipelines that simplifies large-scale data processing dynamics. Thousands of organizations around the world choose Apache Beam due to its unique data processing features, proven scale, and powerful yet extensible capabilities.

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

### 2. Prerequisites 

<!-- Prequisites for Java And Maven -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-java-maven.md"

<!-- Prequisite Astra DB including SCB -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-astra-db-scb.md"

### 3. Installation and Setup

???+ abstract "Setup the `maven` project locally"

    - [x] **Clone the Repository with `AstraIO` and sample flows**

    ```
    git clone https://github.com/DataStax-Examples/astra-dataflow-starter.git
    ```

    - [x] **Build the project with maven**

    ```
    cd astra-dataflow-starter
    mvn clean install -Dmaven.test.skip=true
    ```

    - In this page multiple flows will be described and this is how the project is defined:

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/java-project.png" />

### 4. Bulk Data Load

???+ abstract "Description of Pipeline `BulkDataLoadWithBeam`."

    In this pipeline, 100 records are generated randomly to populate a table `simpledata` in AstraDB. The `simpledata` table looks like the following:

    ```sql
    CREATE TABLE simpledata (
        id int PRIMARY KEY,
        data text
    );
    ```

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/load-data-beam.png" />

??? abstract "Implementation of Pipeline `BulkDataLoadWithBeam`"

    - The pipeline requires 3 arguments:

    | Parameter Name | Description |
    |:----------|:------|
    |  `token` | Credentials to connect to the Astra platform, it should start with `AstraCS:...` |
    | `secureConnectBundle` | Zip containing certificates to open a secured connection and endpoint definition to pick the proper database |
    |  `keyspace` | Target keyspace in Astra DB |

    - Parameters are defined in a specialized interface `LoadDataPipelineOptions` inheriting from `PipelineOptions`

    ```java 
    /**
     * Interface definition of parameters needed for this pipeline
     */
    public interface LoadDataPipelineOptions extends PipelineOptions {

      @Description("The Zip file to secure the transport (secure connect bundle)")
      @Validation.Required
      String getSecureConnectBundle();
      void setSecureConnectBundle(String path);

      @Description("The token used as credentials (Astra Token)")
      @Validation.Required
      String getToken();
      void setToken(String token);

      @Description("Target Keyspace in the database")
      @Validation.Required
      String getKeyspace();
      void setKeyspace(String keyspace);
    }
    ```

    - Parameters are marshalled all the time with a `PipelineOptionsFactory.fromArgs(args)`.

    ```java
    LoadDataPipelineOptions astraOptions = PipelineOptionsFactory
            .fromArgs(args)
            .withValidation()
            .as(LoadDataPipelineOptions.class);
    FileSystems.setDefaultPipelineOptions(astraOptions);
    ```

    - Run the pipeline

    ```java
     // Create a pipeline with the options
     Pipeline pipelineWrite = Pipeline.create(astraOptions);

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
      -Dexec.mainClass=com.dtx.astra.pipelines.beam.BulkDataLoadWithBeam \
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

### 5. Bulk Data Export

???+ abstract "Description of Pipeline `BulkDataExportWithBeam`"

    In this pipeline, the contents of an Astra table are exported as set of CSV files. The read is split in token ranges for maximum performance (reads are distributed accross the nodes). Multiple files are produced in the output directory.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/export-data-beam.png" />

??? abstract "Implementation of Pipeline `BulkDataExportWithBeam`"

    - The pipeline requires 5 arguments:

    | Parameter Name | Description |
    |:----------|:------|
    |  `token` | Credentials to connect to the Astra platform, it should sart with `AstraCS:...` |
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

    - Items are read with a `AstraIO.read()` as an entity, then serialized as a String

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
      .apply("WriteCsvInLocally", TextIO.write().to(options.getTargetFolder()));
    
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
      -Dexec.mainClass=com.dtx.astra.pipelines.beam.BulkDataExportWithBeam \
      -Dexec.args="\
        --astraToken=${ASTRA_TOKEN} \
        --secureConnectBundle=${ASTRA_SCB_PATH} \
        --keyspace=${ASTRA_KEYSPACE} \
        --table=${ASTRA_TABLE} \
        --targetFolder=${DESTINATION}"
    ```

## Google DataFlow

### 1. Overview

??? abstract "Introduction to Google Dataflow"

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/logo_dataflow.png" height="30px" />

    Google Dataflow is an hosted version of `Apache Beam` running in the Google Cloud Platform, it is also called an **Apache Beam Runner** It allows users to build and execute data pipelines. It enables the processing of large amounts of data in a parallel and distributed manner, making it scalable and efficient. Dataflow supports both batch and streaming processing, allowing for real-time data analysis. Users can write data processing pipelines using a variety of programming languages such as Java, Python, and SQL. Dataflow  provides **native integration** with main Google Cloud services, such as **BigQuery** and **Pub/Sub**.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/dataflow-ecosystem.png" />

    Dataflow provides built-in integrations with most in use Google Cloud Platform products suchh as Cloud Storage, Pub/Sub, Datastore or Big Query. The plaform can be extended and run any java code and I/O connectors deployed form the CLI.

    > **Integration with DataStax** comes with the integration of proper runners but also some best practice on how to handle the credentials.

### 2. Prerequisites 

<!-- Prequisites for Java And Maven -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-java-maven.md"

<!-- Prequisite Astra DB including SCB -->
--8<-- "https://raw.githubusercontent.com/awesome-astra/docs/main/docs/templates/prerequisites-astra-db-scb.md"

???+ abstract "Setup `GCP Project`"

    - [x] **1. Create project**

    In the Google Cloud console, on the project selector page, select or [create a Google Cloud project](https://cloud.google.com/resource-manager/docs/creating-managing-projects)

    > Note: If you don't plan to keep the resources that you create in this guide, create a project instead of selecting an existing project. After you finish these steps, you can delete the project, removing all resources associated with the project. Create a new Project in Google Cloud Console or select an existing one.

    - [x] **2. Enable Billing**: Make sure that billing is enabled for your Cloud project. Learn how to [check if billing is enabled on a project](https://cloud.google.com/billing/docs/how-to/verify-billing-enabled)

    - [x] **3. Save project ID**: The project identifier is available in the column `ID`. We will need it so let's save it as an environment variable

    ```
    export GCP_PROJECT_ID=integrations-379317
    export GCP_PROJECT_CODE=747469159044
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
    
    ```
    gcloud services enable dataflow compute_component \
        logging storage_component storage_api \
        bigquery pubsub datastore.googleapis.com \
        cloudresourcemanager.googleapis.com
    ```

    - [x] **8. Add Roles to `dataflow` users:** To complete the steps, your user account must have the Dataflow Admin role and the Service Account User role. The Compute Engine default service account must have the Dataflow Worker role. To add the required roles in the Google Cloud console:
    
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

    - [x] **9. Create `buckets` for the project in cloud storage:** Flows will load and export CSV files. In GCP we will create dedicated folder in Google Cloud Storage.

    ```
    gsutil mb -c STANDARD -l US gs://astra_dataflow_inputs
    gsutil mb -c STANDARD -l US gs://astra_dataflow_outputs
    gsutil ls
    ```

    - [x] **10. [Create secrets for the project in secret manager](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets#secretmanager-create-secret-gcloud)**. To connect to `AstraDB` you need a token (credentials) and a zip used to secure the transport. Those two inputs should be defined as _secrets_.

    ```
    gcloud secrets create astra-token \
       --data-file <(echo -n "${ASTRA_TOKEN}") \
       --replication-policy="automatic"

    gcloud secrets create cedrick-demo-scb \
       --data-file ${ASTRA_SCB_PATH} \
       --replication-policy="automatic"

    gcloud secrets add-iam-policy-binding cedrick-demo-scb \
        --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
        --role='roles/secretmanager.secretAccessor'

    gcloud secrets add-iam-policy-binding astra-token \
        --member="serviceAccount:${GCP_COMPUTE_ENGINE}" \
        --role='roles/secretmanager.secretAccessor'
        
    gcloud secrets list
    ```

    - [x] **11.  Check that your secrets can be read**

    ```
    mvn -Pdataflow-runner compile exec:java \
      -Dexec.mainClass=com.dtx.astra.pipelines.test.ReadSecretAndConnectDataFlow \
      -Dexec.args="\
      --astraToken=projects/${GCP_PROJECT_CODE}/secrets/astra-token/versions/1 \
      --secureConnectBundle=projects/${GCP_PROJECT_CODE}/secrets/cedrick-demo-scb/versions/1 \
      --runner=DataflowRunner \
      --project=${GCP_PROJECT_ID} \
      --region=us-central1"
    ```
    
    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/output-secrets.png" />

### 3. Bulk Data Load

???+ abstract "Description of Pipeline `BulkDataLoadWithDataFlow`"

    In this pipeline, 100 records are generated randomly to populate a table `simpledata` in Cassandra in AstraDB.The `simpledata` table looks like:

    ```sql
    CREATE TABLE simpledata (
        id int PRIMARY KEY,
        data text
    );
    ```

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/load-dataflow.png" />

??? abstract "Implementation of Pipeline `BulkDataLoadWithDataFlow`"

    - We create a pipeline with 3 arguments:

    | Parameter Name | Description |
    |:----------|:------|
    |  `astraToken` | Credentials to connect to Astra platform, it should sart with `AstraCS:...` |
    | `secureConnectBundle` | Zip containing certificates to open a secured connection and endpoint definition to pick the proper database |
    |  `keyspace`    | Target keyspace in Astra DB |

    - Those parameters are parsed using a specialized `PipelineOptions` interface:

    ```java
    /**
     * Flow Interface
     */
    public interface LoadDataPipelineOptions extends PipelineOptions {
      @Description("Location of Astra Token secret")
      @Validation.Required
      String getAstraToken();
      void setAstraToken(String token);

      @Description("Location of secret for secure connect bundle")
      @Validation.Required
      String getSecureConnectBundle();
      void setSecureConnectBundle(String path);

      @Description("Destination Keyspace")
      @Validation.Required
      String getKeyspace();
      void setKeyspace(String keyspace);
    }
    ```

    - Secrets are extracted from Secret Manager:

    ```java
    SecretManagerServiceClient client = SecretManagerServiceClient.create();
    String astraToken = client
            .accessSecretVersion(astraOptions.getAstraToken())
            .getPayload().getData()
            .toStringUtf8();
    LOGGER.info("+ Token retrieved");
    byte[] astraSecureBundle = client
            .accessSecretVersion(astraOptions.getSecureConnectBundle())
            .getPayload().getData()
            .toByteArray();
    LOGGER.info("+ Secure connect bundle retrieved");
    ```

    - Pipeline uses the parameters:

    ```java
    Pipeline pipelineWrite = Pipeline.create(astraOptions);
    pipelineWrite.apply("Create 100 random items", Create.of(AstraIOTestUtils.generateTestData(100)))
                 .apply("Write into Astra", AstraIO.<SimpleDataEntity>write()
                         .withToken(astraToken)
                         .withKeyspace(astraOptions.getKeyspace())
                         .withSecureConnectBundleData(astraSecureBundle)
                         .withEntity(SimpleDataEntity.class));
    pipelineWrite.run().waitUntilFinish();
    ```


??? abstract "Execution of Pipeline `BulkDataLoadWithDataFlow`"

    - [x] **Run the pipeline**. As you see, the runner is set to `DataflowRunner` and the parameters are provided with the option `exec.args` in the command. The token and cloud secure bundle are read from secrets.

    ```
    mvn -Pdataflow-runner compile exec:java \
      -Dexec.mainClass=com.dtx.astra.pipelines.beam.dataflow.BulkDataLoadWithDataflow \
      -Dexec.args="\
        --astraToken=projects/${GCP_PROJECT_CODE}/secrets/astra-token/versions/1 \
        --secureConnectBundle=projects/${GCP_PROJECT_CODE}/secrets/cedrick-demo-scb/versions/1 \
        --keyspace=${ASTRA_KEYSPACE} \
        --runner=DataflowRunner \
        --project=${GCP_PROJECT_ID} \
        --region=us-central1"
    ```

     <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/output-load-dataflow.png" />

### 4. Bulk Data Export

???+ abstract "Description of Pipeline `BulkDataExportWithDataFlow`"

    In this pipeline, the content of an Astra Table is exported as a set of CSV Files. The read is split in token ranges for maximum performance (read are distributed accross the nodes). Multiple files are produced in the output directory. The files are created in Google CLoud Storage.

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/export-dataflow.png" />

    
??? abstract "Implementation of Pipeline `BulkDataExportWithDataFlow`"

    - The pipeline requires 5 arguments:

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

    - Items are read with a `AstraIO.read()` as entity, then serialized as a String

    ```java
    @ProcessElement
    public void processElement(ProcessContext c) {
      String csvLine = c.element().getId() + ";" + c.element().getData();
      LOGGER.info("CSV Line: {}", csvLine);
      c.output(csvLine);
    }
    ```

    - Secrets are extracted from the Secret Manager and used for the READ

    ```java
   
    ```

??? abstract "Execution of Pipeline `BulkDataExportWithDataFlow`"

    - [x] **Run the pipeline**. As you see, the runner is set to `DataflowRunner` and the parameters are provided with the option `exec.args` in the command. The token and cloud secure bundle are read from the secrets.

    ```
    mvn -Pdataflow-runner compile exec:java \
      -Dexec.mainClass=com.dtx.astra.pipelines.dataflow.BulkDataExportWithDataflow \
      -Dexec.args="\
          --astraToken=projects/${GCP_PROJECT_CODE}/secrets/astra-token/versions/1 \
          --secureConnectBundle=projects/${GCP_PROJECT_CODE}/secrets/cedrick-demo-scb/versions/1 \
          --keyspace=demo \
          --table=simpledata \
          --targetFolder=gs://astra_dataflow_ouput
          --runner=DataflowRunner \
          --project=integrations-379317 \
          --region=us-central1"
    ```

    <img src="https://awesome-astra.github.io/docs/img/google-cloud-dataflow/output-export-dataflow.png" />



