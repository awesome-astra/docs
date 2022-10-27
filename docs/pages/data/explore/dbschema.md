---
title: "DbSchema"
description: "DbSchema is a universal database designer for out-of-the-box schema management and documentation, sharing the schema in the team, and deploying on different databases. Visual tools can help developers, database administrators, and decision-makers to query, explore and manage the data."
tags: "jdbc, data management, ide"
icon: "https://awesome-astra.github.io/docs/img/dbschema/download.png"
developer_title: "DbSchema"
developer_url: "https://dbschema.com/"
links:
- title: "DbSchema Docs"
  url: "https://dbschema.com/documentation/"
- title: "DbSchema Tutorials"
  url: "https://dbschema.com/tutorials.html"
---

<div class="nosurface" markdown="1">

<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="https://docs.datastax.com/en/astra/docs/db-integration-dbschema.html"><b>📖 Astra Docs</b> - Reference documentation</a>
<li><a href="https://dbschema.com/tutorials.html">DBSchema Tutorials</a>
</ol>
</details>

<img src="https://awesome-astra.github.io/docs/img/dbschema/download.png" />
</div>

## Overview

DbSchema is a universal database designer for out-of-the-box schema management and documentation, sharing the schema in the team, and deploying on different databases. Visual tools can help developers, database administrators, and decision-makers to query, explore and manage the data.

- <span class="nosurface">ℹ️ </span>[Introduction to DBSchema](https://dbschema.com/features.html)
- <span class="nosurface">📥 </span>[DBSchema Installation](https://dbschema.com/download.html)

DBSchema uses the [Simba JDBC driver](https://downloads.datastax.com/#odbc-jdbc-drivers) to connect to Cassandra as the storage backend. The Java driver itself supports connections to Astra DB natively.

## Prerequisites
<ul class="prerequisites">
  <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure bundle</a></li>
</ul>

This article assumes you have installed the latest version of DBSchema on your laptop or PC.

## Installation and Setup

### <span class="nosurface">✅ Step 1: </span> JDBC Driver

Download the JDBC driver from the DataStax website:

1. Go to https://downloads.datastax.com/#odbc-jdbc-drivers.
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it (click the checkbox).
5. Hit the blue **Download** button.
6. Once the download completes, unzip the downloaded file.

### <span class="nosurface">✅ Step 2: </span> Establish the Connection

1. Open [DB Schema](https://dbschema.com/)
2. Select **Connect to the Database**
3. Select **Start**
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-start.png"/>

4. In the **Choose your database** menu, select Cassandra.

5. Select **Next.**
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-cass-sel.png" />

6. Select **JDBC Driver** edit option.
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-connection-d.png" />

7. In the JDBC Driver Manager, select **New**.
8. In the Add RDBMS window, enter **Astra** and select **OK**
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-driver-manager.png" />

9. Select **OK** in the confirmation message.
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-connection.png" />

10. Upload the Simba JDBC Driver.
11. Select **Open**
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-simba-driver.png" />

12. Once you upload the Simba JDBC Driver, you will see **Astra** in the **Choose your Database** window. Select **Next**.
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-astra.png" height="500px" />

13. In the Astra Connection Dialog, add JDBC URL as
    ```bash
    jdbc:cassandra://;AuthMech=<2>;UID=token;PWD=<ApplicationToken>;SecureConnectionBundlePath=<PATH TO YOUR SECURE CONNECT BUNDLE>;TunableConsistency=<6>
    ```
    with the following variables:

    - **AuthMech:** Specifies whether the driver connects to a Cassandra or Astra DB database and whether the driver authenticates the connection.
    - **ApplicationToken:** Generated from Astra DB console. See [Manage application tokens.](https://docs.datastax.com/en/astra/docs/manage-application-tokens.html)
    - **SecureConnectionBundlePath:** Path to where your downloaded Secure Connect Bundle is located. See [Get secure connect bundle.](https://docs.datastax.com/en/astra/docs/obtaining-database-credentials.html)
    - **TunableConsistency:** Specifies Cassandra replica or the number of Cassandra replicas that must process a query for the query to be considered successful.

14. Select **Connect**
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-url.png" height="500px" />

15. In the **Select Schemas/Catalogs**, select the keyspace to which you want to connect.
16. Select **OK.**
<img src="https://awesome-astra.github.io/docs/img/dbschema/dbschema-connetion-established.png" height="500px" />

### <span class="nosurface">✅ Step 3: </span> Final Test

Now that your connection is working, you can create tables, introspect your keyspaces, view your data in the DBSchema GUI, and more.

To learn more about DBSchema, see [Quick start with DBSchema](https://dbschema.com/tutorials.html)

<div class="nosurface" markdown="1">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/) 
</div>