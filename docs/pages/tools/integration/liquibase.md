---
title: "Liquibase"
description: "Liquibase is a database schema change management solution that enables you to revise and release database changes faster and safer from development to production."
tags: "jdbc, third party tools, devops"
icon: "https://awesome-astra.github.io/docs/img/liquibase/liquibase.svg"
developer_title: "Liquibase"
developer_url: "https://docs.liquibase.com/home.html"
links:
- title: "Liquibase Quick Install"
  url: "https://docs.liquibase.com/install/liquibase-windows.html"
---

<div class="nosurface" markdown="1">

<img src="../../../../img/liquibase/logo.png" height="100px" />
</div>

## Overview

The purpose of this document is to guide you through the process of creating a new Liquibase project with Cassandra. In this tutorial, you will generate an example project and follow the instructions to apply and learn concepts associated with creating new Liquibase projects with Cassandra on DataStax Astra. 

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to Liquibase](https://docs.liquibase.com/home.html)
- 📥 [Liquibase Quick Install](https://docs.liquibase.com/install/liquibase-windows.html)
</div>

## Prerequisites
### Liquibase Prerequisites
<ul class="prerequisites">
    <li>Install the <a href="https://www.liquibase.org/download">latest version</a> of Liquibase</li>
    <li>Ensure the Liquibase install directory path is set to a location in the PATH System variable</li>
    <li><a href="https://github.com/liquibase/liquibase-cassandra/releases/">Download</a> the liquibase-cassandra-<version>.jar latest release extension jar file and place this file in the `liquibase/lib` install directory</li>
</ul>

### Astra Prerequisites
<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li><a href="https://downloads.datastax.com/#odbc-jdbc-drivers">Download</a> the Simba JDBC Jar driver file for Apache Cassandra and place this file in the `liquibase/lib` install directory</li>
    <li>Clone this <a href="https://github.com/datastax/cql-proxy">repository</a> to use to set up CQL-Proxy which is a sidecar that enables unsupported CQL drivers to work with DataStax Astra</li>
    <li>You need your Astra Token and Astra Database ID to use CQL-Proxy</li>
    <li>Follow the steps in the repo to spin up CQL-Proxy using Terminal/Command Line. Once successfully running, you should see the following output:</li>

```
{"level":"info","ts":1651012815.176512,"caller":"proxy/proxy.go:222","msg":"proxy is listening","address":"[::]:9042"}
```
</ul>

## Installation and Setup
To create a Liquibase project with Cassandra on DataStax Astra on your machine, begin with the following steps:

1. Create a new project folder and name it LiquibaseProj.
2. In your LiquibaseProj folder, create a new text file and name it dbchangelog.sql.
3. Open the dbchangelog.sql file and update the changelog file with the following code snippet: 
`--liquibase formatted sql` 

4. In your LiquibaseProj folder, create a new text file and name it liquibase.properties.
5. Edit the liquibase.properties file to add the following properties:

```
changelog-file: dbchangelog.sql
url: jdbc:cassandra://localhost:9042/test;DefaultKeyspace=test;TunableConsistency=6
driver: com.simba.cassandra.jdbc42.Driver
defaultSchemaName: test
liquibase.hub.mode=off 
```
In `liquibase.properties` above, replace test with the name of your own keyspace.

 6. Add a _changeset_ to the _changelog_ – _changeset_ are uniquely identified by author and id attributes. Liquibase attempts to execute each changeset in a transaction that is committed at the end. In the `dbchangelog.sql` file, add a new changeset with a create table statement. We will create a new table **department** using a changeset as follows:

```
--liquibase formatted sql

--changeset bob:1
CREATE TABLE test.DEPARTMENT (id int PRIMARY KEY, NAME text, ACTIVE BOOLEAN);
```

7. Open the command prompt. Navigate to the LiquibaseProj directory.
Run the following command: liquibase update
8. From a SQL Client User Interface, check your database changes. You should see a new department table added to the database. For example:
`SELECT * FROM "keyspace"."department";`

| ID          | NAME        | ACTIVE |
| ----------- | ----------- |------- |
| NULL        | NULL        |  NULL  |

After your first update, your database will contain the table you added along with the DATABASECHANGELOG and DATABASECHANGELOGLOCK tables:

- [DATABASECHANGELOG](https://docs.liquibase.com/concepts/tracking-tables/databasechangelog-table.html) table. This table keeps a record of all the changesets that were deployed. When you deploy, the changesets in the changelog are compared with the DATABASECHANGELOG tracking table, and only the new changesets that were not found in the DATABASECHANGELOG will be deployed.
- [DATABASECHANGELOGLOCK](https://docs.liquibase.com/concepts/tracking-tables/databasechangeloglock-table.html) table. This table is used internally by Liquibase to manage access to the DATABASECHANGELOG table during deployment and ensure only one instance of Liquibase is updating the database at a time, whether that is creating, updating, or deleting changes.
