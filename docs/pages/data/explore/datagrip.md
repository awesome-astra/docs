<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="- This page is a copy of the [AstraDB doc page](https://docs.datastax.com/en/astra/docs/db-integration-datagrip.html)
"><b>📖 Astra Docs</b> - Reference documentation</a>
<li><a href="https://www.sestevez.com/astra-datagrip/">You can found another version on the Sebastian Estevez Blog post</a>
</ol>
</details>

<img src="https://raw.githubusercontent.com/datastaxdevs/awesome-astra/main/datagrip/logo-datagrip.png" height="100px" />

## A - Overview

DataGrip is a database management environment for developers. It is designed to query, create, and manage databases. Databases can work locally, on a server, or in the cloud. Supports MySQL, PostgreSQL, Microsoft SQL Server, Oracle, and more. If you have a JDBC driver, add it to DataGrip, connect to your DBMS, and start working.

## B - Prerequisites

> [Datagrip reference documentation](https://www.jetbrains.com/help/datagrip/quick-start-with-datagrip.html)

- [Create an Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- [Create an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)
- [Download your secure connect bundle ZIP](https://github.com/datastaxdevs/awesome-astra/wiki/Download-the-secure-connect-bundle)
- [Download and install DataGrip](https://www.jetbrains.com/datagrip/download/)

## C - Installation and Setup

**✅ Step 1: Download JDBC Driver**

Download the JDBC driver from the DataStax website:

1. Go to https://downloads.datastax.com/#odbc-jdbc-drivers.
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it _(click the checkbox)._
5. Hit the blue **Download** button.
6. Once the download completes, **unzip** the downloaded file.

<img src="https://raw.githubusercontent.com/datastaxdevs/awesome-astra/main/pentaho-data-integration/img/download-drivers.png" />

**✅ Step 2: Download `Settings.zip`**

- Download the [settings.zip](https://datastax-21b7c7df5342.intercom-attachments-7.com/i/o/232268459/929cbfa881f4423cceb8b3b2/settings.zip) locally

> ⚠️ If you are already a DataGrip user, back up your existing settings because the download settings.zip might override your existing settings.

**✅ Step 3: Import the settings.zip into DataGrip**

- Selecting `File` → `Manage IDE Settings` → `Import Settings` in DataGrip.

- From the directory menu, select the `settings.zip file from the directory where it is stored.

- Select **Import and Restart**.

You will see a new database connection type called Astra: Simba Cassandra JDBC 4.2 driver shown.

<img src="/img/datagrip/pic1.png" />

- Go to the Advanced Settings to confirm the VM home path is set to Default. VM home path is set to a value named Default.

<img src="/img/datagrip/pic2.png" />

**✅ Step 4: Establish the connection**

When you create your connection, the URL will look like this: `jdbc:cassandra://;AuthMech=<2>;UID=token;PWD=<ApplicationToken>;SecureConnectionBundlePath=<PATH TO YOUR SECURE CONNECT BUNDLE>;TunableConsistency=<6>`

<img src="v/img/datagrip/pic3.png" />

URL in the screenshot shows the format described in the previous sentence.

- **AuthMech:** Specifies whether the driver connects to a Cassandra or Astra DB database and whether the driver authenticates the connection.

- **ApplicationToken:** Generated from Astra DB console.

- **SecureConnectionBundlePath:** Path to where your downloaded Secure Connect Bundle is located.

- **TunableConsistency:** Specifies Cassandra replica or the number of Cassandra replicas that must process a query for the query to be considered successful.
