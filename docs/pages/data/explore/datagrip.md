---
title: "DataGrip"
description: "DataGrip is a database management environment for developers. It is designed to query, create, and manage databases. Databases can work locally, on a server, or in the cloud. Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, and more. If you have a JDBC driver, add it to DataGrip, connect to your DBMS, and start working."
tags: "jdbc, data management, ide"
icon: "https://awesome-astra.github.io/docs/img/datagrip/logo-datagrip.png"
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

<img src="https://awesome-astra.github.io/docs/img/datagrip/logo-datagrip.png" height="100px" />

</div>

## A - Overview

<div class="nosurface" markdown="1">

- ℹ️ [**Astra Docs** - Reference documentation](https://docs.datastax.com/en/astra/docs/db-integration-datagrip.html)
- ℹ️ [Instructions on **Sebastian Estevez's blog post**](https://www.sestevez.com/astra-datagrip/)
- ℹ️ [Datagrip reference documentation](https://www.jetbrains.com/help/datagrip/quick-start-with-datagrip.html)

</div>

DataGrip is a database management environment for developers. It is designed to query, create, and manage databases. Databases can work locally, on a server, or in the cloud. Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, and more. If you have a JDBC driver, add it to DataGrip, connect to your DBMS, and start working.

## B - Prerequisites

- [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- [Create an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)
- [Download your secure connect bundle ZIP](https://awesome-astra.github.io/docs/pages/astra/download-scb/)
- [Download and install DataGrip](https://www.jetbrains.com/datagrip/download/)

## C - Installation and Setup

#### Step 1: Download JDBC Driver

Download the JDBC driver from the DataStax website:

1. Go to [downloads.datastax.com/#odbc-jdbc-drivers](https://downloads.datastax.com/#odbc-jdbc-drivers).
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it _(click the checkbox)._
5. Hit the blue **Download** button.
6. Once the download completes, **unzip** the downloaded file.

<img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/download-drivers.png" />

#### Step 2: Download `Settings.zip`

- Download the [settings.zip](https://datastax-21b7c7df5342.intercom-attachments-7.com/i/o/232268459/929cbfa881f4423cceb8b3b2/settings.zip) locally

> If you are already a DataGrip user, back up your existing settings because downloading `settings.zip` might override your existing settings.

#### Step 3: Import the settings.zip into DataGrip

- Selecting `File` → `Manage IDE Settings` → `Import Settings` in DataGrip.

- From the directory menu, select the `settings.zip` file from the directory where it is stored.

- Select **Import and Restart**.

You will see a new database connection type called Astra: _Simba Cassandra JDBC 4.2 driver_ shown.

<img src="https://awesome-astra.github.io/docs/img/datagrip/pic1.png" />

- Go to the Advanced Settings to confirm the VM home path is set to Default. VM home path is set to a value named Default.

<img src="https://awesome-astra.github.io/docs/img/datagrip/pic2.png" />

#### Step 4: Establish the connection

When you create your connection, the URL will look like this: `jdbc:cassandra://;AuthMech=<2>;UID=token;PWD=<ApplicationToken>;SecureConnectionBundlePath=<PATH TO YOUR SECURE CONNECT BUNDLE>;TunableConsistency=<6>`

<img src="https://awesome-astra.github.io/docs/img/datagrip/pic3.png" />

URL in the screenshot shows the format described in the previous sentence.

- **AuthMech:** Specifies whether the driver connects to a Cassandra or Astra DB database and whether the driver authenticates the connection.
- **ApplicationToken:** Generated from Astra DB console.
- **SecureConnectionBundlePath:** Path to where your downloaded Secure Connect Bundle is located.
- **TunableConsistency:** Specifies Cassandra replica or the number of Cassandra replicas that must process a query for the query to be considered successful.
