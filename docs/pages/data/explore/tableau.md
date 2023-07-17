---
title: "Tableau"
description: "Tableau is a visual analytics platform for modern business intelligence. Tableau can be used to retrieve, explore, analyze and visualize data stored in Astra DB."
tags: "SQL, visual querying, data visualization, analytics, business intelligence"
icon: "https://awesome-astra.github.io/docs/img/tableau/tableau.svg"
developer_title: "Tableau"
developer_url: "https://www.tableau.com"
links:
- title: "Tableau"
  url: "https://www.tableau.com"
- title: "Simba JDBC Driver for Apache Cassandra"
  url: "https://downloads.datastax.com/#odbc-jdbc-drivers"
---

<img src="https://awesome-astra.github.io/docs/img/tableau/logo-tableau.svg" height="100px" />

## Overview

[Tableau](https://www.tableau.com) is a visual analytics platform for modern business intelligence. Tableau can be used to retrieve, explore, analyze and visualize data stored in Astra DB. The Tableau Platform features several products, inculding:

- _Tableau Desktop_,
- _Tableau Prep_,
- _Tableau Cloud_.

In this tutorial, we show **how to use Tableau Desktop to connect and query data in [Astra DB](http://astra.datastax.com)**.
We use [Simba JDBC Driver for Apache Cassandra®](https://downloads.datastax.com/#odbc-jdbc-drivers) to connect _Tableau Desktop_ and _Astra DB_ .

## Prerequisites

- [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- [Create an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)
- [Download Secure Connect Bundle](https://awesome-astra.github.io/docs/pages/astra/download-scb/)

## Setup Astra DB

**<span class="nosurface" markdown="1">✅ </span>1. [Sign in](https://astra.datastax.com/)**

Connect to your Astra account and [create a new Astra database](https://awesome-astra.github.io/docs/pages/astra/create-instance/) or select an existing one. Add a new keyspace with name `banking_db` or use an existing one.

**<span class="nosurface" markdown="1">✅ </span>2. Create the following tables using the CQL Console**

```sql
USE banking_db;
```

```sql
CREATE TABLE customer (
    id UUID,
    name TEXT,
    email TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE accounts_by_customer (
  customer_id UUID,
  account_number TEXT,
  account_type TEXT,
  account_balance DECIMAL,
  customer_name TEXT STATIC,
  PRIMARY KEY ((customer_id), account_number)
);
```

**<span class="nosurface" markdown="1">✅ </span>3. Insert the rows using the CQL Console**

```sql
INSERT INTO customer (id,name,email) VALUES (8d6c1271-16b6-479d-8ea9-546c37381ab3,'Alice','alice@example.org');
INSERT INTO customer (id,name,email) VALUES (0e5d9e8c-2e3b-4576-8515-58b491cb859e,'Bob','bob@example.org');


INSERT INTO accounts_by_customer (customer_id,account_number,account_type,account_balance,customer_name)
VALUES (8d6c1271-16b6-479d-8ea9-546c37381ab3,'A-101','Checking',100.01,'Alice');
INSERT INTO accounts_by_customer (customer_id,account_number,account_type,account_balance,customer_name)
VALUES (8d6c1271-16b6-479d-8ea9-546c37381ab3,'A-102','Savings',200.02,'Alice');
INSERT INTO accounts_by_customer (customer_id,account_number,account_type,account_balance,customer_name)
VALUES (0e5d9e8c-2e3b-4576-8515-58b491cb859e,'B-101','Checking',300.03,'Bob');
INSERT INTO accounts_by_customer (customer_id,account_number,account_type,account_balance,customer_name)
VALUES (0e5d9e8c-2e3b-4576-8515-58b491cb859e,'B-102','Savings',400.04,'Bob');
```

## Setup Tableau Desktop

**<span class="nosurface" markdown="1">✅ </span>4. Install Tableau Desktop**

Use an existing deployment of _Tableau Desktop_ or follow [the instructions](https://www.tableau.com/products/desktop) to download, install and register a new instance of _Tableau Desktop_.

## Install JDBC Driver for Apache Cassandra

**<span class="nosurface" markdown="1">✅ </span>5. Download JDBC Driver**

  1. Download [Astra JDBC connector jar](https://github.com/DataStax-Examples/astra-jdbc-connector/releases/download/5.0/astra-jdbc-connector-5.0.jar)  from Github

  2. Move the resulting `.jar` file to:

    - `/Users/[user]/Library/Tableau/Drivers` on macOS
    - `C:\Program Files\Tableau\Drivers` on Windows

## Connect to Astra DB from Tableau Desktop

**<span class="nosurface" markdown="1">✅ </span>7. Restart Tableau Desktop**

Start or restart _Tableau Desktop_ for the JDBC Driver installation to take effect.

**<span class="nosurface" markdown="1">✅ </span>8. Setup a connection to Astra DB**


### Connect with the JDBC Driver

  - Select _Other Databases (JDBC)_ under _Connect_
  - Fill out the dialog box with the connection information:
    - **URL** = `jdbc:astra://<db>/<keyspace>?region=<region>`  
    Fields are as follows:

        - db (required) Your database identifier.  It can be a name (then it must be unique) or a database identifier (UUID)
        - keyspace (required) The keyspace you want to use.
        - region (optional) Only useful if the database lives in multiple regions

    - **Dialect** = `SQL92`
    - **Username** = `<Client ID>`, where a client id value is [generated with your application token](https://awesome-astra.github.io/docs/pages/astra/create-token/).
    - **Password** = `<Client Secret>`, where a client secret is [generated with your application token](https://awesome-astra.github.io/docs/pages/astra/create-token/). 

    - Click the _Sign In_ button to establish a connection.

**<span class="nosurface" markdown="1">✅ </span>9. Create a data source from the banking database**

- Select `cassandra` under **Database**.
- Select `banking_db` under **Schema**.
- Drag and drop tables `customer` and `accounts_by_customer` into the main area and establish the relationship between the tables.

<br/><img src="https://awesome-astra.github.io/docs/img/tableau/data-source.png" /><br/>


**<span class="nosurface" markdown="1">✅ </span>10. Create a new sheet with simple visualization**

Add up all account balances per customer and visualize the results: 

- Click _Sheet 1_ at the bottom left corner.
- Drag and drop _Name_ to _Columns_.
- Drag and drop _Account Balance_ to _Rows_.
- Customize coloring and formatting settings as needed. 

<br/><img src="https://awesome-astra.github.io/docs/img/tableau/tableau-visualization.png" /><br/>

