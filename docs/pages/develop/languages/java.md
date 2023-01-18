<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

---

<img src="../../../../img/tile-java.png" align="center" 
  height="130px" width="130px" style="margin-top:-150px"/>

**Select the API you want to connect to Astra with JAVA**

Astra offers different Apis and interfaces. To know more about the ussage of each one check the pages dedicated to each one.

- **ASTRA DB (Stargate Apis)**

<a href="#2-native-cassandra-drivers">
 <img src="../../../../img/tile-api-cql.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;
<a href="#3-api-rest">
<img src="../../../../img/tile-api-rest.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;
<a href="#4-api-document">
 <img src="../../../../img/tile-api-document.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;
<a href="#5-api-graphql">
<img src="../../../../img/tile-api-graphql.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;
<a href="#6-api-grpc">
<img src="../../../../img/tile-api-grpc.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;

## 1. Pre-requisites

- **Java Development Kit (JDK) 8+**

Use [reference documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) to install a **Java Development Kit** and validate your installation with

```bash
java --version
```

- **Apache Maven (3.8+)**

The different samples and tutorials have been designed with `Apache Maven`.Use the [reference documentation](https://maven.apache.org/install.html) top install maven validate your installation with 

```bash
mvn -version
```

- **Datastax Astra**

???+ abstract "Setup Actions"

    - You should have an [Astra account](https://astra.dev/3B7HcYo)
    - You should [Create an Astra Database](/docs/pages/astra/create-instance/)
    - You should [Have an Astra Token](/docs/pages/astra/create-token/)
    - You should [Download your Secure bundle](/docs/pages/astra/download-scb/)

## 2. Native Cassandra Drivers

> Driver reference documentation can be found [HERE](https://docs.datastax.com/en/developer/java-driver/4.13/), this page is focused on connectivity with Astra DB only.

### 2.1 Cassandra Drivers 4.x

!!! important "Version 4.x is recommended"

Version 4 is major redesign of the internal architecture. As such, it is not binary compatible with previous versions. However, most of the concepts remain unchanged, and the new API will look very familiar to 2.x and 3.x users.

???+ note annotate "Import dependencies in your `pom.xml`"

      - Any version `4.x` should be compatible with Astra.

      - Update your `pom.xml` file with the latest version of the 4.x libraries: [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core)

      ```xml
      <!-- (REQUIRED) -->
      <dependency>
      <groupId>com.datastax.oss</groupId>
      <artifactId>java-driver-core</artifactId>
      <version>${latest4x}</version>
      </dependency>

      <!-- OPTIONAL -->
      <dependency>
      <groupId>com.datastax.oss</groupId>
      <artifactId>java-driver-query-builder</artifactId>
      <version>${latest4x}</version>
      </dependency>
      <dependency>
      <groupId>com.datastax.oss</groupId>
      <artifactId>java-driver-mapper-runtime</artifactId>
      <version>${latest4x}</version>
      </dependency>
      ```

???+ note "Standalone Code"

      - `CqlSession` implements Closable. It should be a singleton in your application

      - Spring-Data 3.x+ relies on those Drivers 4x. If you define a `CqlSession` bean, it will use it.
      
      ```java
      import java.nio.file.Paths;
      import com.datastax.oss.driver.api.core.CqlSession;

      public class AstraDriver4x {

       static final String ASTRA_ZIP_FILE = "<path_to_secureConnectBundle.zip>";
       static final String ASTRA_USERNAME = "<provide_a_clientId>";
       static final String ASTRA_PASSWORD = "<provide_a_clientSecret>";
       static final String ASTRA_KEYSPACE = "<provide_your_keyspace>";

       public static void main(String[] args) {
         try (CqlSession cqlSession = CqlSession.builder()
           .withCloudSecureConnectBundle(Paths.get(ASTRA_ZIP_FILE))
           .withAuthCredentials(ASTRA_USERNAME, ASTRA_PASSWORD)
           .withKeyspace(ASTRA_KEYSPACE)
           .build()) {
            System.out.println("Hello keyspace {} !" + cqlSession.getKeyspace().get());
         }
       }

      }
      ```

???+ abstract "Resources"


      <a href="https://github.com/awesome-astra/sample-java-driver3x/archive/refs/heads/main.zip" class="md-button">
      <i class="fa fa-download" ></i>&nbsp;Download This sample code
      </a>

      - To learn more about the history of the 4.x Java driver, check out [this blogpost](https://www.datastax.com/blog/introducing-java-driver-4).
      - To migrate from `3.x`, use the [upgrade guide](https://docs.datastax.com/en/developer/java-driver/4.13/upgrade_guide/#4-0-0) but you can also keep using `3.x` as described [below](#using-java-cassandra-drivers-version-3x)
      - [Multiple Standalone Classes using driver 4.x](https://github.com/DataStax-Examples/java-cassandra-driver-from3x-to4x/tree/master/example-4x/src/main/java/com/datastax/samples)
      - [Spring PetClinic in Reactive](https://github.com/spring-petclinic/spring-petclinic-reactive) and especially the [mapper](https://github.com/spring-petclinic/spring-petclinic-reactive/tree/master/src/main/java/org/springframework/samples/petclinic/vet/db)

### 1.2 Cassandra Drivers 3.x

!!! warning "Version 4.x is recommended, it is unlikely that 3.x will get new updates except maintenance and CVE."

- Please note that version **3.8+** is required to connect to Astra.

???+ note annotate "Import dependencies in your `pom.xml`"

      - Update your `pom.xml` file with the latest version of the 3.x libraries: [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.cassandra/cassandra-driver-mapping/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.cassandra/cassandra-driver-mapping/)

      ```xml
      <dependency>
        <groupId>com.datastax.cassandra</groupId>
        <artifactId>cassandra-driver-core</artifactId>
        <version>${latest3x}</version>
      </dependency>
      ```

???+ note "Standalone Code"

      ```java
      import java.io.File;
      import com.datastax.driver.core.Cluster;
      import com.datastax.driver.core.Session;

      public class AstraDriver3x {

        // Define inputs
        static final String ASTRA_ZIP_FILE = "<path_to_secureConnectBundle.zip>";
        static final String ASTRA_USERNAME = "<provide_a_clientId>";
        static final String ASTRA_PASSWORD = "<provide_a_clientSecret>";
        static final String ASTRA_KEYSPACE = "<provide_your_keyspace>";

        public static void main(String[] args) {
          try(Cluster cluster = Cluster.builder()
            .withCloudSecureConnectBundle(new File(ASTRA_ZIP_FILE))
            .withCredentials(ASTRA_USERNAME, ASTRA_PASSWORD)
            .build() ) {
              Session session = cluster.connect(ASTRA_KEYSPACE);
              System.out.println("Hello keyspace " + session.getLoggedKeyspace());
          }
        }

      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-driver3x/archive/refs/heads/main.zip" class="md-button">
            <i class="fa fa-download" ></i>&nbsp;Download Driver 3x Sample
      </a>

      - [Multiple Standalone Classes using driver 3.x](https://github.com/DataStax-Examples/java-cassandra-driver-from3x-to4x/tree/master/example-3x/src/main/java/com/datastax/samples)


### 1.3 Astra SDK

The `Astra SDK` sets up the connection to work with the AstraDB cloud-based service. You will work with the class `AstraClient`, [Reference documentation](https://github.com/datastax/astra-sdk-java/wiki).

???+ note annotate "Import dependencies in your `pom.xml`"

      - Update your `pom.xml` file with the latest version of the SDK [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-sdk/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core)

      ```xml
      <dependencies>
       <dependency>
           <groupId>com.datastax.astra</groupId>
           <artifactId>astra-sdk</artifactId>
           <version>${latestSDK}</version>
       </dependency>
      </dependencies>
      ```

???+ note "Standalone Code"

      ```java
      import java.io.File;
      import com.datastax.astra.sdk.AstraClient;
      import com.datastax.oss.driver.api.core.CqlSession;

      public class AstraSdk {

        // Define inputs
        static final String ASTRA_DB_TOKEN  = "<provide_a_clientSecret>";
        static final String ASTRA_DB_ID     = "<provide_your_database_id>";
        static final String ASTRA_DB_REGION = "<provide_your_database_region>";
        static final String ASTRA_KEYSPACE  = "<provide_your_keyspace>";

        // Init Astra Client
        public static void main(String[] args) {
            try(AstraClient cli = AstraClient.builder()
              .withToken(ASTRA_DB_TOKEN)
              .withDatabaseId(ASTRA_DB_ID)
              .withDatabaseRegion(ASTRA_DB_REGION)
              .withCqlKeyspace(ASTRA_DB_KEYSPACE)
              .enableCql()
              .build()) {
                System.out.println("CqlVersion:" + astraClient.cqlSession()
                          .execute("SELECT cql_version from system.local")
                          .one().getString("cql_version"));
            }
          }
      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-sdk/archive/refs/heads/main.zip" class="md-button">
        <i class="fa fa-download" ></i>&nbsp;Download SDK Sample
      </a>

      - To get the full fledged information regarding the SDK check the [github repository](https://github.com/datastax/astra-sdk-java/wiki)

## 3. Api Rest

!!! important "⚠️ We recommend to use version `V2` (_with V2 in the URL_) as it covers more features and the V1 would be deprecated sooner."

    <img src="../../../../img/java/api-data.png" />

To know more regarding this interface specially you can have a look to [dedicated section of the wiki](https://awesome-astra.github.io/docs//Stargate-Api-Rest) or [reference Stargate Rest Api Quick Start Guide](https://stargate.io/docs/stargate/1.0/quickstart/quick_start-rest.html).

### 3.1 `Http Client`

You need an `HTTP Client` to use the Rest API. There are a lot of clients in the Java languages like [HttpURLConnection](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/net/HttpURLConnection.html), [HttpClient introduced in Java 11](https://docs.oracle.com/en/java/javase/11/docs/api/java.net.http/java/net/http/HttpClient.html), [Apache HTTPClient](https://hc.apache.org/httpcomponents-client-5.0.x/index.html), [OkHttpClient](https://square.github.io/okhttp/), [Jetty HttpClient](https://www.eclipse.org/jetty/documentation/current/http-client.html). A comparison is provided is this [blogpost](https://www.mocklab.io/blog/which-java-http-client-should-i-use-in-2020/) to make your choice. In this tutorial, we will use the `Apache HttpClient`, which is included in the SDK. You should adapt the code depending on the framework you have chosen.

???+ note annotate "Import dependencies in your `pom.xml`"

    ```xml
    <dependency>
      <groupId>org.apache.httpcomponents.client5</groupId>
      <artifactId>httpclient5</artifactId>
      <version>5.1.3</version>
    </dependency>
    ```

???+ note "Standalone Code"
     
      ```java
      import java.io.File;
      public class AstraRestApiHttpClient {

          static final String ASTRA_TOKEN       = "<change_with_your_token>";
          static final String ASTRA_DB_ID       = "<change_with_your_database_identifier>";
          static final String ASTRA_DB_REGION   = "<change_with_your_database_region>";
          static final String ASTRA_DB_KEYSPACE = "<change_with_your_keyspace>";

          public static void main(String[] args) throws Exception {

              String apiRestEndpoint = new StringBuilder("https://")
                      .append(ASTRA_DB_ID).append("-")
                      .append(ASTRA_DB_REGION)
                      .append(".apps.astra.datastax.com/api/rest")
                      .toString();
              System.out.println("Rest Endpoint is " + apiRestEndpoint);

              try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
                  // Work with HTTP CLIENT
                  listKeyspaces(httpClient, apiRestEndpoint);
                  createTable(httpClient, apiRestEndpoint);
              }
          }
      }
      ```

 - **Operations**

??? note "List Keyspaces"

     <img src="../../../../img/java/schemas-keyspace-list.png" />

     - Code

      ```java

      private static void listKeyspaces(CloseableHttpClient httpClient, String apiRestEndpoint)
      throws Exception {
              // Build Request
              HttpGet listKeyspacesReq = new HttpGet(apiRestEndpoint + "/v2/schemas/keyspaces");
              listKeyspacesReq.addHeader("X-Cassandra-Token", ASTRA_TOKEN);

              // Execute Request
              try(CloseableHttpResponse res = httpClient.execute(listKeyspacesReq)) {
              if (200 == res.getCode()) {
              logger.info("[OK] Keyspaces list retrieved");
              logger.info("Returned message: {}", EntityUtils.toString(res.getEntity()));
      }
      ```


??? note "Creating a table"

      <img src="../../../../img/java/schemas-table-create.png" />

      - Sample `JSON` payload `createTableJson`.

      ```json
      {
        "name": "users",
        "columnDefinitions": [
          {  "name": "firstname", "typeDefinition": "text" },
          {  "name": "lastname",  "typeDefinition": "text" },
          {  "name": "email",     "typeDefinition": "text" },
          {  "name": "color",     "typeDefinition": "text" }
        ],
        "primaryKey": { 
          "partitionKey": ["firstname"],
          "clusteringKey": ["lastname"]
        },
        "tableOptions": {
          "defaultTimeToLive": 0,
          "clusteringExpression": [{ "column": "lastname", "order": "ASC" }]
        }
      }
      ```

      - Creating the http request using that payload

      ```java
      private static void createTable(CloseableHttpClient httpClient, String apiRestEndpoint)
      throws Exception {
        HttpPost createTableReq = new HttpPost(apiRestEndpoint
            + "/v2/schemas/keyspaces/" + ASTRA_DB_KEYSPACE + "/tables");
        createTableReq.addHeader("X-Cassandra-Token", ASTRA_TOKEN);
        String createTableJson = "{...JSON.....}";
        createTableReq.setEntity(new StringEntity(createTableJson, ContentType.APPLICATION_JSON));

        // Execute Request
        try(CloseableHttpResponse res = httpClient.execute(createTableReq)) {
          if (201 == res.getCode()) {
            logger.info("[OK] Table Created (if needed)");
            logger.info("Returned message: {}", EntityUtils.toString(res.getEntity()));
          }
        }
      }
      ```

??? note "Insert a new Row"

      <img src="../../../../img/java/data-rows-insert.png" />

      ```java
      private static void insertRow(CloseableHttpClient httpClient, String apiRestEndpoint)
      throws Exception {
        HttpPost insertCedrick = new HttpPost(apiRestEndpoint + "/v2/keyspaces/"
        + ASTRA_DB_KEYSPACE + "/users" );
        insertCedrick.addHeader("X-Cassandra-Token", ASTRA_TOKEN);
        insertCedrick.setEntity(new StringEntity("{"
          + " \"firstname\": \"Cedrick\","
          + " \"lastname\" : \"Lunven\","
          + " \"email\"    : \"c.lunven@gmail.com\","
          + " \"color\"    : \"blue\" }", ContentType.APPLICATION_JSON));

        // Execute Request
        try(CloseableHttpResponse res = httpClient.execute(insertCedrick)) {
          if (201 == res.getCode()) {
            logger.info("[OK] Row inserted");
            logger.info("Returned message: {}", EntityUtils.toString(res.getEntity()));
          }
        }
      }
      ```

??? note "Retrieve a row"

      <img src="../../../../img/java/data-rows-read.png" />

      ```java
      private static void retrieveRow(CloseableHttpClient httpClient, String apiRestEndpoint)
      throws Exception {

        // Build Request
        HttpGet rowReq = new HttpGet(apiRestEndpoint + "/v2/keyspaces/"
          + ASTRA_DB_KEYSPACE + "/users/Cedrick/Lunven" );
        rowReq.addHeader("X-Cassandra-Token", ASTRA_TOKEN);

        // Execute Request
        try(CloseableHttpResponse res = httpClient.execute(rowReq)) {
          if (200 == res.getCode()) {
            String payload =  EntityUtils.toString(res.getEntity());
            logger.info("[OK] Row retrieved");
            logger.info("Row retrieved : {}", payload);
          }
        }
      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-sdk/archive/refs/heads/main.zip" class="md-button">
        <i class="fa fa-download" ></i>&nbsp;Download REST HTTP CLIENT
      </a>

      - To get the full fledged information regarding the SDK check the [github repository](https://github.com/datastax/astra-sdk-java/wiki)


### 3.2 `Astra SDK`

The `Astra SDK` sets up the connection to work with the AstraDB cloud-based service. You will work with the class `AstraClient`, [Reference documentation](https://github.com/datastax/astra-sdk-java/wiki).

???+ note annotate "Import dependencies in your `pom.xml`"

      - Update your `pom.xml` file with the latest version of the SDK [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-sdk/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core)

      ```xml
      <dependencies>
       <dependency>
           <groupId>com.datastax.astra</groupId>
           <artifactId>astra-sdk</artifactId>
           <version>${latestSDK}</version>
       </dependency>
      </dependencies>
      ```

???+ note "Standalone Code"

      ```java
      import java.io.File;
      import com.datastax.astra.sdk.AstraClient;
      import com.datastax.oss.driver.api.core.CqlSession;

      public class AstraSdk {

        // Define inputs
        static final String ASTRA_DB_TOKEN  = "<provide_a_clientSecret>";
        static final String ASTRA_DB_ID     = "<provide_your_database_id>";
        static final String ASTRA_DB_REGION = "<provide_your_database_region>";
        static final String ASTRA_KEYSPACE  = "<provide_your_keyspace>";

        // Init Astra Client
        public static void main(String[] args) {
            try(AstraClient cli = AstraClient.builder()
              .withToken(ASTRA_DB_TOKEN)
              .withDatabaseId(ASTRA_DB_ID)
              .withDatabaseRegion(ASTRA_DB_REGION)
              .withCqlKeyspace(ASTRA_DB_KEYSPACE)
              .build()) {
                System.out.println("+ List of Keyspaces: " + 
                  astraClient.apiStargateData()
                             .keyspaceNames()
                             .collect(Collectors.toList()));
            }
        }
      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-sdk/archive/refs/heads/main.zip" class="md-button">
        <i class="fa fa-download" ></i>&nbsp;Download SDK Sample
      </a>

      - To get the full fledged information regarding the SDK check the [github repository](https://github.com/datastax/astra-sdk-java/wiki)

## 4. Api Document

The Document API is an HTTP REST API and part of the open source Stargate.io. The idea is to provide an abstraction on top of Apache Cassandra™ to allow document-oriented access patterns. To get familiar with it you can access [documentation and sandbox here](/docs/pages/develop/api/document/)

### 4.1 `Http Client`

???+ note annotate "Import dependencies in your `pom.xml`"

    ```xml
    <dependency>
      <groupId>org.apache.httpcomponents.client5</groupId>
      <artifactId>httpclient5</artifactId>
      <version>5.1.3</version>
    </dependency>
    ```

???+ note "Standalone Code"
     
      ```java
      static final String ASTRA_TOKEN       = "change_me";
      static final String ASTRA_DB_ID       = "change_me";
      static final String ASTRA_DB_REGION   = "change_me";
      static final String ASTRA_DB_KEYSPACE = "change_me";
      static  Logger logger = LoggerFactory.getLogger(AstraDocApiHttpClient.class);

      public static void main(String[] args) throws Exception {
         try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

              // Build Request
              String apiRestEndpoint = new StringBuilder("https://")
                  .append(ASTRA_DB_ID).append("-")
                  .append(ASTRA_DB_REGION)
                  .append(".apps.astra.datastax.com/api/rest")
                  .toString();
              HttpGet req = new HttpGet(apiRestEndpoint + "/v2/schemas/namespaces");
              req.addHeader("X-Cassandra-Token", ASTRA_TOKEN);

              // Execute Request
              try(CloseableHttpResponse res = httpClient.execute(req)) {
                if (200 == res.getCode()) {
                  logger.info("[OK] Namespaces list retrieved");
                  logger.info("Returned message: {}", EntityUtils.toString(res.getEntity()));
                }
              }
         }
      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-sdk/archive/refs/heads/main.zip" class="md-button">
        <i class="fa fa-download" ></i>&nbsp;Download SDK Sample
      </a>


### 4.2 `Astra SDK`

The `Astra SDK` sets up the connection to work with the AstraDB cloud-based service. You will work with the class `AstraClient`, [Reference documentation](https://github.com/datastax/astra-sdk-java/wiki).

???+ note annotate "Import dependencies in your `pom.xml`"

      - Update your `pom.xml` file with the latest version of the SDK [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-sdk/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core)

      ```xml
      <dependencies>
       <dependency>
           <groupId>com.datastax.astra</groupId>
           <artifactId>astra-sdk</artifactId>
           <version>${latestSDK}</version>
       </dependency>
      </dependencies>
      ```

???+ note "Standalone Code"

      ```java
      import java.io.File;
      import com.datastax.astra.sdk.AstraClient;
      import com.datastax.oss.driver.api.core.CqlSession;

      public class AstraSdk {

        // Define inputs
        static final String ASTRA_DB_TOKEN  = "<provide_a_clientSecret>";
        static final String ASTRA_DB_ID     = "<provide_your_database_id>";
        static final String ASTRA_DB_REGION = "<provide_your_database_region>";
        static final String ASTRA_KEYSPACE  = "<provide_your_keyspace>";

        // Init Astra Client
        public static void main(String[] args) {
            try(AstraClient cli = AstraClient.builder()
              .withToken(ASTRA_DB_TOKEN)
              .withDatabaseId(ASTRA_DB_ID)
              .withDatabaseRegion(ASTRA_DB_REGION)
              .withCqlKeyspace(ASTRA_DB_KEYSPACE)
              .build()) {
                System.out.println("+ List of Keyspaces: " + 
                  astraClient.apiStargateDocument()
                             .namespaceNames()
                             .collect(Collectors.toList()));
            }
        }
      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-sdk/archive/refs/heads/main.zip" class="md-button">
        <i class="fa fa-download" ></i>&nbsp;Download SDK Sample
      </a>

      - To get the full fledged information regarding the SDK check the [github repository](https://github.com/datastax/astra-sdk-java/wiki)

## 5 Api GraphQL

### 5.1 `Astra SDK`

The `Astra SDK` sets up the connection to work with the AstraDB cloud-based service. You will work with the class `AstraClient`, [Reference documentation](https://github.com/datastax/astra-sdk-java/wiki).

???+ note annotate "Import dependencies in your `pom.xml`"

      - Update your `pom.xml` file with the latest version of the SDK [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-sdk/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.oss/java-driver-core)

      ```xml
      <dependencies>
       <dependency>
           <groupId>com.datastax.astra</groupId>
           <artifactId>astra-sdk</artifactId>
           <version>${latestSDK}</version>
       </dependency>
      </dependencies>
      ```

???+ note "Standalone Code"

      ```java
      import java.io.File;
      import com.datastax.astra.sdk.AstraClient;
      import com.datastax.oss.driver.api.core.CqlSession;

      public class AstraSdk {

        // Define inputs
        static final String ASTRA_DB_TOKEN  = "<provide_a_clientSecret>";
        static final String ASTRA_DB_ID     = "<provide_your_database_id>";
        static final String ASTRA_DB_REGION = "<provide_your_database_region>";
        static final String ASTRA_KEYSPACE  = "<provide_your_keyspace>";

        // Init Astra Client
        public static void main(String[] args) {
            try(AstraClient cli = AstraClient.builder()
              .withToken(ASTRA_DB_TOKEN)
              .withDatabaseId(ASTRA_DB_ID)
              .withDatabaseRegion(ASTRA_DB_REGION)
              .withCqlKeyspace(ASTRA_DB_KEYSPACE)
              .build()) {
                 System.out.println("+ Keyspaces (graphQL) : " + astraClient
                    .apiStargateGraphQL()
                    .cqlSchema()
                    .keyspaces());
            }
        }
      }
      ```

???+ abstract "Resources"

      <a href="https://github.com/awesome-astra/sample-java-sdk/archive/refs/heads/main.zip" class="md-button">
        <i class="fa fa-download" ></i>&nbsp;Download SDK Sample
      </a>

      - To get the full fledged information regarding the SDK check the [github repository](https://github.com/datastax/astra-sdk-java/wiki)



## 6. Api gRPC

### 6.1 Stargate Client

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

### 7.2 Astra SDK

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```
