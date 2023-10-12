---
title: "DataGrip"
description: "DataGrip is a database management environment for developers. It is designed to query, create, and manage databases. Databases can work locally, on a server, or in the cloud. Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, and more. If you have a JDBC driver, add it to DataGrip, connect to your DBMS, and start working."
tags: "jdbc, data management, ide"
icon: "https://awesome-astra.github.io/docs/img/datagrip/DataGrip.svg"
developer_title: "JetBrains"
developer_url: "https://www.jetbrains.com/datagrip/"
links:
- title: "Astra Docs - Reference documentation"
  url: "https://docs.datastax.com/en/astra/docs/db-integration-datagrip.html"
- title: "Instructions on Sebastian Estevez's blog post"
  url: "https://www.sestevez.com/astra-datagrip/"
- title: "Datagrip reference documentation"
  url: "https://www.jetbrains.com/help/datagrip/quick-start-with-datagrip.html"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/datagrip/logo-datagrip.png" style="height: 180px;" />

</div>

## Overview

<div class="nosurface" markdown="1">

- ℹ️ [**Astra Docs** - Reference documentation](https://docs.datastax.com/en/astra/docs/db-integration-datagrip.html)
- ℹ️ [Instructions on **Sebastian Estevez's blog post**](https://www.sestevez.com/astra-datagrip/)
- ℹ️ [Datagrip reference documentation](https://www.jetbrains.com/help/datagrip/quick-start-with-datagrip.html)

</div>

DataGrip is a database management environment for developers. It is designed to query, create, and manage databases. Databases can work locally, on a server, or in the cloud. Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, and more. If you have a JDBC driver, add it to DataGrip, connect to your DBMS, and start working.

## Prerequisites

- [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- [Create an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)
- [Download your secure connect bundle ZIP](https://awesome-astra.github.io/docs/pages/astra/download-scb/)
- [Download and install DataGrip](https://www.jetbrains.com/datagrip/download/)

## Astra Community JDBC Drivers

### <span class="nosurface">1. </span>Download JDBC Driver

Download latest archive [astra-jdbc-driver-x.y.jar](https://github.com/DataStax-Examples/astra-jdbc-connector/releases/tag/5.1)  from Github Release page

### <span class="nosurface">2. </span>Configure the Connection

1. Select `Drivers` Tab 
2. Click the plus `+` symbol to create a new _User Driver_
3. Populate the name as you like, in the screenshot we picked `Astra JDBC Driver`
4. Add the shaded jar by clicking the plus `+` symbol in the `Driver Files` panel.
5. For the `Class` field, select the following (the list has been build by scanner the library we just imported)

```java
com.datastax.astra.jdbc.AstraJdbcDriver
```

<img src="https://awesome-astra.github.io/docs/img/datagrip/pic4.png" />

### <span class="nosurface">3. </span>Create the DataSource

- **1.** Select `Data Source` tabs.Using the `+` add a new Data source pick the driver we just created from the list
- **2.** Define a name for your datasource on the screenshot we picked `Astra JDBC DataSource`
- **3.** Validate that you are using the driver define above, for us `Astra JDBC Driver` 
- **4.** Provide User Name. It can be the string `token` or the value of a `clientId`.
- **5.** Provide the password. It can be the value for your _starting with AstraCS:..._  or the value of a `clientSecret`.
- **6.** Provide the URL as a single line

```
jdbc:astra://<db>/<keyspace>?region=<region>
```

| Field | Required? | Description |
|:---- | :--- | :--- |
| db   | YES | It is your database identifier it can be a name (then it must be unique) or a database identifier (UUID) |
| keyspace | YES  | It is the keyspace you want to use. |
| region | NO | Only useful if the database lives on multiple regions | 

<img src="https://awesome-astra.github.io/docs/img/datagrip/ds1.png" />

- **7.** Test the connection you should get the following screen, apply and save.

- **8.** Validate with `Apply`

### <span class="nosurface">4. </span>Use DataSource

1. Select the keyspace you want to use

<img src="https://awesome-astra.github.io/docs/img/datagrip/ds4.png" />

2. Enjoy your working environment

<img src="https://awesome-astra.github.io/docs/img/datagrip/ds5.png" />

## Using JDBC Simba Drivers

!!! warning "Tips for `SecureConnectionBundlePath`"

    You need to be a registered customer to use those drivers. If not consider the [ING Driver](#using-ing-drivers) alternative. 

### <span class="nosurface">1. </span>Download JDBC Driver

Download the JDBC driver from the Datastax customer support website 

1. Authenticate to [Datastax Customer Portal](https://datastax.lightning.force.com/lightning/r/Knowledge__kav/ka06R000000BtSrQAK/view).
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it _(click the checkbox)._
5. Hit the blue **Download** button.
6. Once the download completes, **unzip** the downloaded file.

### <span class="nosurface">2. </span> Download `Settings.zip`

- Download the [settings.zip](https://datastax-21b7c7df5342.intercom-attachments-7.com/i/o/232268459/929cbfa881f4423cceb8b3b2/settings.zip) locally

!!! warning "Think about backing up your `settings.xml`"
    
    If you are already a DataGrip user, back up your existing settings because downloading `settings.zip` might override your existing settings.

### <span class="nosurface">3. </span> Import settings.zip file

- Selecting `File` → `Manage IDE Settings` → `Import Settings` in DataGrip.

- From the directory menu, select the `settings.zip` file from the directory where it is stored.

- Select **Import and Restart**.

You will see a new database connection type called Astra: _Simba Cassandra JDBC 4.2 driver_ shown.

<img src="https://awesome-astra.github.io/docs/img/datagrip/pic1.png" />

- Go to the Driver `Advanced Settings` TAB to confirm the VM home path is set to `Default`.

<img src="https://awesome-astra.github.io/docs/img/datagrip/pic2.png" />

### <span class="nosurface">4. </span> Establish the connection

- The credentials are provided in the URL so for authentication field you can pick `No auth` in the select drop down.

- When you create your connection, the URL will look like this (on a single line): 

```
jdbc:cassandra://;AuthMech=2;
UID=token;
PWD=<AstraCS:... your application token>;
SecureConnectionBundlePath=<PATH TO YOUR SECURE CONNECT BUNDLE>;
TunableConsistency=6
```

!!! info "Tips for `SecureConnectionBundlePath`"

    - You should use `/` as a path separator even on Windows.

    - The use of quotes for the path is not supported, please try to provide a path with no spaces.


<img src="https://awesome-astra.github.io/docs/img/datagrip/pic3.png" />

URL in the screenshot shows the format described in the previous sentence.

- **AuthMech:** Specifies whether the driver connects to a Cassandra or Astra DB database and whether the driver authenticates the connection.
- **ApplicationToken:** Generated from Astra DB console.
- **SecureConnectionBundlePath:** Path to where your downloaded Secure Connect Bundle is located.
- **TunableConsistency:** Specifies Cassandra replica or the number of Cassandra replicas that must process a query for the query to be considered successful.

