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

You can use the Simba driver for customers with a support contract, or the ING driver which is freely available.

### Simba Driver
!!! warning "Tips for `SecureConnectionBundlePath`"

    You need to be a registered customer to use those drivers. If not consider the [ING Driver](#ing-driver) alternative. 

Download the JDBC driver from the Datastax customer support website 

1. Authenticate to [Datastax Customer Portal](https://datastax.lightning.force.com/lightning/r/Knowledge__kav/ka06R000000BtSrQAK/view).
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it _(click the checkbox)._
5. Hit the blue **Download** button.
6. Once the download completes, **unzip** the downloaded file.

Extract the Simba JDBC Driver `.zip` archive and move the resulting `.jar` file to:

- `/Users/[user]/Library/Tableau/Drivers` on macOS
- `C:\Program Files\Tableau\Drivers` on Windows

### Ing Driver

Download [the JDBC driver shaded jar](https://github.com/DataStax-Examples/astra-jdbc-wrapper/releases/download/4.9.0/ing-jdbc-wrapper-shaded-4.9.0.jar)  from Github

## Connect to Astra DB from Tableau Desktop

**<span class="nosurface" markdown="1">✅ </span>7. Restart Tableau Desktop**

Start or restart _Tableau Desktop_ for the JDBC Driver installation to take effect.

**<span class="nosurface" markdown="1">✅ </span>8. Setup a connection to Astra DB**

**Simba driver:**

- Select _Other Databases (JDBC)_ under _Connect_
- Fill out the dialog box with the connection information:
    - **URL** = `jdbc:cassandra://;AuthMech=2;UID=token;PWD=<ApplicationToken>;SecureConnectionBundlePath=<SecureConnectBundle>;TunableConsistency=1`, where
        - _AuthMech_ specifies whether the driver connects to a Cassandra or Astra DB database, and whether the driver authenticates the connection. It should be set to `2` to connect to an Astra database, and authenticate the connection using a user name, password, and secure connection bundle.
        - _UID_ and _PWD_ specify user name and password credentials. They should be set to literal `token` and the actual application token value. See [how to generate an application token](https://awesome-astra.github.io/docs/pages/astra/create-token/) if you do not have one already.
        - _SecureConnectionBundlePath_ specifies the full path and name of the secure connection bundle associated with your Astra database. _On Windows, the path should still be written using forward-slashes and not escape spaces in any particular way, as in: `c:/Users/Joan Reed/my-bundle.zip`._ See [how to download a secure connect bundle for your database](https://awesome-astra.github.io/docs/pages/astra/download-scb/).
        - _TunableConsistency_ specifies the consistency level for requests to the database. The supported values are `0` for `ANY`, `1` for `ONE`, `2` for `TWO`, `3` for `THREE`, `4` for `QUORUM`, `5` for `ALL`, `6` for `LOCAL_QUORUM`, `7` for `EACH_QUORUM`, and `10` for `LOCAL_ONE`. Set it to `6` for this example.
    - **Dialect** = `SQL92`
    - **Username** = `<Client ID>`, where a client id value is [generated with your application token](https://awesome-astra.github.io/docs/pages/astra/create-token/).
    - **Password** = `<Client Secret>`, where a client secret is [generated with your application token](https://awesome-astra.github.io/docs/pages/astra/create-token/). 

- Click the _Sign In_ button to establish a connection.

<br/><img src="https://awesome-astra.github.io/docs/img/tableau/connection-dialog.png" /><br/>

**Ing driver:**

- Select _Other Databases (JDBC)_ under _Connect_
- Fill out the dialog box with the connection information:

```
jdbc:cassandra://dbaas/<KEYSPACE>}?
consistency=LOCAL_QUORUM&
user=token&
password=<AstraCS:... you token>&
secureconnectbundle=<path_to_your_bundle>
``` 

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

