---
title: "DataStation"
description: "DataStation is an open-source data IDE which allows you to easily build graphs and tables with data pulled from SQL databases, logging databases, metrics databases, HTTP servers, and more."
tags: "ide plugins"
icon: "https://awesome-astra.github.io/docs/img/datastation/datastation_logo.png"
developer_title: "DataStation"
developer_url: "https://datastation.multiprocess.io"
links:
  - title: "DataStation Quick Install"
  url: "https://datastation.multiprocess.io/docs"
---

<div class="nosurface" markdown="1">
_Last Update {{ git_revision_date }}_

<img src="../../../../img/datastation/datastation_logo.png" height="60px" />
</div>

## Overview

DataStation is an open-source data IDE for developers. It allows you to easily build graphs and tables with data pulled from SQL databases, logging databases, metrics databases, HTTP servers, and all kinds of text and binary files. Need to join or munge data? Write embedded scripts as needed in languages like Python, JavaScript, R or SQL. All in one application. This tutorial will show you step-by-step how to connect your Astra DB with DataStation. 

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to DataStation](https://datastation.multiprocess.io/)
- 📥 [DataStation Quick Install](https://datastation.multiprocess.io/docs/)
</div>

## Prerequisites
<ul class="prerequisites">
    <li>You should <a href="https://datastation.multiprocess.io/docs">Install DataStation</a></li>
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li>Clone this <a href="https://github.com/datastax/cql-proxy">repository</a> to use to set up CQL-Proxy which is a sidecar that enables unsupported CQL drivers to work with DataStax Astra</li>
    <li>You need your Astra Token and Astra Database ID to use CQL-Proxy</li>
    <li>Follow the steps in the repo to spin up CQL-Proxy using Terminal/Command Line. Once successfully running, you should see the following output:</li>

```
{"level":"info","ts":1651012815.176512,"caller":"proxy/proxy.go:222","msg":"proxy is listening","address":"[::]:9042"}
```
</ul>

## C - Installation and Setup
Once you have completed all of the **Prerequisites** and confirmed CQL Proxy is running, you are now able to move on to setting up your Astra DB with DataStation IDE. 

1. First, launch your DataStation IDE. 
<img src="../../../../img/datastation/1_starting_page.png"/>

2. Click *Add Data Source* and select **Cassandra**

3. A dialog will appear that will prompt you to name this connection (in this example I used *Test*) and your Cassandra credentials:
    - **Host** - Use `localhost:9042` or `127.0.0.1:9042`
    - **Keyspace** - Enter the name of the keyspace that you want to use from your Astra DB. 
    - **Username** - Use `token`
    - **Password** - From your *Astra Token* creation in the Prerequisites, find your Token. 
        - Ex. `AstraCS:BWsdjhdf...` 
        
        <img src="../../../../img/datastation/3_enter_credentials.png" width="300"/>

4. Once you've entered your credentials, click *Add Panel* and select *Database* under **IMPORT FROM**. This will allow DataStation to connect with the database you are trying to view through the credentials you had just entered in the previous step. 
???+ tip "Note"

    DataStation IDE currently doesn't show a success message after the credentials have been entered. The Password field will also show up blank once you've minimized the credentials panel on the sidebar, but this does not necessarily mean you have to re-enter your password.
5. You will know your database has been added once your display looks like this. You can name this Panel what you'd like. In this example, it is titled *Test Panel*. 
    <img src="../../../../img/datastation/5_ready_to_run.png" />
6. To test and validate, you can run a quick query to one of the tables that are present in the Keyspace that you provided in Step 3. 
    <img src="../../../../img/datastation/6_run_query.png" />

...and you're done! This tutorial quickly shows you how you can easily integrate your Astra DB with the DataStation IDE to run queries, build tables, and further enhance how you interact with your data. 

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>