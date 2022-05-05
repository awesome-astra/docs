_Last Update {{ git_revision_date }}_

## Overview

The purpose of this document is to guide you through the process of creating a new Liquibase project with Cassandra. In this tutorial, you will generate an example project and follow the instructions to apply and learn concepts associated with creating new Liquibase projects with Cassandra on DataStax Astra.

- ℹ️ [Introduction to Liquibase](https://docs.liquibase.com/home.html)
- 📥 [Liquibase Quick Install](https://docs.liquibase.com/install/liquibase-windows.html)

## Prerequisites
### Liquibase Prerequisites
- Install the [latest version](https://www.liquibase.org/download) of Liquibase 
- Ensure the Liquibase install directory path is set to a location in the PATH System variable
- [Download](https://github.com/liquibase/liquibase-cassandra/releases/) the liquibase-cassandra-<version>.jar latest release extension jar file and place this file in the `liquibase/lib` install directory 

### Astra Prerequisites
- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create an Astra Database](/pages/astra/create-instance/)
- You should have an [Astra Token](/pages/astra/create-token/)
- [Download](https://downloads.datastax.com/#odbc-jdbc-drivers) the Simba JDBC Jar driver file for Apache Cassandra and place this file in the `liquibase/lib` install directory 
- Clone this [repository](https://github.com/datastax/cql-proxy) to use to set up CQL-Proxy which is a sidecar that enables unsupported CQL drivers to work with DataStax Astra
    - You need your Astra Token and Astra Database ID to use CQL-Proxy
    - Follow the steps in the repo to spin up CQL-Proxy using Terminal/Command Line. Once successfully running, you should see the following output:

```
{"level":"info","ts":1651012815.176512,"caller":"proxy/proxy.go:222","msg":"proxy is listening","address":"[::]:9042"}
```

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
