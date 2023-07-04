- **[Apache Airflow](integration/apache-airflow)**: Apache Airflow is an open source workflow management system. It provides components which allow engineers to build data pipelines between different systems.

- **[Apache Beam](integration/apache-beam-google-dataflow.md)** is an open-source, unified programming model for batch and streaming data processing pipelines that simplifies large-scale data processing dynamics. Thousands of organizations around the world choose Apache Beam due to its unique data processing features, proven scale, and powerful yet extensible capabilities.

- **[Apache Flink](integration/flink)**: Apache Flink is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. 

- **[Apache Nifi](integration/apache-nifi)**: NiFi was built to automate the flow of data between systems. While the term 'dataflow' is used in a variety of contexts, we use it here to mean the automated and managed flow of information between systems.

- **[Apache Spark](integration/apache-spark):** Apache Spark is an open-source, distributed processing system used for big data workloads. It utilizes in-memory caching, and optimized query execution for fast analytic queries against data of any size. Use Apache Spark to connect to your database and begin accessing your Astra DB tables using Scala in spark-shell.

- **[Authorizer](integration/authorizer):** Authorizer is an open source auth solution for application.  It works with many different databases, allowing the developers to use a single datastore for the entire application stack and have complete control over all user data.

- **[Celery](integration/celery):** Celery is an open-source, distributed task queue written in Python. With Celery you can run tasks (e.g. processing of messages) in an asynchronous fashion. Celery supports a variety of message buses and backends; among the supported backends are Cassandra and Astra DB.

- **[Cloud Functions (Python Driver)](../develop/platform/google-cloud-function.md)**: Google's function-as-a-service offering that provides a serverless execution environment for your code. Cloud Functions are commonly used to extend Astra DB with additional data processing capabilities and connect Astra DB with other cloud services into data pipelines.

- **[Cloud Functions (Python SDK)](../develop/platform/google-cloud-function.md)**: Google's function-as-a-service offering that provides a serverless execution environment for your code. Cloud Functions are commonly used to extend Astra DB with additional data processing capabilities and connect Astra DB with other cloud services into data pipelines.

- **[CQL Proxy](../astra/cqlproxy)**: cql-proxy is designed to forward your application's CQL traffic to an appropriate database service. It listens on a local address and securely forwards that traffic.

- **[CQL Shell](../data/explore/cqlsh)**: the standalone CQLSH client is a separate, lightweight tool you can use to interact with your database.

- **[Datagrip Jetbrains](../data/explore/datagrip.md):** DataGrip is a database management environment for developers. It is designed to query, create, and manage databases. Databases can work locally, on a server, or in the cloud. Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, and more. If you have a JDBC driver, add it to DataGrip, connect to your DBMS, and start working.

- **[DataStation](ide/datastation.md):** DataStation is an open-source data IDE for developers.

- **[DataStax Bulk](../data/load/dsbulk.md):** The DataStax Bulk Loader tool (DSBulk) is a unified tool for loading into and unloading from Cassandra-compatible storage engines, such as OSS Apache Cassandra®, DataStax Astra and DataStax Enterprise (DSE).

- **[DBeaver](../data/explore/dbeaver.md)**: DBeaver is a universal database management tool for everyone who needs to work with data in a professional way. With DBeaver you are able to manipulate with your data like in a regular spreadsheet, create analytical reports based on records from different data storages, export information in an appropriate format.

- **[Feast](integration/feast):** Feast is a feature store for machine learning whose goal is to provide a (mostly cloud-based) infrastructure for managing, versioning and sharing features for training and serving ML models.

- **[Github Actions](plugins/github-actions):** GitHub Actions is a continuous integration and continuous delivery (CI/CD) platform that allows you to automate your build, test, and deployment pipeline. You can create workflows that build and test every pull request to your repository, or deploy merged pull requests to production.

- **[Google DataFlow](integration/apache-beam-google-dataflow.md)** Google Dataflow is an hosted version of `Apache Beam` running in google cloud platform. It allows users to build and execute data pipelines. It enables the processing of large amounts of data in a parallel and distributed manner, making it scalable and efficient. Dataflow supports both batch and streaming processing, allowing for real-time data analysis.

- **[Grafana](integration/grafana):** Grafana is an industry standard tool for data visualisation. With Grafana, you can explore your time-series data using different visualisations: charts, plots, diagrams and even configure alerting if a value exceeds some desired range.

- **[HashiCorp Vault](integration/vault.md):** Vault is an identity-based secrets and encryption management system. A secret is anything that you want to tightly control access to, such as API encryption keys, passwords, or certificates. Vault provides encryption services that are gated by authentication and authorization methods.
    - [Astra DB Plugin](plugins/astradb-vault-plugin.md)

- **[IntelliJ IDEA](ide/intellij.md)**: The Capable & Ergonomic Java IDE by JetBrains

- **[JanusGraph](../tools/databases/janusgraph.md):** JanusGraph is designed to support the processing of graphs so large that they require storage and computational capacities beyond what a single machine can provide. Scaling graph data processing for real time traversals and analytical queries is JanusGraph’s foundational benefit. This section will discuss the various specific benefits of JanusGraph and its underlying, supported persistence solutions.

- **[Liquibase](integration/liquibase.md)**: Liquibase is a database schema change management solution that enables you to revise and release database changes faster and safer from development to production.

- **[Micronaut](../develop/frameworks/micronaut.md)**: Micronaut is a modern, JVM-based, full stack Java framework designed for building modular, easily testable JVM applications with support for Java, Kotlin, and Groovy. Micronaut is developed by the creators of the Grails framework and takes inspiration from lessons learnt over the years building real-world applications from monoliths to microservices using Spring, Spring Boot and Grails.

- **[MindsDB](../data/explore/mindsdb.md)**: MindsDB enables you to use ML predictions in your database using SQL.

- **[Pentaho Data Integration](integration/pentaho.md)**: Pentaho Data Integration (PDI) provides the Extract, Transform, and Load (ETL) capabilities that facilitate the process of capturing, cleansing, and storing data using a uniform and consistent format that is accessible and relevant to end users and IoT technologies.

- **[Power Query](integration/microsoft-powerquery.md)**: Microsoft Power Query is a data preparation and transformation ETL engine that lets you connect to various data sources. Power Query is available in Microsoft Excel, Power BI, Power BI dataflows, Azure Data Factory wrangling dataflows, SQL Server Analysis Services, and much more.

- **[Quine](integration/quine.io.md)**: Quine.io is a streaming graph capable of building high-volumes of data into a stateful graph.  It allows for real-time traversals on a graph, as well as for the data to be streamed-out for event processing.

- **[StepZen](integration/stepzen.md):** StepZen helps developers build GraphQL faster, deploy in seconds, and run on StepZen. It simplifies how you access the data you need, and with zero infrastructure to build or manage, you can focus on crafting modern data-driven experiences.

- **[TablePlus](../data/explore/tableplus.md):** TablePlus is a modern, native tool with elegant UI that allows you to simultaneously manage multiple databases such as MySQL, PostgreSQL, SQLite, Microsoft SQL Server and more.

- **[Temporal](integration/temporal.md):** Temporal.io is an open source microservice orchestration platform that assists in tracking workflows in your application development. It provides the user with a plug-and-play persistence layer that lets the user choose and configure their Temporal Server with their preferred backend.
