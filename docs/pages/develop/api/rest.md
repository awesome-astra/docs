<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">
<link rel="stylesheet" type="text/css" href="../../../../assets/stylesheets/formbase.min.css">

<link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.25.1/swagger-ui.css">
<script src="https://unpkg.com/swagger-ui-dist@3.25.1/swagger-ui-standalone-preset.js"></script>
<script src="https://unpkg.com/swagger-ui-dist@3.25.1/swagger-ui-bundle.js"></script>
<script src="../../../../assets/javascripts/swagger-sandbox.js"></script>

## Overview

Stargate is a data gateway (Proxy) on top of Apache Cassandra which exposes new interfaces to simplify integration in your applications. It is a way to create stateless components and ease the integration through one of four different HTTP Apis (rest, doc, graphQL, gRPC). In this chapter we will cover integration with `REST Apis` also called `DATA` in the swagger specifications.

To know more regarding this interface specially you can have a look to [dedicated section of the wiki](https://awesome-astra.github.io/docs//Stargate-Api-Rest) or [reference Stargate Rest Api Quick Start Guide](https://stargate.io/docs/stargate/1.0/quickstart/quick_start-rest.html).

> ⚠️ We recommend using version `V2` (_with V2 in the URL_) as it covers more features and V1 will be deprecated eventually.

## Design

<img src="../../../../img/stargate-api-rest/api-data.png" />

## Prerequisites

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)

## Swagger Sandbox

```
todo
```

## Operations

- List keyspaces

<img src="../../../../img/stargate-api-rest/schemas-keyspace-list.png" />

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
 }
}
```

- Create a Table

<img src="../../../../img/stargate-api-rest/schemas-table-create.png" />

> Query used is `createTableJson` here:

```json
{
  "name": "users",
  "columnDefinitions": [
    {
      "name": "firstname",
      "typeDefinition": "text"
    },
    {
      "name": "lastname",
      "typeDefinition": "text"
    },
    {
      "name": "email",
      "typeDefinition": "text"
    },
    {
      "name": "color",
      "typeDefinition": "text"
    }
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

Create Table code

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

- Insert a Row

<img src="../../../../img/stargate-api-rest/data-rows-insert.png" />

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

- Retrieve a row

<img src="../../../../img/stargate-api-rest/data-rows-read.png" />

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

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/DataStax-Examples/astra-samples-java/archive/refs/heads/main.zip)
