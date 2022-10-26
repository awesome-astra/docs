## Overview

**GraphQL** is a query language for APIs and a runtime for fulfilling those queries with existing data. [Stargate.io](https://stargate.io/) provides a graphQL interface which allows you to easily modify and query your table data using GraphQL types, mutations, and queries.

Stargate GraphQL API supports two modes of interaction:

- **schema-first** which allows you to create idiomatic GraphQL types, mutations, and queries in a manner familiar to GraphQL developers. The schema is deployed and can be updated by deploying a new schema without recreating the tables and columns directly.

- **cql-first** which translates CQL tables into GraphQL types, mutations, and queries. The GraphQL schema is automatically generated from the keyspace, tables, and columns defined, but no customization is allowed.


## Prerequisites

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)

## Exploring the GraphQL API with the GraphQL playground

A simple way to get started with GraphQL is to use the built-in GraphQL playground. The playground allows you to create new schema and interact with the GraphQL APIs. The server paths are structured to provide access to creating and querying your schemas, as well as querying and modifying your data. 


**✅ Open the GraphQL Playground**

Open the playground from the Connect tab in the APIs section.

<img src="../../../../img/stargate-api-graphql/connect.png" />

Remember to add your token to the **HTTP HEADERS** at the bottom of the screen.

<img src="../../../../img/stargate-api-graphql/playground1.png" />

**✅ Creating a keyspace** :

Before you can start using the GraphQL API, you must first create a keyspace and at least one table in your database. If you are connecting to a database with an existing schema, you can skip this step.

For this example, we will use a keyspace called `library`:

<img src="../../../../img/stargate-api-graphql/create-keyspace1.png" />

**✅ Creating a Table** :

There are three Stargate GraphQL API endpoints, one for creating schema in cql-first, one for deploying a schema in the schema-first, and the third for querying or mutating a keyspace.

**Schema**

&nbsp;&nbsp;&nbsp;&nbsp;`https://$ASTRA_CLUSTER_ID-$ASTRA_REGION.apps.astra.datastax.com:8080/api/graphql-schema`

**Admin**

&nbsp;&nbsp;&nbsp;&nbsp;`https://$ASTRA_CLUSTER_ID-$ASTRA_REGION.apps.astra.datastax.com:8080/api/graphql-admin`

**Querying**

&nbsp;&nbsp;&nbsp;&nbsp;`https://$ASTRA_CLUSTER_ID-$ASTRA_REGION.apps.astra.datastax.com:8080/api/graphql/{keyspace}`

- In the `graphql-schema` endpoint, use this query to create a new table

```
mutation {
  books: createTable(
    keyspaceName:"library",
    tableName:"books",
    partitionKeys: [ # The keys required to access your data
      { name: "title", type: {basic: TEXT} }
    ]
    values: [ # The values associated with the keys
      { name: "author", type: {basic: TEXT} }
    ]
  )
  authors: createTable(
    keyspaceName:"library",
    tableName:"authors",
    partitionKeys: [
      { name: "name", type: {basic: TEXT} }
    ]
    clusteringKeys: [ # Secondary key used to access values within the partition
      { name: "title", type: {basic: TEXT}, order: "ASC" }
    ]
  )
}
```

You should see the following confirmation once the command executes.

<img src="../../../../img/stargate-api-graphql/createtables.png" />

**✅ Inserting Data** :

Any of the created APIs can be used to interact with the GraphQL data, to write or read data.

First, let’s navigate to your new keyspace `library` inside the playground. Switch to `graphql` tab and pick the url `/graphql/library`.

- Use this query

```
mutation insert2Books {
  moby: insertbooks(value: {title:"Moby Dick", author:"Herman Melville"}) {
    value {
      title
    }
  }
  catch22: insertbooks(value: {title:"Catch-22", author:"Joseph Heller"}) {
    value {
      title
    }
  }
}
```

- Don't forget to update the header again with your token details

```
{
  "x-cassandra-token":"your token"
}
```

- You should see that two books have been added to the table.

<img src="../../../../img/stargate-api-graphql/insertdata.png" />


**✅ Querying Data** :

