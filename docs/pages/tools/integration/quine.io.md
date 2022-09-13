*Last Update {{ git_revision_date }}*

## A - Overview

<img src="https://awesome-astra.github.io/docs/img/quine/quine-image.png?raw=true" height="50px" />

Quine is a streaming graph capable of building high-volumes of data into a stateful graph.  It allows for real-time traversals on a graph, as well as for the data to be streamed-out for event processing.

- ℹ️ [Quine Documentation - Core Concepts](https://docs.quine.io/core-concepts/core-concepts.html)

## B - Prerequisites

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- You should [Create an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)
- You should [Download your Secure bundle](https://github.com/datastaxdevs/awesome-astra/wiki/Download-the-secure-connect-bundle)
- You should install a JDK (version 11 or higher).

This article was written for Quine version `1.2.1` on `MacOS` with Java `11.10`.

## C - Installation

**✅ Step 1 Download and install**

Follow the [Download Quine page](https://quine.io/download) to download the JAR.  Choose/create a directory for Quine, and copy the JAR to this location:

```
mkdir ~/local/quine
cp ~/Downloads/quine-1.2.1.jar ~/local/quine
```

**✅ Step 2 Create the keyspace `quine`**

From the [Astra DB dashboard](https://astra.datastax.com), click on your database name. Scroll down to where the keyspaces are listed, and click the `Add Keyspace` button to create a new keyspace. Name this keyspace `quine`.

**✅ Step 3 Configuration**

Create a `quine.conf` file inside the `quine` directory:

```
cd ~/local/quine
touch quine.conf
```

Edit the `quine.conf` file to look like the following:

```
quine.store {
  # store data in an Apache Cassandra instance
  type = cassandra

  # the keyspace to use
  keyspace = quine

  should-create-keyspace = false
  should-create-tables = true

  replication-factor = 3

  write-consistency = LOCAL_QUORUM
  read-consistency = LOCAL_QUORUM

  local-datacenter = "us-east1"

  write-timeout = "10s"
  read-timeout = "10s"
}
datastax-java-driver {
  advanced {
    auth-provider {
      class = PlainTextAuthProvider
      username = "token"
      password = "AstraCS:qFDPGZEgBlahBlahYourTokenGoesHerecff15fc"
    }
  }
  basic {
    cloud {
      secure-connect-bundle = "/Users/aaronploetz/local/secure-connect-bundle.zip"
    }
  }
}
```

Astra-Specific Settings:

`type = cassandra` - If the `type` is not specified, Quine defaults to use RocksDB.

`should-create-keyspace = false` - Remember keyspaces can only be created in Astra via the dashboard.

`replication-factor = 3` - Defaults to `1` if not set, which will not work with Astra DB.

`write-consistency = LOCAL_QUORUM` - Minimum consistency level required by Astra.

`read-consistency = LOCAL_QUORUM` - Minimum consistency level required by Astra.

`local-datacenter = "us-east1"` - Set Astra DB's cloud region as the local DC.

`username = "token"` - No need to mess with this.  Just leave it as the literal word "token."

`password` - A valid token for an Astra DB cluster.

`secure-connect-bundle` - A valid, local file location of a downloaded secure connect bundle.  Also, the driver gets the Astra DB hostname from the secure bundle, so there is no need to specify endpoints separately.

**✅ Step 4 Run Quine**

To run Quine, invoke the JAR with Java, while passing the `quine.conf` in the `config.file` parameter:

```
$ java -Dconfig.file=quine.conf -jar quine-1.2.1.jar

2022-06-15 15:11:52,666 WARN [NotFromActor] [s0-io-4] com.datastax.oss.driver.internal.core.cql.CqlRequestHandler - Query '[0 values] CREATE TABLE IF NOT EXISTS journals (quine_id blob,timestamp bigint,data blob,PRIMARY KEY(quine_id,timestamp)) WITH CLUSTERING ORDER BY (timestamp ASC) AND compaction={'class':'TimeWindowCompactionStrategy'}' generated server side warning(s): Ignoring provided values [compaction] as they are not supported for Table Properties (ignored values are: [additional_write_policy, bloom_filter_fp_chance, caching, cdc, compaction, compression, crc_check_chance, dclocal_read_repair_chance, extensions, gc_grace_seconds, id, max_index_interval, memtable_flush_period_in_ms, min_index_interval, nodesync, read_repair, read_repair_chance, speculative_retry])
Graph is ready!
Application state loaded.
Quine app web server available at http://0.0.0.0:8080
```

As shown above, Astra DB will return a warning about table valid options which it will ignore.

You can now use Quine's visual graph explorer in a web browser, and create/traverse data with either Gremlin or Cypher: [http://localhost:8080/](http://localhost:8080/)

<img src="https://awesome-astra.github.io/docs/img/quine/quine-browser-apollo13.png?raw=true" height="300px" />

The Swagger spec for the Quine API can also be found locally at: [http://localhost:8080/docs](http://localhost:8080/docs)

**✅ Troubleshooting**

If the output does not read: 

Graph is ready!
Application state loaded.
Quine app web server available at http://0.0.0.0:8080

Then look for exceptions.

If you see an error 
com.datastax.oss.driver.api.core.servererrors.InvalidQueryException: Clustering key columns must exactly match columns in CLUSTERING ORDER BY directive

Check to ensure the snapshots table exists

cqlsh> use quine;
cqlsh> desc quine;

If not, execute this command in CQLSH to create it:

CREATE TABLE quine.snapshots (
    quine_id blob,
    timestamp bigint,
    multipart_index int,
    data blob,
    multipart_count int,
    PRIMARY KEY (quine_id, timestamp, multipart_index)
) WITH CLUSTERING ORDER BY (timestamp DESC, multipart_index ASC)
    AND additional_write_policy = '99PERCENTILE'
    AND bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.UnifiedCompactionStrategy'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair = 'BLOCKING'
    AND speculative_retry = '99PERCENTILE';

## D - Acknowledgements

Special thanks goes out to Ryan Wright and Leif Warner of [thatDot](https://www.thatdot.com/) for their help with getting Quine running and connected.

[🏠 Back to HOME](https://awesome-astra.github.io/docs/)
