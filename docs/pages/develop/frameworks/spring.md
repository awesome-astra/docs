### Working with Spring

<img src="https://github.com/datastaxdevs/awesome-astra/raw/main/_img/tile-spring.png?raw=true" align="left" height="180px"/>

Spring makes programming Java quicker, easier, and safer for everybody. Spring’s focus on speed, simplicity, and productivity has made it the world's most popular Java framework.. To get more information regarding the framework visit the reference [Spring.io](https://spring.io).

Spring applications are packaged as standalone using [`Spring Boot`](https://spring.io/projects/spring-boot). To add capabilities to applications multiple `starters` are provided by Spring. In the current page we will details which are the starters needed to interact Astra interfaces. Datastax team also implemented a dedicated `astra-spring-boot-starter` to help you with the boiler plate code.

## Astra Spring Boot Starter

#### ℹ️ Overview

**The Astra Spring Boot Starter** once imported in a Spring Boot application, will configure both Astra SDK and Spring Data Cassandra to work with AstraDB. Configuration keys are read in `application.yaml` like any spring applications with a dedicated prefix `astra`.

The starter will initialize any beans you would need (`AstraClient`, `CqlSession`, `StargateClient`) to use all interfaces exposes by Astra. Not all are activated by default, you want to initialize only what you need.

![pic](https://github.com/datastax/astra-sdk-java/raw/main/docs/img/quickstart-spring.png?raw=true)

#### 📦. Prerequisites [ASTRA]

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create and Astra Database](/pages/astra/create-instance/)
- You should [Have an Astra Token](/pages/astra/create-token/)

#### 📦. Prerequisites [Development Environment]

- You should install **Java Development Kit (JDK) 8**: Use the [reference documentation](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html) to install a **Java Development Kit**, Validate your installation with

```bash
java --version
```

- You should install **Apache Maven**: Use the [reference documentation](https://maven.apache.org/install.html) and validate your installation with

```bash
mvn -version
```

#### 📦. Setup Project

- Create your project with [Spring Initializr](https://start.spring.io). Dependencies needed are `web` and `data-cassandra` but we did the work for you if you click the [template link](https://start.spring.io/#!type=maven-project&language=java&platformVersion=2.5.6&packaging=jar&jvmVersion=1.8&groupId=com.datastax.tutorial&artifactId=sdk-quickstart-spring&name=sdk-quickstart-spring&description=Use%20Astra%20Spring%20Boot%20Starter&packageName=com.datastax.tutorial&dependencies=web,data-cassandra)

|    Property    |          Value          |     Property     |                    Value                     |
| :------------: | :---------------------: | :--------------: | :------------------------------------------: |
|  **groupId**   | `com.datastax.tutorial` |   **package**    |           `com.datastax.tutorial`            |
| **artifactId** | `sdk-quickstart-spring` | **description**  |              Sample Spring App               |
|    **name**    | `sdk-quickstart-spring` | **dependencies** | `Spring Web` and `Spring Data for Cassandra` |
| **packaging**  |          `JAR`          | **Java Version** |                 `8` or `11`                  |

<img src="https://github.com/datastax/astra-sdk-java/blob/main/docs/img/spring-initializr.png?raw=true" />

<p>

- Import the application in your favorite IDE but do not start the application immediately.

- Add the latest version of starter as a dependency in `pom.xml` [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-spring-boot-starter/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-spring-boot-starter/) of `astra-spring-boot-starter` in the project.

```xml
<dependency>
  <groupId>com.datastax.astra</groupId>
  <artifactId>astra-spring-boot-starter</artifactId>
  <version>0.3.0</version>
</dependency>
```

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

- Rename `src/main/resources/application.properties` to `src/main/resources/application.yaml`. This step eases the configuration with hierarchical keys. Populate `application.yaml` with the following content and replace the values with expected values (how to retrieve the values are explained in the [Quickstart Astra](https://github.com/datastax/astra-sdk-java/wiki/Astra-SDK-Quickstart)

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
  - Get your Organization ID: http://localhost:8080/api/devops/organizationid
  - Get your Datacenter Name (Spring-data): http://localhost:8080/api/spring-data/datacenter
  - Get your Datacenter Name (cql): http://localhost:8080/api/cql/datacenter

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/DataStax-Examples/astra-samples-java/archive/refs/heads/main.zip)

## 5. Spring Data Cassandra

As describe in the [Spring documentation](https://docs.spring.io/spring-data/cassandra/docs/current/reference/html/#cassandra.choose-style), there are multiple ways to interact with Cassandra. In this tutorial we will show you how to use all of them

- **Repository Abstraction** lets you create repository declarations in your data access layer. The goal of Spring Data’s repository abstraction is to significantly reduce the amount of boilerplate code required to implement data access layers for various persistence stores.

- **`CassandraTemplate` wraps a `CqlTemplate`** to provide query result-to-object mapping and the use of SELECT, INSERT, UPDATE, and DELETE methods instead of writing CQL statements. This approach provides better documentation and ease of use.

**ℹ️ Connecting Spring Data Cassandra to Astra**

Spring Data Cassandra leverages on a `CqlSession` bean, all the time. To build the `CqlSession` there area again multiple ways described in the [documentation](https://docs.spring.io/spring-data/cassandra/docs/current/reference/html/#cassandra.connectors) from custom code to `AbstractCassandraConfiguration`. **FORGET ABOUT IT.**

Astra Spring Boot Starter creates the `CqlSession` bean for you using the keys previously listed as such you do not need to use configuration keys like `spring.data.cassandra` (_or very very few for special behaviour_)

#### ✅ Step 5a. Spring Data Cassandra Connectivity

This one is straight forward. Remove the `exclude` in `@SpringBootApplication`

```
@SpringBootApplication
```

You can restart the application, spring data is connected to Astra.

#### ✅ Step 5b. Working with `CassandraRepository<BEAN,KEY>`

- Create a bean `Todos` in the same package `com.datastax.tutorial`

```java
@Table
public class Todos {
 @PrimaryKey
 @CassandraType(type = Name.UUID)
 private UUID uid = UUID.randomUUID();

 private String title;

 private boolean completed = false;

 public Todos() {}

 public Todos(String title) { this.title = title; }

 //_getters and setters have been omitted here
```

- Create an **interface** `TodosRepository` in the same package `com.datastax.tutorial`

```java
package com.datastax.tutorial;
import org.springframework.data.cassandra.repository.CassandraRepository;

public interface TodosRepository extends CassandraRepository<Todos, String> {}
```

- Edit the `QuickStartSpring` to add the following:

```java
  @Autowired
  private TodosRepository todoRepository;

  @PostConstruct
  public void insertTodos() {
    todoRepository.save(new Todos("Create Spring Project"));
    todoRepository.save(new Todos("Setup Astra Starter"));
    todoRepository.save(new Todos("Setup Spring Starter"));
  }

  @GetMapping("/todos")
  public List<Todos> todos() {
    return todoRepository.findAll(CassandraPageRequest.first(10)).toList();
  }
```

- Finally tells Spring Data to create for us the tables with configuration. (not for CqlSession, only for this). In `application.yaml` add the following:

```yaml
spring:
  data:
    cassandra:
      schema-action: CREATE_IF_NOT_EXISTS
```

- You can restart your application and access [http://localhost:8080/todos](http://localhost:8080/todos)

```json
[
  {
    "uid": "83d7a60d-1f24-42c5-aa16-9275f36dc312",
    "title": "Setup Spring Starter",
    "completed": false
  },
  {
    "uid": "95e8a502-786d-4dd2-983a-b451a12877fe",
    "title": "Setup Astra Starter",
    "completed": false
  },
  {
    "uid": "44da79c3-73a6-46d0-84cb-3afa2a96d99e",
    "title": "Create Spring Project",
    "completed": false
  }
]
```

_ℹ️ Note: Each time you restart the application you will get 3 new tasks as the primary is an generated UUID._

#### ✅ Step 5c. Working with `CqlTemplate` and `CassandraTemplate`

`CassandraTemplate` is the bean initialized by Spring-Data. It embeds the `CqlTemplate` = `CqlOperations`.

- Add the following to your main class

```java
@Autowired
private CassandraTemplate cassandraTemplate;

@GetMapping("/datacenter")
public String datacenter() {
  return cassandraTemplate
     .getCqlOperations()
     .queryForObject("SELECT data_center FROM system.local", String.class);
}
```

- You can restart your application and access [http://localhost:8080/datacenter](http://localhost:8080/datacenter)

## Spring Data Cassandra

### Overview

- Spring data
- Spring data cassandra
- Leveraging java drivers
- 10 pitfalls of Spring Data Cassandra

- [Guide](https://spring.io/guides/gs/accessing-data-cassandra/)

```
TODO
```

### Spring Boot 1x and Spring Data 2x

- Working with 3.x driver
- 3.8 is required
- how to enforce version
- compatibility table

```
TODO
```

- https://github.com/mborges-pivotal/astra-springboot154

### Spring Boot 2x and Spring Data 3x (recommended)

- Working with 4.x drivers
- CqlSession Customizer
- Create your own Cql Session

```
TODO
```

## Spring and Rest Apis

### Spring Web (Rest Template)

```
TODO
```

### Spring Webflux (Webclient)

```
TODO
```

## Spring Cloud and Astra

```
TODO
```

## Spring Batch and Astra

```
TODO
```
