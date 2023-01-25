<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

---

## Connect with the Java SDK

The Java SDK ([astra-sdk-java](https://github.com/datastax/astra-sdk-java)) allows you to perform standard CRUD operations on your data using Java.

This SDK (Software Development Kit) makes it easy to call Stargate and/or Astra services using idiomatic Java APIs. The `Astra SDK` sets up the connection to work with the AstraDB cloud-based service. You will work with the class `AstraClient`.

- `Stargate SDK` works with both Stargate standalone installations and Stargate deployed in Astra. With standalone Stargate deployments you will initialize the framework with the class StargateClient and provide a list of nodes (IP). To start locally please follow Stargate SDK quickstart guide. The nodes will run in Docker.

- `Astra SDK` reuses the previous library and setup the connection to work with AstraDB cloud-based service. You work with the class AstraClient (that configure StargateClient for you). As you can see on the figure below the AstraClient handles not only Stargate Apis but also Astra Devops Api and Apache Pulsar. To get started follow the Astra SDK quickstart guide.

- `Astra Spring Boot Starter`: Imported in a Spring Boot application, it configures both Astra SDK and Spring Data Cassandra to work with AstraDB. Configuration is read in application.yaml. The starter will initialize any beans you would need (AstraClient, CqlSession, StargateClient. To get started follow the Astra Spring Boot Starter QuickStart guide.

## 1 Prerequisites

1. **Java Development Kit (JDK) 8+**

Use [reference documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) to install a **Java Development Kit**. Validate your installation with:

```bash
java --version
```

2. **Apache Maven (3.8+)**

The different samples and tutorials have been designed with `Apache Maven`. Use the [reference documentation](https://maven.apache.org/install.html) to install maven. Validate your installation with:

```bash
mvn -version
```

3. An Application Token (create a new one [here](/settings/tokens)) with the appropriate role set (API Admin User is needed for example below).

## 2 Quickstart

### Project Creation

1. Use maven to generate a project template

```
mvn archetype:generate \
  -DarchetypeGroupId=org.apache.maven.archetypes \
  -DarchetypeArtifactId=maven-archetype-quickstart \
  -DarchetypeVersion=1.4 \
  -DgroupId=com.datastax.tutorial \
  -DartifactId=sdk-quickstart-astra \
  -Dversion=1.0.0-SNAPSHOT \
  -DinteractiveMode=false
```

2. Open the project in your favourite IDE and edit `pom.xml` to add the latest version of `com.datastax.astra/astra-sdk` as dependency ([![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-sdk/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core))

```xml
  <dependencies>
    
    <dependency>
      <groupId>com.datastax.astra</groupId>
      <artifactId>astra-sdk</artifactId>
      <version>${latestSDK}</version>
    </dependency>

  </dependencies>
```

### Configuration

3. Create a new class `AstraSdk` and populate the 4 variables.

**Note:** _Depending on the framework you will declare in a configuration file like`application.properties` and load/inject them. We're just keeping things simple for now._

4. Use the following values to populate your class variables below.

**COULD WE JUST INJECT THESE DIRECT INTO THE CODE BLOCK SINCE WE'RE NO LONGER USING MARKDOWN?**

```bash
    export ASTRA_DB_ID=85ce6482-cce5-4ced-b98b-274981222051
    export ASTRA_DB_REGION=us-central1
    export ASTRA_DB_APPLICATION_TOKEN=<app_token>
```

```java
import java.io.File;
import com.datastax.astra.sdk.AstraClient;
import com.datastax.oss.driver.api.core.CqlSession;

public class AstraSdk {
  
  // Your Astra Token Starting with AstraCS:....
  static final String ASTRA_DB_TOKEN  = "<provide_a_clientSecret>";
  
  // The unique identifier for your database (Astra UI: Databases dashboard)
  static final String ASTRA_DB_ID     = "<provide_your_database_id>";

  // The region in use for this database (Astra UI : Database Details screen)
  static final String ASTRA_DB_REGION = "<provide_your_database_region>";

  // The keyspace in use for this database (Astra UI : Database Details screen)
  static final String ASTRA_KEYSPACE  = "<provide_your_keyspace>";

  // Define a Main
  public static void main(String[] args) {}

}
```

5. Within the `main` method, define the `AstraClient` as follow. This class is the entry point to every API for astra. It must be a singleton for your application. As autocloseable we can create is in a `try/resources` code block.

```java
try(AstraClient cli = AstraClient.builder()
  .withToken(ASTRA_DB_TOKEN) 
  .withDatabaseId(ASTRA_DB_ID) 
  .withDatabaseRegion(ASTRA_DB_REGION)
  .withCqlKeyspace(ASTRA_DB_KEYSPACE)
  .enableCql()  // Only if you plan to use Cql native drivers
  .enableGrpc() // Only if you plan to use Grpc API
  .build()) {

     // Here we will use AstraClient

  }
```

### CQL Drivers

To access CQL Native you want to access the `CqlSession` object. It is available through `astraClient.cqlSession()`.

```java
public void sampleUsageOfCqlNative(AstraClient astraClient) {

    String cqlVersion = astraClient.cqlSession()
        .execute("SELECT cql_version from system.local")
        .one()
        .getString("cql_version");

    System.out.println("CqlVersion: " + cqlVersion);
}
```

### API Rest

The `REST API` (also known as `api Data`) is wrapping exposing CQL language as Rest Resources. To get more information about this API check the [dedicated page](../api/rest.md)

```java
public static void sampleUsageOfRestApi(AstraClient astraClient) {

    // List keyspaces
    System.out.println("Keyspaces:" + astraClient
      .apiStargateData()
      .keyspaceNames()
      .collect(Collectors.toList()));

    // List Tables
    System.out.println("Tables : " + astraClient
      .apiStargateData()
      .keyspace(ASTRA_DB_KEYSPACE)
      .tableNames()
      .collect(Collectors.toList()));

    // Syntax Sugar, simplify following expressions
    TableClient tableMovies = astraClient
      .apiStargateData()
      .keyspace(ASTRA_DB_KEYSPACE)
      .table("movies");

    // Create table (movies)
    tableMovies.create(CreateTable.builder().ifNotExist(true)
        .addPartitionKey("genre", "text")
        .addClusteringKey("year", "int", Ordering.DESC)
        .addClusteringKey("title", "text", Ordering.ASC)
        .addColumn("producer", "text")
        .build()
      );

    // Insert a Movie
    Map<String, Object> movie = new HashMap<>();
    movie.put("genre", "Sci-Fi");
    movie.put("year", 1990);
    movie.put("title", "Avatar");
    movie.put("producer", "James Cameron");
    tableMovies.upsert(movie);

    // Select Movies
    tableMovies.search(SearchTableQuery.builder()
          .where("genre").isEqualsTo("Sci-Fi")
          .withReturnedFields("title", "year")
          .build())
       .getResults()
       .stream()
       .forEach(row -> System.out.println(row.get("title") +
          " (" + row.get("year") + ")"));

    // Delete a movie
    tableMovies.key("Sci-Fi", 1990, "Avatar").delete();    
}
```

[More information about Rest API](https://github.com/datastax/astra-sdk-java/wiki/Rest-API)

### API Document

The `DOCUMENT API` exposes an Rest Resources to use Cassandra as a document-oriented database To get more information about this API check the [dedicated page](../api/document.md).

```java
public static void sampleUsageOfDocumentApi(AstraClient astraClient) {

    // List Namespaces
    System.out.println("Namespaces:" + astraClient
      .apiStargateDocument()
      .namespaceNames()
      .collect(Collectors.toList()));

    // List Collections
    System.out.println("Collections : " + astraClient
      .apiStargateDocument()
      .namespace(ASTRA_DB_KEYSPACE)
      .tableNames()
      .collect(Collectors.toList()));

    // Syntax Sugar, simplify following expressions
    CollectionClient collectionVideo = astraClient
      .apiStargateDocument()
      .namespace(ASTRA_DB_KEYSPACE)
      .collection("video");

    // Create collection (video)
    collectionVideo.create();

    // Inserting document, given a POJO Video with 2 attributes name and format
    String avatarId = collectionVideo.create(new Video("Avatar", "MP4"));
    String workshopId = collectionVideo.create(new Video("Workshop", "MP4"));

    // Search Documents
    Query query = Query.builder().selectAll()
       .where("format").isEqualsTo("MP4")
       .build();
    collectionVideo.findAll(query, Video.class)
       .map(Document::getDocument)
       .map(Video::getName)
       .forEach(System.out::println);

    // Delete a Document
    collectionVideo.document(avatarId).delete();
}
```

### APi GraphQL

The `GRAPHQL API` exposes a graphQL endpoint to query CQL over graphQL. To know more about this api please check the [dedicated page](../api/graphql.md).

```java
public static void sampleUsageOfGraphQLApi(AstraClient astraClient) {

  // List Keyspaces
  System.out.println("Keyspaces:" + astraClient
    .apiStargateGraphQL()
    .cqlSchema()
    .keyspaces());

  // List Tables
  String getTables = "query GetTables {\n"
   + "  keyspace(name: \"" + ASTRA_DB_KEYSPACE + "\") {\n"
   + "      name\n"
   + "      tables {\n"
   + "          name\n"
   + "          columns {\n"
   + "              name\n"
   + "              kind\n"
   + "              type {\n"
   + "                  basic\n"
   + "                  info {\n"
   + "                      name\n"
   + "                  }\n"
   + "              }\n"
   + "          }\n"
   + "      }\n"
   + "  }\n"
   + "}";
   System.out.println("Tables : " + astraClient
     .apiStargateGraphQL()
     .cqlSchema()
     .query(getTables));
}
```

### API Grpc

The `GRPC API` exposes a grpc endpoint to query some CQL. From there it is very similar from native drivers. To know more about it check the [dedicated page](../api/grpc.md).

```java
public static void sampleUsageOfGrpcApi(AstraClient astraClient) {
  
  // Access gRPC API
  ApiGrpcClient cloudNativeClient = astraClient.apiStargateGrpc();
  
  // Executing Query
  ResultSetGrpc rs = cloudNativeClient.execute("SELECT data_center from system.local");
                  
  // Parse Results
  String datacenterName = rs.one().getString("data_center");
  System.out.println("You are connected to '%s'".formatted(datacenterName));
  
} 
```
