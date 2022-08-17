_Last Update {{ git_revision_date }}_

<img src="../../../../img/Apache_Flink_logo.svg.png" height="30px" />

- _This article includes information that was originally written by **Bret McGuire** on [GitHub](https://github.com/absurdfarce/flink-astra)_ 

## Overview

Apache Flink is a framework and distributed processing engine for stateful computations over unbounded and bounded data streams. Flink has been designed to run in all common cluster environments, perform computations at in-memory speed and at any scale. This tutorial will show you step-by-step how to use Astra as a sink for results computed by Flink. These instructions are intended to demonstrate how to enable such support when using a Flink DataStream.

This code is intended as a fairly simple demonstration of how to enable an Apache Flink job to interact with DataStax Astra. There is certainly room for optimization here. A simple example: Flink's CassandraSink will open a new Session on each open() call even though these Session objects are thread-safe. A more robust implementation would be more aggressive about memoizing Sessions, encouraging a minimal number of open sessions for multiple operations on the same JVM. This work may be undertaken in the future, but for the moment it is beyond the scope of what we're aiming for here.

- ℹ️ [Introduction to Apache Flink](https://flink.apache.org/flink-architecture.html)
- 📥 [Download Apache Flink](https://flink.apache.org/downloads.html)

## Prerequisites
- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/), create a table, and load some data.
- You should have an [Astra Token](/docs/pages/astra/create-token/)
- You should clone this [GitHub repository](https://github.com/absurdfarce/flink-astra)
- You should have [Apache Flink](https://flink.apache.org/downloads.html), [Gradle](https://gradle.org/install/), and [Java](https://www.oracle.com/java/technologies/downloads/) installed in your system

!!! note "Note"

    For this tutorial, you will need either Java 8 or Java 11 to run it. Any other version might run into an exception and cause build failure.

## Installation and Setup
Now that you have gathered all of your prerequisites, you are ready to configure and setup for this example.

1. Create a keyspace named `example` in your Astra database. At the moment, this name will be hard-coded.
2. Download the secure connect bundle (SCB) for your database. You can find this under the "Connect" tab in the UI. 
3. Once you have downloaded your secure connect bundle, place it in `app/src/main/resources` in your GitHub directory (You do not have to unzip the file).
4. Create a properties file titled `app.properties`, and place it in `app/src/main/resources/`.
5. Add properties specifying your **Astra client ID, Astra secret, and SCB file name**. These should map to the "astra.clientid", "astra.secret", and "astra.scb" properties respectively. Your `app.properties` file should look something like this:
```
astra.clientid=Bwy...
astra.secret=E4dfE...
astra.scb=secure-connect-test.zip
```

## Test and Validate
Once you have completed all of the prerequisites along with the section above, you can move on to this section to run the sample app and validate the connection between Flink and Astra.

1. In your `flink-astra` cloned GitHub directory, run `./gradlew run`
2. Verify that the application runs and exits normally. If this completed successfully you should see the following message:
```
BUILD SUCCESSFUL in 31s
3 actionable tasks: 2 executed, 1 up-to-date
```
3. Navigate back to the Astra UI to use the CQL Console. You can run this sample query to confirm that the defined data from the sample app has been loaded properly:
```
token@cqlsh:example> select * from wordcount ;

 word   | count
--------+-------
   dogs |     1
 lazier |     1
  least |     1
  foxes |     1
 jumped |     1
     at |     1
    are |     1
   just |     1
  quick |     1
   than |     1
    fox |     1
    our |     1
    dog |     2
     or |     1
   over |     1
  brown |     1
   lazy |     1
    the |     2

(18 rows)
token@cqlsh:example> 
```

[🏠 Back to home](https://awesome-astra.github.io/docs/) 