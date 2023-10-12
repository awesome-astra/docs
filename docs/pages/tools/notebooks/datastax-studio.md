---
title: "DataStax Studio"
description: "Designed to facilitate Cassandra Query Language (CQL), Graph/Gremlin, and Spark SQL language development, DataStax Studio has all the tools needed for ad hoc queries, visualizing and exploring data sets, profiling performance and comes with a notebook interface that fuels collaboration."
tags: "notebook"
icon: "https://awesome-astra.github.io/docs/img/datastax-negative-square.png"
developer_title: "DataStax"
developer_url: "https://www.datastax.com/dev/datastax-studio"
links:
- title: "DataStax Studio Install"
  url: "https://www.datastax.com/dev/datastax-studio"
---

## Overview 
DataStax Studio is an interactive developer tool for CQL (Cassandra Query Language), Spark SQL, and DSE Graph. Developers and analysts collaborate by mixing code, documentation, query results, and visualizations in self-documenting notebooks.
<div class="nosurface" markdown="1">
- ℹ️ [Introduction to DataStax Studio](https://docs.datastax.com/en/studio/docs/aboutStudio.html)
- 📥 [DataStax Studio Quick Install](https://docs.datastax.com/en/installing/docs/installStudio.html)
</div>

## Prerequisites
#### DataStax Studio Prerequisites
<ul class="prerequisites">
  <li class="nosurface">You should have a <a href="https://docs.datastax.com/en/home/docs/supportedPlatforms.html#supportedPlatforms__browser-support">supported browser</a></li>
  <li class="nosurface">You should have a supported version of Java</li>
    <ul>
    <li class="nosurface">Recommended: <a href="https://openjdk.org/">OpenJDK 8</a></li>
    <li class="nosurface">Supported: <a href="https://www.oracle.com/java/technologies/downloads/">Oracle Java SE 8 (JRE or JDK)</a></li>
    </ul></li>
</ul>

#### Astra Prerequisites
<ul class="prerequisites">
  <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
</ul>

## Installation and Setup
As mentioned in the **Prerequisites** above, you must have DataStax Studio already installed. You can follow the quick installation steps [here](https://docs.datastax.com/en/installing/docs/installStudio.html). Once you have successfully installed DataStax Studio, you may proceed to the following steps. 

1. Start up DataStax Studio by running the Studio Server shell script:
    - Linux: 
    ```bash
    cd installation_location/datastax-studio-6.8.0
    ./bin/server.sh
    ```
    - Windows:
    ```bash
    C:/> cd installation_location\datastax-studio-6.8.0\bin\
    C:/> server.bat
    ```
    Once Studio is running, your output should look something similar to this:
    ```bash
    Studio is now running at: http://127.0.0.1:9091
    ```
2. You may now use the `localhost` URL provided in your terminal or command line to navigate to the DataStax Studio UI. This should look something like this:
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/01_getting_started.png"  />

3. For this example, we will use the **Getting Started with Astra** notebook. A notebook is essentially a workspace used to visualize queries from your database, test and run different commands, and more. 
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/02_astra_tile.png"  />

4. On the top right corner of the notebook, click `default localhost` and then `Add Connection` to configure a new connection for the notebook.
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/03_add_connection.png"  />

5. A screen should appear with the options `Standard Connection` and `Astra Connection`. For this example, you will select `Astra Connection`.
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/04_create_connection.png"  />

6. Here, you will need the credentials that you gathered in the **Astra Prerequisites**. 
    ```
    Name: <Your Database Name>
    Secure Connection Bundle path: <The path to your SCB locally>
    Client ID: <Your Client ID>
    Client Secret: <Your Client Secret>
    ```
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/05_connection_credentials.png"  />

7. Once you have filled this information out, you can select **Test** in the bottom right corner. If this is successful, you should see a message that says `CQL connected successfully`. Once this is completed, click **Save**. 

8. In the upper right hand corner, you should be able to switch the connection to the name of the database you just configured. 

## Test and Validate
Finally, we will test and validate once more that the connection is validated by submitting a couple test queries.

1. Click the **+** symbol in the top-middle of the screen to add a new cell. 
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/06_add_cell.png"  />

2. In the cell, you can select which **Keyspace** that you want to query from. 

3. Run the following queries to confirm that the connection to your Astra Database is successful. 

```
describe tables;
select * from <YOUR_TABLE>;
```
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/07_describe_tables.png"  />
<img src="https://awesome-astra.github.io/docs/img/datastaxstudio/08_select_statement.png"  />


Once you have received the correct results back, that's it! You have successfully connected DataStax Studio to Astra DB and can use this as a tool to help model your queries. You may also scroll down within the **Getting Started with Astra** notebook for more examples and recommendations. 

