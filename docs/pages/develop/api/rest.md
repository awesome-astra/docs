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

<!--
## Swagger Sandbox

```
todo
```
-->

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

## Using Postman with REST

Postman is a widely-used collaboration platform for API development and testing.
Using this third-party tool, you can easily test APIs with environments generated
for your test platforms and imported testing collections of API queries.

A Postman collection is available for Astra using the REST API. 

[<img src="https://run.pstmn.io/button.svg">](https://god.gw.postman.com/run-collection/17930693-47ab5f0d-407e-48cf-aa11-c51d129f1eef?action=collection%2Ffork&collection-url=entityId%3D17930693-47ab5f0d-407e-48cf-aa11-c51d129f1eef%26entityType%3Dcollection%26workspaceId%3Def3ed3ef-3a50-4651-8965-01519e15a9ba#?env%5BStargate%20Astra%20API%20Environment%5D=W3sia2V5IjoiQVNUUkFfREJfSUQiLCJ2YWx1ZSI6IkNIQU5HRV9NRSBUTyAkQVNUUkFfREJfSUQiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJDSEFOR0VfTUUgVE8gJEFTVFJBX0RCX0lEIiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6IkFTVFJBX0RCX1JFR0lPTiIsInZhbHVlIjoiQ0hBTkdFX01FIFRPICRBU1RSQV9EQl9SRUdJT04iLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJDSEFOR0VfTUUgVE8gJEFTVFJBX0RCX1JFR0lPTiIsInNlc3Npb25JbmRleCI6MX0seyJrZXkiOiJBVVRIX1RPS0VOIiwidmFsdWUiOiJDSEFOR0UgTUUgVE8gXG4kQVNUUkFfREJfQVBQTElDQVRJT05fVE9LRU4iLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJDSEFOR0UgTUUgVE8gXG4kQVNUUkFfREJfQVBQTElDQVRJT05fVE9LRU4iLCJzZXNzaW9uSW5kZXgiOjJ9LHsia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsInNlc3Npb25JbmRleCI6M30seyJrZXkiOiJncWxfYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsInNlc3Npb25JbmRleCI6NH0seyJrZXkiOiJiYXNlX3Jlc3Rfc2NoZW1hIiwidmFsdWUiOiIvYXBpL3Jlc3QvdjIvc2NoZW1hcy9rZXlzcGFjZXMiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL3Jlc3QvdjIvc2NoZW1hcy9rZXlzcGFjZXMiLCJzZXNzaW9uSW5kZXgiOjV9LHsia2V5IjoiYmFzZV9kb2Nfc2NoZW1hIiwidmFsdWUiOiIvYXBpL3Jlc3QvdjIvc2NoZW1hcy9uYW1lc3BhY2VzIiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiL2FwaS9yZXN0L3YyL3NjaGVtYXMvbmFtZXNwYWNlcyIsInNlc3Npb25JbmRleCI6Nn0seyJrZXkiOiJiYXNlX2dxbF9zY2hlbWEiLCJ2YWx1ZSI6Ii9hcGkvZ3JhcGhxbC1zY2hlbWEiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL2dyYXBocWwtc2NoZW1hIiwic2Vzc2lvbkluZGV4Ijo3fSx7ImtleSI6ImJhc2VfcmVzdF9hcGkiLCJ2YWx1ZSI6Ii9hcGkvcmVzdC92Mi9rZXlzcGFjZXMiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL3Jlc3QvdjIva2V5c3BhY2VzIiwic2Vzc2lvbkluZGV4Ijo4fSx7ImtleSI6ImJhc2VfZG9jX2FwaSIsInZhbHVlIjoiL2FwaS9yZXN0L3YyL25hbWVzcGFjZXMiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL3Jlc3QvdjIvbmFtZXNwYWNlcyIsInNlc3Npb25JbmRleCI6OX0seyJrZXkiOiJiYXNlX2dxbF9hcGkiLCJ2YWx1ZSI6Ii9hcGkvZ3JhcGhxbC9saWJyYXJ5IiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiL2FwaS9ncmFwaHFsL2xpYnJhcnkiLCJzZXNzaW9uSW5kZXgiOjEwfSx7ImtleSI6InJrZXlzcGFjZSIsInZhbHVlIjoidXNlcnNfa2V5c3BhY2UiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJ1c2Vyc19rZXlzcGFjZSIsInNlc3Npb25JbmRleCI6MTF9LHsia2V5IjoicnRhYmxlIiwidmFsdWUiOiJ1c2VycyIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6InVzZXJzIiwic2Vzc2lvbkluZGV4IjoxMn0seyJrZXkiOiJ1c2VyMWZuIiwidmFsdWUiOiJNb29raWUiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJNb29raWUiLCJzZXNzaW9uSW5kZXgiOjEzfSx7ImtleSI6InVzZXIxbG4iLCJ2YWx1ZSI6IkJldHRzIiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiQmV0dHMiLCJzZXNzaW9uSW5kZXgiOjE0fSx7ImtleSI6InVzZXIyZm4iLCJ2YWx1ZSI6IkphbmVzaGEiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJKYW5lc2hhIiwic2Vzc2lvbkluZGV4IjoxNX0seyJrZXkiOiJ1c2VyMmxuIiwidmFsdWUiOiJEb2VzaGEiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJEb2VzaGEiLCJzZXNzaW9uSW5kZXgiOjE2fSx7ImtleSI6Im5hbWVzcGFjZSIsInZhbHVlIjoibXl3b3JsZCIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Im15d29ybGQiLCJzZXNzaW9uSW5kZXgiOjE3fSx7ImtleSI6ImNvbGxlY3Rpb24iLCJ2YWx1ZSI6ImZpdG5lc3MiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJmaXRuZXNzIiwic2Vzc2lvbkluZGV4IjoxOH0seyJrZXkiOiJ1c2VyMSIsInZhbHVlIjoiSmFuZXQiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJKYW5ldCIsInNlc3Npb25JbmRleCI6MTl9LHsia2V5IjoidXNlcjJhIiwidmFsdWUiOiJKb3NlcGgiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJKb3NlcGgiLCJzZXNzaW9uSW5kZXgiOjIwfSx7ImtleSI6InVzZXIyIiwidmFsdWUiOiJKb2V5IiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiSm9leSIsInNlc3Npb25JbmRleCI6MjF9LHsia2V5IjoidXNlcjMiLCJ2YWx1ZSI6Ik1hcnRoYSIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Ik1hcnRoYSIsInNlc3Npb25JbmRleCI6MjJ9LHsia2V5IjoiZ2tleXNwYWNlIiwidmFsdWUiOiJsaWJyYXJ5IiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoibGlicmFyeSIsInNlc3Npb25JbmRleCI6MjN9LHsia2V5IjoiZ3RhYmxlMSIsInZhbHVlIjoiYm9vayIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6ImJvb2siLCJzZXNzaW9uSW5kZXgiOjI0fSx7ImtleSI6Imd0YWJsZTIiLCJ2YWx1ZSI6InJlYWRlciIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6InJlYWRlciIsInNlc3Npb25JbmRleCI6MjV9XQ==)