To query the data, switch to the `graphql/library` endpoint and execute the following

```
query oneBook {
    books (value: {title:"Moby Dick"}) {
      values {
        title
        author
      }
    }
}
```

The query results will look like the following

<img src="../../../../img/stargate-api-graphql/readdata.png" />

## Using Postman with GraphQL

Postman is a widely-used collaboration platform for API development and testing.
Using this third-party tool, you can easily test APIs with environments generated
for your test platforms and imported testing collections of API queries.

A Postman collection is available for Astra using the GraphQL API. 

* [<img src="https://run.pstmn.io/button.svg">](https://god.gw.postman.com/run-collection/17930693-65da5c64-561a-449b-a0e8-0318575f6871?action=collection%2Ffork&collection-url=entityId%3D17930693-65da5c64-561a-449b-a0e8-0318575f6871%26entityType%3Dcollection%26workspaceId%3Def3ed3ef-3a50-4651-8965-01519e15a9ba#?env%5BStargate%20Astra%20API%20Environment%5D=W3sia2V5IjoiQVNUUkFfREJfSUQiLCJ2YWx1ZSI6IkNIQU5HRV9NRSBUTyAkQVNUUkFfREJfSUQiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJDSEFOR0VfTUUgVE8gJEFTVFJBX0RCX0lEIiwic2Vzc2lvbkluZGV4IjowfSx7ImtleSI6IkFTVFJBX0RCX1JFR0lPTiIsInZhbHVlIjoiQ0hBTkdFX01FIFRPICRBU1RSQV9EQl9SRUdJT04iLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJDSEFOR0VfTUUgVE8gJEFTVFJBX0RCX1JFR0lPTiIsInNlc3Npb25JbmRleCI6MX0seyJrZXkiOiJBVVRIX1RPS0VOIiwidmFsdWUiOiJDSEFOR0UgTUUgVE8gXG4kQVNUUkFfREJfQVBQTElDQVRJT05fVE9LRU4iLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJDSEFOR0UgTUUgVE8gXG4kQVNUUkFfREJfQVBQTElDQVRJT05fVE9LRU4iLCJzZXNzaW9uSW5kZXgiOjJ9LHsia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsInNlc3Npb25JbmRleCI6M30seyJrZXkiOiJncWxfYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Imh0dHA6Ly97e0FTVFJBX0RCX0lCfX0te3tBU1RSQV9EQl9SRUdJT059fS5hcHBzLmFzdHJhLmRhdGFzdGF4LmNvbSIsInNlc3Npb25JbmRleCI6NH0seyJrZXkiOiJiYXNlX3Jlc3Rfc2NoZW1hIiwidmFsdWUiOiIvYXBpL3Jlc3QvdjIvc2NoZW1hcy9rZXlzcGFjZXMiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL3Jlc3QvdjIvc2NoZW1hcy9rZXlzcGFjZXMiLCJzZXNzaW9uSW5kZXgiOjV9LHsia2V5IjoiYmFzZV9kb2Nfc2NoZW1hIiwidmFsdWUiOiIvYXBpL3Jlc3QvdjIvc2NoZW1hcy9uYW1lc3BhY2VzIiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiL2FwaS9yZXN0L3YyL3NjaGVtYXMvbmFtZXNwYWNlcyIsInNlc3Npb25JbmRleCI6Nn0seyJrZXkiOiJiYXNlX2dxbF9zY2hlbWEiLCJ2YWx1ZSI6Ii9hcGkvZ3JhcGhxbC1zY2hlbWEiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL2dyYXBocWwtc2NoZW1hIiwic2Vzc2lvbkluZGV4Ijo3fSx7ImtleSI6ImJhc2VfcmVzdF9hcGkiLCJ2YWx1ZSI6Ii9hcGkvcmVzdC92Mi9rZXlzcGFjZXMiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL3Jlc3QvdjIva2V5c3BhY2VzIiwic2Vzc2lvbkluZGV4Ijo4fSx7ImtleSI6ImJhc2VfZG9jX2FwaSIsInZhbHVlIjoiL2FwaS9yZXN0L3YyL25hbWVzcGFjZXMiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiIvYXBpL3Jlc3QvdjIvbmFtZXNwYWNlcyIsInNlc3Npb25JbmRleCI6OX0seyJrZXkiOiJiYXNlX2dxbF9hcGkiLCJ2YWx1ZSI6Ii9hcGkvZ3JhcGhxbC9saWJyYXJ5IiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiL2FwaS9ncmFwaHFsL2xpYnJhcnkiLCJzZXNzaW9uSW5kZXgiOjEwfSx7ImtleSI6InJrZXlzcGFjZSIsInZhbHVlIjoidXNlcnNfa2V5c3BhY2UiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJ1c2Vyc19rZXlzcGFjZSIsInNlc3Npb25JbmRleCI6MTF9LHsia2V5IjoicnRhYmxlIiwidmFsdWUiOiJ1c2VycyIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6InVzZXJzIiwic2Vzc2lvbkluZGV4IjoxMn0seyJrZXkiOiJ1c2VyMWZuIiwidmFsdWUiOiJNb29raWUiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJNb29raWUiLCJzZXNzaW9uSW5kZXgiOjEzfSx7ImtleSI6InVzZXIxbG4iLCJ2YWx1ZSI6IkJldHRzIiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiQmV0dHMiLCJzZXNzaW9uSW5kZXgiOjE0fSx7ImtleSI6InVzZXIyZm4iLCJ2YWx1ZSI6IkphbmVzaGEiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJKYW5lc2hhIiwic2Vzc2lvbkluZGV4IjoxNX0seyJrZXkiOiJ1c2VyMmxuIiwidmFsdWUiOiJEb2VzaGEiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJEb2VzaGEiLCJzZXNzaW9uSW5kZXgiOjE2fSx7ImtleSI6Im5hbWVzcGFjZSIsInZhbHVlIjoibXl3b3JsZCIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Im15d29ybGQiLCJzZXNzaW9uSW5kZXgiOjE3fSx7ImtleSI6ImNvbGxlY3Rpb24iLCJ2YWx1ZSI6ImZpdG5lc3MiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJmaXRuZXNzIiwic2Vzc2lvbkluZGV4IjoxOH0seyJrZXkiOiJ1c2VyMSIsInZhbHVlIjoiSmFuZXQiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJKYW5ldCIsInNlc3Npb25JbmRleCI6MTl9LHsia2V5IjoidXNlcjJhIiwidmFsdWUiOiJKb3NlcGgiLCJlbmFibGVkIjp0cnVlLCJzZXNzaW9uVmFsdWUiOiJKb3NlcGgiLCJzZXNzaW9uSW5kZXgiOjIwfSx7ImtleSI6InVzZXIyIiwidmFsdWUiOiJKb2V5IiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoiSm9leSIsInNlc3Npb25JbmRleCI6MjF9LHsia2V5IjoidXNlcjMiLCJ2YWx1ZSI6Ik1hcnRoYSIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6Ik1hcnRoYSIsInNlc3Npb25JbmRleCI6MjJ9LHsia2V5IjoiZ2tleXNwYWNlIiwidmFsdWUiOiJsaWJyYXJ5IiwiZW5hYmxlZCI6dHJ1ZSwic2Vzc2lvblZhbHVlIjoibGlicmFyeSIsInNlc3Npb25JbmRleCI6MjN9LHsia2V5IjoiZ3RhYmxlMSIsInZhbHVlIjoiYm9vayIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6ImJvb2siLCJzZXNzaW9uSW5kZXgiOjI0fSx7ImtleSI6Imd0YWJsZTIiLCJ2YWx1ZSI6InJlYWRlciIsImVuYWJsZWQiOnRydWUsInNlc3Npb25WYWx1ZSI6InJlYWRlciIsInNlc3Npb25JbmRleCI6MjV9XQ==)

## Extra Resources

- Developing with [GraphQL](https://docs.datastax.com/en/astra-serverless/docs/develop/graphql.html)
- Introduction to [GraphQL Workshop](https://github.com/datastaxdevs/workshop-intro-to-graphql)
