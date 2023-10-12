---
title: "DBeaver"
description: "DBeaver is a universal database management tool which allows you to manipulate your data like a regular spreadsheet, create analytical reports based on records from different data storages, and more."
tags: "python, third party tools, machine learning, workflow, etl"
icon: "https://awesome-astra.github.io/docs/img/dbeaver/dbeaver.svg"
developer_title: "DBeaver"
developer_url: "https://dbeaver.com"
links:
- title: "Introduction to DBeaver"
  url: "https://dbeaver.com/docs/wiki/Application-Window-Overview"
- title: "DBeaver Download Link"
  url: "https://dbeaver.com/docs/wiki/Installation"
---

<div class="nosurface" markdown="1">
- _This article includes information that was originally written by **Erick Ramirez** on [DataStax Community](https://community.datastax.com/articles/12287/how-to-connect-to-astra-db-from-dbeaver.html)_

<img src="https://awesome-astra.github.io/docs/img/dbeaver/f3f5c080-808b-11ea-9713-2bea65875d95.png" height="180px" />
</div>

## Overview

DBeaver is a universal database management tool for everyone who needs to work with data in a professional way. With DBeaver you are able to manipulate with your data like in a regular spreadsheet, create analytical reports based on records from different data storages, export information in an appropriate format.

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to DBeaver](https://dbeaver.com/docs/wiki/Application-Window-Overview)
- 📥 [DBeaver Download Link](https://dbeaver.com/docs/wiki/Installation)
</div>

## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
</ul>

This article assumes you have installed DBeaver Community Edition on your laptop or PC. It was written for version 21.2.0 on MacOS but it should also work for the Windows version.

## Astra Community JDBC Drivers

### <span class="nosurface">1. </span>Download JDBC Driver

Download latest archive [astra-jdbc-driver-x.y.jar](https://github.com/DataStax-Examples/astra-jdbc-connector/releases/tag/5.1)  from Github Release page

### <span class="nosurface">2. </span>Configure the Connection

_The following screenshot are done with Dbeaver lite on MACOS_

Go the [DBeaver download page](https://dbeaver.io/download/) and download the version associated
with your laptop.

- Open DBeaver application

- In the menu go `Database > Driver manager`

- The Panel Click `new` without selecting anything

<img src="https://awesome-astra.github.io/docs/img/dbeaver/02.png" />

- (1) Choose the TAB `libraries` 
- (2) Select `Add File`, look for the jar we just downloaded.

<img src="https://awesome-astra.github.io/docs/img/dbeaver/03.png" />

- (1) Go back to the tab `Settings` and enter the following values:
- (2) Driver Name: `Astra JDBC Driver` and driver Type: `Generic`
- (3) Class Name: `com.datastax.astra.jdbc.AstraJdbcDriver`
- (4) Username is `token`
- (5) Save your modifications with `[OK]`

<img src="https://awesome-astra.github.io/docs/img/dbeaver/04.png" />

- You have new entry in the list of drivers called `Astra JDBC Driver`

<img src="https://awesome-astra.github.io/docs/img/dbeaver/05.png" />

### <span class="nosurface">3. </span>Create the DataSource

- In the menu now select `Database > New Database Collection`

<img src="https://awesome-astra.github.io/docs/img/dbeaver/06.png" />

- Pick the driver `Astra JDBC Driver` and click `Next`

<img src="https://awesome-astra.github.io/docs/img/dbeaver/07.png" />

- Populate the URL as follow: `jdbc:astra://<db>/<keyspace>?region=<region>`

- Populate your token value (it should start by `AstraCS:...`)

<img src="https://awesome-astra.github.io/docs/img/dbeaver/08.png" />

- Click on `Test Connection` and validate with `Finish`

<img src="https://awesome-astra.github.io/docs/img/dbeaver/09.png" />

### <span class="nosurface">4. </span>Use DataSource

- On the left panel you can now see your data

<img src="https://awesome-astra.github.io/docs/img/dbeaver/10.png" />

## Using JDBC Simba Drivers

### <span class="nosurface">1. </span>Download JDBC Driver

Download the JDBC driver from the DataStax website:

1. Go to https://downloads.datastax.com/#odbc-jdbc-drivers.
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it (click the checkbox).
5. Hit the blue **Download** button.
6. Once the download completes, unzip the downloaded file.

### <span class="nosurface">2. </span> Import Driver

1. Go to the **Driver Manager.**
2. Click the **New** button.
3. In the **Libraries** tab, click the **Add File** button.
4. Locate the directory where you unzipped the driver download and add the `CassandraJDBC42.jar` file.
5. Click the Find Class button which should identify the driver class as `com.simba.cassandra.jdbc42.Driver`.
6. In the **Settings** tab, set the following:

- Driver Name: `Astra DB`
- Driver Type: `Generic`
- Class Name: `com.simba.cassandra.jdbc42.Driver`
  <img src="https://awesome-astra.github.io/docs/img/dbeaver/2385-dbeaver-01-create-driver.png" height="350px" />

7. Click the **OK** button to save the driver

At this point, you should see **Astra DB** as one of the drivers on the list:

<img src="https://awesome-astra.github.io/docs/img/dbeaver/2373-dbeaver-02-driver-manager.png" height="350px" />
<br /><br />


### <span class="nosurface">3. </span> Create New Connection

Connect to your Astra DB in DBeaver:

1. Open the **New Database Connection** dialog box.
2. Select **Astra DB** from the list of drivers.
3. In the **Main** tab, set the **JDBC URL** to:
   `jdbc:cassandra://;AuthMech=2;TunableConsistency=6;SecureConnectionBundlePath=/path/to/secure-connect-dbeaver.zip`
   **Note** That you will need to specify the full path to _your_ secure bundle.
4. In the **Username** field, enter the string `token`
5. In the **Password** field, paste the value of the token you created in the **Prerequisites** section above. The token looks like `AstraCS:AbC...XYz:123...edf0`.
   <img src="https://awesome-astra.github.io/docs/img/dbeaver/2374-dbeaver-03-new-connection.png" height="350px" />

6. Click on the **Connection details** button
7. In **Connection name** field, give your DB connection a name:
<img src="https://awesome-astra.github.io/docs/img/dbeaver/2402-dbeaver-04-connection-details.png" height="350px" />
8. Click the **Finish** button
9. Click on the **Test Connection** button to confirm that the driver configuration is working:

<img src="https://awesome-astra.github.io/docs/img/dbeaver/2395-dbeaver-05-test-connection.png" height="200px" />
<br /><br />


### <span class="nosurface">4. </span> Final Test

Connect to your Astra DB. If the connection was successful, you should be able to explore the keyspaces and tables in your DB on the left-hand side of the UI.

Here's an example output:

<img src="https://awesome-astra.github.io/docs/img/dbeaver/2396-dbeaver-06-explore.png" height="350px" />
