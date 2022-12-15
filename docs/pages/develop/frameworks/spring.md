---
title: "Spring"
description: "Spring makes programming Java quicker, easier, and safer for everybody. Spring’s focus on speed, simplicity, and productivity has made it the world's most popular Java framework."
tags: "java, framework"
icon: "https://awesome-astra.github.io/docs/img/logos/logo-spring-2.png"
developer_title: "VMWare"
developer_url: "https://spring.io/"
links:
- title: "Spring reference"
  url: "https://spring.io"
- title: "Cassandra compatibility matrix"
  url: "https://docs.datastax.com/en/driver-matrix/doc/java-drivers.html"
- title: "Astra Spring Boot Starter example"
  url: "https://github.com/DataStax-Examples/astra-samples-java/archive/refs/heads/main.zip"
- title: "Spring Data Cassandra example"
  url: "https://github.com/awesome-astra/sample-java-spring-data/archive/refs/heads/master.zip"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/tile-spring.png" align="left" height="180px"/>

</div>


*Spring makes programming Java quicker, easier, and safer for everybody. Spring’s focus on speed, simplicity, and productivity has made it the world's most popular Java framework.* To get more information regarding the framework visit the reference website [Spring.io](https://spring.io).

`Spring-Data` is the module use to interact with Databases whereas [`Spring Boot`](https://spring.io/projects/spring-boot) is the runtime for microservices. In this page we detail how to setup both modules to interact with Astra.

## <span class="nosurface">1.</span> Overview

### <span class="nosurface">1.1</span> Modules dependencies

Spring is an ecosystem with dozens of modules. The component used to connect a Spring application to Astra (Cassandra) is **Spring Data** and especially **Spring Data Cassandra**. It relies on the DataStax native java cassandra drivers and only provides an abstraction with Spring concepts (templates, repository, Entities...)

The stateful object `CqlSession` is instantiated and injected in spring `CassandraTemplate` (aka `CassandraOperations`). From there, it is used either directly or injected in different `CassandraRepository` (specialization of Spring Data `CrudRepository` for Apache Cassandra™).

The configuration of `spring-data-cassandra` in `Spring-Boot` applications is simplified with the usage of *starters*. One is associated to the standard web stack and called `spring-boot-starter-data-cassandra` and the other is named `spring-boot-starter-data-cassandra-reactive` for the reactive stack.

<img src="https://awesome-astra.github.io/docs/img/spring/spring-dependency-graph.png" />

### <span class="nosurface">1.2</span> Compatibility Matrix

In January 2019, the native Cassandra Drivers got an important, not backward compatible, upgrade. To get informations regarding Apache Cassandra™ support here is the [Cassandra compatibility matrix](https://docs.datastax.com/en/driver-matrix/doc/java-drivers.html).

Spring Data copes with the new generation of drivers starting with Spring data 3.x. Support of Astra was introduced in 2020 for all native versions (4.x and 3.x). This leads to the following table for **minimal library versions for Astra Support**:

| Drivers Release | Drivers Version | Spring-Data  | Spring Boot  
|:---:|:---:|:---:|:---:|
| `Unified 4.x` | `4.6.0` | `3.0.0.RELEASE` | `2.3.0.RELEASE` |
| `OSS 3.x` | `3.8.0` | Setup below table | `2.2.13.RELEASE` | 
| `DSE 2.x` | `2.3.0` | `3.0.0.RELEASE` |  `2.3.0.RELEASE` |
| `DSE 1.x` | `1.9.0` | Setup below table | `2.2` |

- Setup **Spring Data 2.2.x** (and before) to work with **Astra**

As stated in the matrix, even the latest Spring Data `2.2.13.RELEASE` rely on `cassandra-driver` version `3.7.2` that where not yet compatible to Astra. To work with Astra you  have to override the `cassandra-drivers` version as below.

```xml
<dependency>
 <groupId>org.springframework.boot</groupId>
 <artifactId>spring-boot-starter-data-cassandra</artifactId>
 <version>2.2.13.RELEASE</version>
</dependency>

<dependency>
  <groupId>com.datastax.cassandra</groupId>
  <artifactId>cassandra-driver-core</artifactId>
  <version>3.11.2</version>
</dependency>
```

You can find [here a sample project](https://github.com/mborges-pivotal/astra-springboot154) that uses Spring Boot version as old as `1.5.4`.

- Setup **Spring Data 2.2** (and before) to work with **DataStax Enterprise (DSE)**

Before 4.x and the unified drivers you have to use `dse-java-driver-core` to have access to enterprise features but also the be elligible for the support. To enable it 
you need to exclude `cassandra-driver-core` and import `dse-java-driver-core` as show below

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-cassandra</artifactId>
  <version>2.2.13.RELEASE</version>
  <exclusions>
    <exclusion>
      <groupId>com.datastax.cassandra</groupId>
      <artifactId>cassandra-driver-core</artifactId>
    </exclusion>
  </exclusions>
</dependency>

<dependency>
  <groupId>com.datastax.dse</groupId>
  <artifactId>dse-java-driver-core</artifactId>
  <version>1.9.0</version>
</dependency>
```

### <span class="nosurface">1.3</span> Rules and Pitfalls

- **Define your own `CqlSession` bean** (spring-data will find it !)

`Spring Data Cassandra` starters provide some dedicated keys in the configuration file `application.yaml` (`spring.data.cassandra.*`) but you do not get the complete list of options of the drivers. In the same way some super classes like `AbstractCassandraConfiguration` are provided where you can specify a few configuration properties but a limited set of keys are available.

- **Do not use `findAll()`**

It can be tempting to use this method to test new repositories as no parameter is required - but this is dangerous. The default paging mechanism is skipped and this method will retrieve every single record of the table. As such, it would perform a full scan of the cluster (pick data for each node) that (1) would be slow and (2) could lead to `OutOfMemoryException` as Cassandra Tables are expected to store billions of records.

- **Do not use `@AllowFiltering`**

This annotation (some for associated CQL Statement) is limited for the use cases where (1) you provide the partition key **AND** (2) you know your partition size is fairly small. In 99% of the cases the need of this annotation (or `ALLOW FILTERING` in the `CQL`) is a sign of a wrong data model: your primary key is invalid and you need another table to store the same data (or eventually to create a secondary index).

- **Do not rely (only) on Spring Data to create your schema**

SDC provide a configuration key `spring.data.cassandra.schema-action: CREATE_IF_NOT_EXISTS` that proposes to create the Cassandra Tables based on your annotated beans. It is NOT a good idea. Indeed, it could lead to wrong data model (cf next point) but also it does not give access to fine grained properties like `COMPACTION` and `TTL` that might be different in development and production. Let a `Cassandra Administrator` reviews your DDL scripts and updates them for production.

- **Data Model First, Entities second**

With the `JPA` (entity, repository) methodology, you are tempting to reuse the same entities and repositories to perform multiple queries against the same table. Most new requests will be not valid as you will not request using the primary key. You can be tempting to create a secondary index or use allow filtering; **WRONG !**. The good practice is to **CREATE ANOTHER TABLE, ANOTHER ENTITY and ANOTHER REPOSITORY** - and even if data stored is the same. With Cassandra 1 query = 1 table (mostly).

- **`CassandraRepository` probably cannot implement it all**

With real-life applications you might probably need to go back to the `CqlSession` and execute custom fine-grained queries (`Batches`, `TTL`, `LWT`...). The interfaces and `CassandraRepostiory` would not be enough. The class `SimpleCassandraRepository` is an abstract class (not interface0 you can inherit from that give you access to the `CqlSession` and execute your queries as you like, it is a good trade off.

## <span class="nosurface">2.</span> Astra Spring Boot Starter

### <span class="nosurface">2.1</span> Introduction

**The Astra Spring Boot Starter** will configure both Astra SDK and Spring Data Cassandra to work with AstraDB. Configuration keys are provided in `application.yaml` like any spring applications with a dedicated prefix `astra.*`. The starter will initialize any beans you would need (`AstraClient`, `CqlSession`, `StargateClient`) to use every interfaces exposes by Astra. Not all are activated by default though, you want to initialize only what you need.

<img src="https://awesome-astra.github.io/docs/img/spring/quickstart-spring.png" />

### <span class="nosurface">2.2</span> Project Setup

#### Prerequisites [ASTRA]

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)

#### Prerequisites [Development Environment]

- You should install **Java Development Kit (JDK) 8**: Use the [reference documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) to install a **Java Development Kit**, Validate your installation with

```bash
java --version
```

- You should install **Apache Maven**: Use the [reference documentation](https://maven.apache.org/install.html) and validate your installation with

```bash
mvn -version
```

#### Setup Project

- Create your project with [Spring Initializr](https://start.spring.io). Dependencies needed are `web` and `data-cassandra` but we did the work for you if you click the [template link](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.6.13&packaging=jar&jvmVersion=1.8&groupId=com.datastax.tutorial&artifactId=sdk-quickstart-spring&name=sdk-quickstart-spring&description=Use%20Astra%20Spring%20Boot%20Starter&packageName=com.datastax.tutorial&dependencies=web,data-cassandra)

|    Property    |          Value          |     Property     |                    Value                     |
| :------------: | :---------------------: | :--------------: | :------------------------------------------: |
|  **groupId**   | `com.datastax.tutorial` |   **package**    |           `com.datastax.tutorial`            |
| **artifactId** | `sdk-quickstart-spring` | **description**  |              Sample Spring App               |
|    **name**    | `sdk-quickstart-spring` | **dependencies** | `Spring Web` and `Spring Data for Cassandra` |
| **packaging**  |          `JAR`          | **Java Version** |                 `8` or `11`                  |

<img src="https://awesome-astra.github.io/docs/img/spring/spring-initializr.png" />

<p/>

- Import the application in your favorite IDE but do not start the application immediately.

- Add the latest version of starter as a dependency in `pom.xml` [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-spring-boot-starter/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-spring-boot-starter/) of `astra-spring-boot-starter` in the project.

  ```xml
  <dependency>
    <groupId>com.datastax.astra</groupId>
    <artifactId>astra-spring-boot-starter</artifactId>
    <version>0.3.4</version>
  </dependency>
  ```

### <span class="nosurface">2.3</span> Code and Configuration

- Change the main class with the following code, we are leveraging on the unique `AstraClient` to interact with multiple interfaces.

```java
@RestController
@SpringBootApplication
public class SdkQuickstartSpringApplication {

 public static void main(String[] args) {
  SpringApplication.run(SdkQuickstartSpringApplication.class, args);
 }

 // Provided by the Starter
 @Autowired
 private AstraClient astraClient;

 // Spring Data using the CqlSession initialized by the starter
 @Autowired
 private CassandraTemplate cassandraTemplate;

 @GetMapping("/api/devops/organizationid")
 public String showOrganizationId() {
   return astraClient.apiDevopsOrganizations().organizationId();
 }

 @GetMapping("/api/spring-data/datacenter")
 public String showDatacenterNameWithSpringData() {
   return cassandraTemplate.getCqlOperations()
                           .queryForObject("SELECT data_center FROM system.local", String.class);
 }

 @GetMapping("/api/cql/datacenter")
 public String showDatacenterNameWithSpringData() {
   return astraClient.cqlSession()
                     .execute("SELECT data_center FROM system.local")
                     .one().getString("data_center");
 }
}
```

Rename `src/main/resources/application.properties` to `src/main/resources/application.yaml`. This step eases the configuration with hierarchical keys. Populate `application.yaml` with the following content and replace the values with expected values (how to retrieve the values are explained in the [Quickstart Astra](https://github.com/datastax/astra-sdk-java/wiki/Astra-SDK-Quickstart)

```yaml
astra:
  # Allow usage of devops and Stargate apis
  api:
    application-token: <your_token>
    database-id: <your_database_id>
    database-region: <your_database_region>

  # Connectivity to Cassandra
  cql:
    enabled: true
    download-scb:
      enabled: true
    driver-config:
      basic:
        session-keyspace: <your_keyspace>
```

- Start the application

```bash
mvn clean install spring-boot:run
```

- Access the resources we created
- Get your Organization ID: `http://localhost:8080/api/devops/organizationid`
- Get your Datacenter Name (Spring-data): `http://localhost:8080/api/spring-data/datacenter`
- Get your Datacenter Name (cql): `http://localhost:8080/api/cql/datacenter`

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/DataStax-Examples/astra-samples-java/archive/refs/heads/main.zip)

## <span class="nosurface">3.</span> Spring Data Cassandra

### <span class="nosurface">3.1</span> Project Setup

#### Prerequisites [ASTRA]

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)
- You should [Have downloaded your Cloud Secure Bundle](https://awesome-astra.github.io/docs/pages/astra/download-scb/)

#### Prerequisites [Development Environment]

- You should install **Java Development Kit (JDK) 8**: Use the [reference documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) to install a **Java Development Kit**, Validate your installation with

```bash
java --version
```

- You should install **Apache Maven**: Use the [reference documentation](https://maven.apache.org/install.html) and validate your installation with

```bash
mvn -version
```

#### Setup Project

- Create a Spring Boot application from the initializer and add the `spring-boot-starter-data-cassandra`

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-cassandra</artifactId>
</dependency>
```

### <span class="nosurface">3.2</span> Code and Configuration

- Setup the configuration file `application.yaml`

```yaml
spring.data.cassandra:
  keyspace-name: myks
  username: myClientId
  password: myClientSecret
  schema-action: CREATE_IF_NOT_EXISTS # for dev purpose
  request:
    timeout: 10s
  connection:
    connect-timeout: 10s
    init-query-timeout: 10s

datastax.astra:
  # You must download it before
  secure-connect-bundle: /tmp/secure-connect-bundle.zip
```

- Create a dedicated configuration bean to parse `datastax.astra`

```java
@ConfigurationProperties(prefix = "datastax.astra")
public class DataStaxAstraProperties {

    private File secureConnectBundle;

    // Getter and Setter omitted
}
```

- Define a bean of `CqlSessionBuilderCustomizer` to add this `CloudSecureBundle`

```java
@SpringBootApplication
@EnableConfigurationProperties(DataStaxAstraProperties.class)
public class SpringDataCassandraApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringDataCassandraApplication.class, args);
    }

    @Bean
    public CqlSessionBuilderCustomizer sessionBuilderCustomizer(DataStaxAstraProperties astraProperties) {
        Path bundle = astraProperties.getSecureConnectBundle().toPath();
        return builder -> builder.withCloudSecureConnectBundle(bundle);
    }
}
```


[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/awesome-astra/sample-java-spring-data/archive/refs/heads/master.zip)
