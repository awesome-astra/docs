---
title: "Apache Spark"
description: "Apache Spark is an open-source, distributed processing system used for big data workloads. It utilizes in-memory caching, and optimized query execution for fast analytic queries against data of any size."
tags: "java, third party tools, machine learning, middleware"
icon: "https://awesome-astra.github.io/docs/img/apache-spark/Apache_Spark_logo.png"
developer_title: "Apache"
developer_url: "https://spark.apache.org"
links:
- title: "Introduction to Apache Spark"
  url: "https://aws.amazon.com/big-data/what-is-spark"
  - title: "Apache Spark Download"
  url: "https://spark.apache.org/downloads.html"
---

<div class="nosurface" markdown="1">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/) | *Last Update {{ git_revision_date }}* 

- _This article includes information that was originally written by **Arpan Patel** on [Anant Github](https://github.com/Anant/example-Apache-Spark-and-DataStax-Astra/blob/main/Connect/README.md) and Astra DataStax_

<img src="../../../../img/apache-spark/Apache_Spark_logo.png" height="100px" />
</div>

## A - Overview

Apache Spark is an open-source, distributed processing system used for big data workloads. It utilizes in-memory caching, and optimized query execution for fast analytic queries against data of any size. Use Apache Spark to connect to your database and begin accessing your Astra DB tables using Scala in spark-shell.

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to Apache Spark](https://aws.amazon.com/big-data/what-is-spark/)
- 📥 [Apache Spark Download Link](https://spark.apache.org/downloads.html)
</div>

## B - Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a> and unpack it.</li>
    <li>Download and install the latest version of <a href="https://mvnrepository.com/artifact/com.datastax.spark/spark-cassandra-connector">Spark Cassandra Connector</a> that matches with your Apache Spark and Scala version from the maven central repository. To find the right version of SCC, please check SCC compatibility <a href="https://github.com/datastax/spark-cassandra-connector#version-compatibility">here.</a></li>
</ul>

## C - Installation and Setup

These steps assume you will be using Apache Spark in local mode. For help using Spark cluster mode click the chat button on the bottom of the screen.

### <span class="nosurface">✅ </span>Steps:

1. Expand the downloaded Apache Spark package into a directory, and assign the directory name to `$SPARK_HOME`.

2. Navigate to this directory using `cd $SPARK_HOME`

3. Append the following lines at the end of a file called `$SPARK_HOME/conf/spark-defaults.conf` (you may be able to find a template under $SPARK_HOME/conf directory), and replace the second column (value) with the first four lines:

```ini
spark.files $SECURE_CONNECT_BUNDLE_FILE_PATH/secure-connect-astraiscool.zip
spark.cassandra.connection.config.cloud.path secure-connect-astraiscool.zip
spark.cassandra.auth.username <<CLIENT ID>>
spark.cassandra.auth.password <<CLIENT SECRET>>
spark.dse.continuousPagingEnabled false
```

4. Launch spark-shell and enter the following scala commands:

```scala
import com.datastax.spark.connector._
import org.apache.spark.sql.cassandra._
spark.read.cassandraFormat("tables", "system_schema").load().count()
```

**You should expect to see the following output:**

```bash
$ bin/spark-shell
Using Spark's default log4j profile: org/apache/spark/log4j-defaults.properties
Setting default log level to "WARN".
To adjust logging level use sc.setLogLevel(newLevel). For SparkR, use setLogLevel(newLevel).
Spark context Web UI available at http://localhost:4040
Spark context available as 'sc' (master = local[*], app id = local-1608781805157).
Spark session available as 'spark'.
Welcome to
      ____              __
     / __/__  ___ _____/ /__
    _\ \/ _ \/ _ `/ __/  '_/
   /___/ .__/\_,_/_/ /_/\_\   version 3.0.1
      /_/

Using Scala version 2.12.10 (OpenJDK 64-Bit Server VM, Java 11.0.9.1)
Type in expressions to have them evaluated.
Type :help for more information.

scala> import com.datastax.spark.connector._
import com.datastax.spark.connector._

scala> import org.apache.spark.sql.cassandra._
import org.apache.spark.sql.cassandra._

scala> spark.read.cassandraFormat("tables", "system_schema").load().count()
res0: Long = 25

scala> :quit
```

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>
