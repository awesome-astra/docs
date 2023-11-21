
<link rel="stylesheet" href="https://maxcdn.bxootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

## 1. Overview

The Astra DB Client, as the name suggests, is a client library that interacts with the various APIs of the Astra DataStax Platform. It enables users to connect to, utilize, and administer the Astra Vector product. The library encompasses two distinct clients working in tandem:

- **AstraDBClient**: This is the primary entry point to the library and serves as the initial object to access all its features. The client supports both **schema operations** (such as adding and deleting vector stores and collections) and **data operations** (including insert, update, and delete functions). It notably offers advanced search capabilities, which encompass **similarity search, text-based search, and metadata filtering**.

- **AstraDBOpsClient**: This class is specifically designed for the **administration** of the Astra Vector platform. It facilitates the creation, deletion, and management of various **databases** within your tenant. Authentication is done via a token that is scoped to your tenant.

<img src="../../../../img/sdk/astra-vector-client.png" />

## 2. Prerequisites

- [x] **Install Java Development Kit (JDK) 11++**

Use the [java reference documentation](https://www.oracle.com/java/technologies/downloads/)  to install a Java Development Kit (JDK) tailored for your operating system. After installation, you can validate your setup with the following command:

```bash
java --version
```

- [x] **Install Apache Maven (3.9+) or Gradle**

Samples and tutorials are designed to be used with `Apache Maven`. Follow the instructions in the [reference documentation](https://maven.apache.org/install.html) to install Maven. To validate your installation, use the following command:

```bash
mvn -version
```

- [x] **Create your DataStax Astra account**:

<a href="https://astra.dev/3B7HcYo" class=md-button>Sign Up to Datastax Astra</a>

- [x] **Create an Astra Token**

Once logged into the user interface, select settings from the left menu and then click on the tokens tab to create a new token.

<img src="../../../../img/astra/astra-settings-1.png" />

You want to pick the following role:

| Properties     | Values                       |
|----------------|------------------------------|
| **Token Role** | `Organization Administrator` |

The Token contains properties `Client ID`, `Client Secret` and the `token`. You will only need the third (starting with `AstraCS:`)

```
{
  "ClientId": "ROkiiDZdvPOvHRSgoZtyAapp",
  "ClientSecret": "fakedfaked",
  "Token":"AstraCS:fake" <========== use this field
}
```

## 3. Setup project

- [x] **If you are using `Maven` Update your `pom.xml` file with the latest version of the Vector SDK [![Maven Central](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-spring-boot-starter/badge.svg)](https://maven-badges.herokuapp.com/maven-central/com.datastax.astra/astra-sdk-vector)**

```xml
<dependency>
  <groupId>com.datastax.astra</groupId>
  <artifactId>astra-sdk-vector</artifactId>
  <version>${latest}</version>
</dependency>
```

- [x] **If you are using gradle change the `build.dgradle` with**

```typesafe
dependencies {
    compile 'com.datastax.astra:astra-sdk-vector-1.0'
}
```

## 4. Getting Started

With a valid token, you can create an `AstraVectorClient` object and start using the library.

### 4.1 Using Json

```java

// 1) Initialization
AstraDBClient astraClient = new AstraDBClient("AstraCS:....");

// 2) Create database if not exists
if (!astraClient.isDatabaseExists("getting_started")) {
  UUID dbId = astraDBClient.createDatabase(databaseName);
}

// 3) Select the database
AstraDB db = astraClient.database("getting_started");

// 4) Create or select collection
CollectionClient demoCollection;
if (!db.isCollectionExists("demo")) {
  demoCollection = db.createCollection("demo",14);
} else {
  demoCollection = db.collection("demo");
}

// 5) Insert a few vectors

// 5a. Insert One (attributes as key/value)
demoCollection.insertOne(new JsonDocument()
  .id("doc1") // generated if not set
  .vector(new float[]{1f, 0f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f})
  .put("product_name", "HealthyFresh - Beef raw dog food")
  .put("product_price", 12.99));
// 5b. Insert One (attributes as JSON)
demoCollection.insertOne(new JsonDocument()
  .id("doc2")
  .vector(new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f})
  .data("{"
  +"   \"product_name\": \"HealthyFresh - Chicken raw dog food\", "
  + "  \"product_price\": 9.99"
  + "}")
);
// 5c. Insert One (attributes as a MAP)
demoCollection.insertOne(new JsonDocument()
  .id("doc3")
  .vector(new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f})
  .data(Map.of("product_name", "HealthyFresh - Chicken raw dog food"))
);
// 5d. Insert as a single Big JSON
demoCollection.insertOne(new JsonDocument()
  .id("doc4")
  .vector(new float[]{1.0f, 1.0f, 1.0f, 1.0f, 1.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f, 0.0f})
  .put("product_name", "HealthyFresh - Chicken raw dog food")
  .put("product_price", 9.99)
);

// 6) Similarity Search
float[] embeddings     = new float[] {1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f};
Filter  metadataFilter = new Filter().where("product_price").isEqualsTo(9.99);
int maxRecord = 10;
List<JsonResult> resultsSet = demoCollection
        .similaritySearch(embeddings, metadataFilter, maxRecord);
```

### 4.2 Object Mapping

Instead of interacting with the database with key/values you may want to
associate an object to each record in the collection for this you can use `CollectionRepository`. If we reproduce the sample before

- [x] **Create the object**

```java
static class Product {
  
  @JsonProperty("product_name")
  private String name;
  
  @JsonProperty("product_price")
  private Double price;
  
  // getters and setters
}
```

- [x] **Similarity Search**

```java
// 1) Initialization
AstraDB db = new AstraDBClient("AstraCS:....")
        .database("getting_started");

// 2) Create or select collection
CollectionRepository<Product> productRepository = db
        .collectionRepository(collectionName, Product.class);

// 3) Insert a few vectors
productRepository.insert(new Document<>("doc5",
        new Product("HealthyFresh - Beef raw dog food", 12.99),
        new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f}));
productRepository.insert(new Document<>("doc6",
        new Product("Another Product", 9.99),
        new float[]{1f, 1f, 1f, 0f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f}));

// 4) Similarity Search
float[] embeddings     = 
        new float[] {1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f};
Filter  metadataFilter = 
        new Filter().where("product_price").isEqualsTo(9.99);
int maxRecord = 10;
List<Result<Product>> results = productRepository
        .similaritySearch(embeddings, metadataFilter, maxRecord);
```

## 5. Reference Guide

<img src="../../../../img/sdk/astra-vector-client-classes.png" />

### 5.1 AstraDBClient

The initialization happens in `AstraVectorClient` class. It can be done in different ways:

- [x] **Initialization** 

```java

// 1. Expecting env var `ASTRA_DB_APPLICATION_TOKEN` 
AstraDBClient client = new AstraVectorClient();

// 2. Using the token
AstraDBClient client = new AstraDBClient("AstraCS:....");

// 3. Non production environment
AstraDBClient client = new AstraDBClient(astraToken, AstraEnvironment.DEV);
```

### 5.2 Working with Databases

- [x] **List Databases with `findAllDatabases`**

```java
client.findAllDatabases()
        .map(Database::getInfo)
        .map(DatabaseInfo::getName)
        .forEach(log::info);
```

- [x] **Create Databases with `createDatabase`**

The function can take a database identifier (uuid) or the database name.

```java
UUID db1Id = client.createDatabase("db1");

// Specify the region (enum for the user to pick, +  explicit FREE_TIER)
UUID db2Id = client.createDatabase("db2",
  AstraVectorClient.FREE_TIER_CLOUD,
  AstraVectorClient.FREE_TIER_CLOUD_REGION);
```

- [x] **Delete Databases with `deleteDatabase`**

The function can take a database identifier (uuid) or the database name.
```java
client.deleteDatabase("db1");
```

- [x] **Access database from its `name` or `id`**

```java
// Retrieve from an id
UUID id = UUID.randomUUID();
Optional<Database> db2 = findDatabaseById(id);

// Retrieve from  its name
Optional<Database> db2 = findDatabaseByName(name)
```

- [x] **Check a database exists**

```java
boolean isDatabaseExists(id)
```

- [x] **Accessing devops API**

```java
AstraDBOpsClient devops = clientgetAstraDbOps();
```

- [x] **Accessing object `AstraDB`**

```java
AstraDB myDB = client.database("getting_started");
```


### 5.3 AstraDB

Assuming the database already exist and you want to use it you can directly instantiate this class
from am astra token and the `api_endpoint`. The endpoint can be copied from the user interface but it looks like

```console
https://{database-id}-{database-region}.apps.astra.datastax.com
```

- [x] **Initializations**

```java
// 1) Initialization with api endpoint
AstraDB db1 = new AstraDB("AstraCS:....", "https:://");

// 2) Initialization with databaseId 
AstraDB db2 = new AstraDB("AstraCS:....", dbId);
```

### 5.4 Working with Collections
 
- [x] **Find all collections**

```java
// assuming you have vectorDatabase
Stream<CollectionDefinition> collections = db.findAllCollections();
```

- [x] **Does a collection exists**

```java
boolean demo  = db.isCollectionExists("collection1");
```

- [x] **Find a collection from its name**

```java
Optional<CollectionDefinition> collection  = db.findCollection("collection1");
```

- [x] **Delete a collection from its name**

```java
db.deleteCollection("collection1");
```

- [x] **Create Collection with `createCollection`**

```java
// Create a collection without vector
CollectionClient col1 = db.createCollection("store_name");

// Create a collection with vector
CollectionClient col2 = db.createCollection("vector_store", 1536);

// More information with the usage of the defintion
CollectionClient col3 = db.createCollection(CollectionDefinition.builder()
        .name("tmp_collection")
        .vector(14, cosine));
```

- [x] **Use same method providing a bean you get `CollectionRepository`**


```java
// Create a collection without vector
CollectionRepository<Product> col1 = db
   .createCollection("store_name", Product.class);

// Create a collection with vector
CollectionRepository<Product> col2 = db
   .createCollection("vector_store", 1536, Product.class);

// More information with the usage of the defintion
CollectionRepository<Product>  col3 = db
   .createCollection(CollectionDefinition
     .builder()
     .name("tmp_collection")
     .vector(14, cosine), 
    Product.class);
```

- [x] **If collection already exist**

```java
// Accessing CollectionClient
CollectionClient col1 = db
    .collection(name)
        
// Accessing CollectionRepository
CollectionRepository<Product> repo = db
   .collectionRepository("demo", Product.class);
```


### 5.5 CollectionClient
        
- [x] **Insertions**

- If no id is provide when inserting the system will generate on for you

```java
// Insert with key/values
col1.insert(new JsonDocument()
  .id("doc1") // generated if not set
  .vector(new float[]{1f, 0f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f})
  .put("product_name", "HealthyFresh - Beef raw dog food")
  .put("product_price", 12.99));
 
// Insert with payload as Json
col1.insert(new JsonDocument()
  .id("doc2")
  .vector(new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f})
  .data("{"
       +"   \"product_name\": \"HealthyFresh - Chicken raw dog food\", "
       + "  \"product_price\": 9.99"
       + "}")
);

// Insert with payload as a Map
col1.insert(new JsonDocument()
   .id("doc3")
   .vector(new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f})
   .data(Map.of("product_name", "HealthyFresh - Chicken raw dog food"))
);

// Insert as a Json
col1.insert("{"
    + "   \"_id\":\"doc4\","
    + "   \"$vector\":[1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],"
    + "   \"product_name\": \"HealthyFresh - Chicken raw dog food\", "
    + "   \"product_price\": 9.99"
    + "}");
```

You can retrieve vector documents from their `id` of their `vector`. It is not really a search 
but rather a `findById`.

- [x] **Find By Id**

Retrieve a document from its id (if exists)

```java
// Assuming you have a VectorStore<MyBean>
Optional<MyBean> result = col1.findById("doc1");

// When working with JsonVectorStore to returned raw 'JsonResult'
Optional<JsonResult> result = col1.findByIdJson("doc1");
```

- [x] **Find By Vector**

Retrieve a document from its vector (if exists)

```java
// Assuming you have a VectorStore<MyBean>
Optional<MyBean> result = col1
        .findByVector(new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f});

// When working with JsonVectorStore to returned raw 'JsonResult'
Optional<JsonResult> result = col1
        .findByVectorJson(new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f});
```

- [x] **Find all**

You can retrieve all vectors from your store but it might be slow and consume a lot of memory, 
prefered paed request except when in development.

```java
// Find All for VectorStore<MyBean>
Stream<JsonResult> all = col1.findAll();
```

- [x] **Find with a query**

You can search on any field of the document. All fields are indexed. Using a `SelectQuery` populated through
builder you can get some precise results.

```java
Stream<JsonResult> all = col1.findAll(SelectQuery.builder()
  .where("product_price")
  .isEqualsTo(9.99)
  .build());
```

- [x] **Find Page**

Find Page works the same as `findAll(Query)` where you can pass a `SelectQuery` as input. In the object `Page` the field `pagingState` should be provided from page to another.

```java

// VectorStore<MyBean>
// JsonVectorStore
Page<JsonResult> page1 = vectorStore.findPage(SelectQuery.builder().build());
page1.getPageState().ifPresent(pagingState -> {
  Page<JsonResult> page2 = vectorStore
    .findPageJson(SelectQuery
    .builder().withPagingState(pagingState).build());
});
```

In the query ou can then add filter with the builder.

A similarity search is a query that will find records where vectors are the closest to a given vector. 
It is done by providing a vector and a number of results to return. The result is a list of `JsonResult` that contains the payload and the distance.

- [x] **Simple Search**

```java
float[] embeddings = 
   new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f};
int limit = 2;
List<JsonDocument> results = col1.similaritySearch(embeddings, limit);
```

- [x] **Search with filter**

```java
float[] embeddings = 
   new float[]{1f, 1f, 1f, 1f, 1f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f, 0f};
int limit = 2;
Filter  metadataFilter = new Filter().where("product_price").isEqualsTo(9.99);
List<JsonDocument> results = col1
        .similaritySearch(embeddings, metadataFilter, limit);
```

- When a limit is provided the service return a list of Results.
- When no limit is provided the service return a Page of results and paging is enabled.
- The limit must be between 1 and 20.

### 5.6 CollectionRepository

## 6. Troubleshooting

- [x] Common Errors and Solutions

List typical issues users might face and their resolutions.

- [x] 6.2. FAQ

Address frequently asked questions.

## 7. Best Practices

- [x]  7.1. Performance Tips

Offer guidance on optimizing usage for better performance.

- [x]  7.2. Security Recommendations

Share advice on secure practices when using the library.

## 8. Contribution Guide

- [x] 8.1. Code of Conduct

Outline the behavior expected from contributors.

- [x] 8.2. Contribution Steps

Describe how one can contribute to the library, e.g., via pull requests.

## 9. Release Notes/Changelog

Track changes made in each version of the library.

## 10. Contact and Support

- [x] 10.1. Reporting Bugs

Provide a link or method for users to report issues.

- [x] 10.2. Getting Help

Point users to forums, support channels, or other resources.