[🏠 Back to HOME](https://awesome-astra.github.io/docs/) | *Last Update {{ git_revision_date }}* 

- _This article includes information that was originally written by **Arpan Patel** on [Anant Github](https://github.com/Anant/example-Apache-Spark-and-DataStax-Astra/blob/main/Connect/README.md) and Astra DataStax_

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/apache-spark/img/Apache_Spark_logo.png" height="180px" />

## A - Overview

Apache Spark is an open-source, distributed processing system used for big data workloads. It utilizes in-memory caching, and optimized query execution for fast analytic queries against data of any size. Use Apache Spark to connect to your database and begin accessing your Astra DB tables using Scala in spark-shell.

- ℹ️ [Introduction to Apache Spark](https://aws.amazon.com/big-data/what-is-spark/)
- 📥 [Apache Spark Download Link](https://spark.apache.org/downloads.html)

## B - Prerequisites

- [Create an Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- [Create an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token) (RO User is needed for this example)
- [Download your secure connect bundle ZIP](https://github.com/datastaxdevs/awesome-astra/wiki/Download-the-secure-connect-bundle)
- Download and install the latest version of [Spark Cassandra Connector](https://mvnrepository.com/artifact/com.datastax.spark/spark-cassandra-connector) that matches with your Apache Spark and Scala version from the maven central repository. To find the right version of SCC, please check SCC compatibility [here.](https://github.com/datastax/spark-cassandra-connector#version-compatibility)

## C - Installation and Setup

These steps assume you will be using Apache Spark in local mode. For help using Spark cluster mode click the chat button on the bottom of the screen.

### ✅ Steps:

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

[🏠 Back to HOME](https://github.com/datastaxdevs/awesome-astra/wiki)
