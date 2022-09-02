<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="https://docs.nosqlbench.io/docs/nosqlbench/introduction/"><b>📖  NoSQLBench Docs</b> - Reference documentation</a>
<li><a href="https://docs.datastax.com/en/astra/docs/develop/dev-upload-data.html#_test_loading_data_with_nosqlbench"><b>📖  Astra Docs</b> - Reference Documentation</a>
</ol>
</details>

## A - Overview

### 📘 What is NoSQLBench ?

NoSQLBench is a powerful, state-of-the-art tool for emulating real application
workloads and direct them to actual target data stores for reliable,
reproducible benchmarking.

NoSQLBench is extremely customizable, yet comes with many pre-defined workloads,
ready for several types of distributed, NoSQL data systems. One of the target
databases is Cassandra/Astra DB, supported out-of-the-box by NoSQLBench and
complemented by some ready-made realistic workloads for benchmarking.

At the heart of NoSQLBench are a few principles:

- ease-of-use, meaning that one can start using it without learning all layers of customizability;
- modularity in the design: building a new driver is comparatively easy;
- workloads are reproducible down to the individual statement (no "actual randomness" involved);
- reliable performance timing, i.e. care is taken on the client side to avoid unexpected JVM pauses.

### 📘 NoSQLBench and Astra DB

NoSQLBench uses the (CQL-based) Cassandra Java Drivers, which mean that it
supports Astra DB natively with its drivers. The only care is in providing
access to an Astra DB instance, which is done via command-line parameters.

The only care is that, while running a benchmark against a generic Cassandra
installation usually entails creation of a keyspace if it does not exist,
when benchmarking Astra DB you should **make sure the keyspace exists already**
(the keyspace name can be passed as a command-line parameter when launching
NoSQLBench).

## B - Prerequisites

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)
- You should [Download your Secure bundle](/docs/pages/astra/download-scb/)

## C - Installation

The following installation instructions are taken from
[the official NoSQLBench documentation](https://docs.nosqlbench.io/docs/getting_started/00-get-nosqlbench/).
Please refer to it for more details and updates.

**✅ Step 1 : Download the binaries**

Go to the [releases page](https://github.com/nosqlbench/nosqlbench/releases)
and download the latest version.
The suggested option is to download the Linux binary (`nb`),
but as an alternative the `nb.jar` version can also be used:
here we assume the Linux binary is used, please see the
[NoSQLBench documentation](https://docs.nosqlbench.io/docs/getting_started/00-get-nosqlbench/)
for more on using the JAR.

**✅ Step 2 : Make executable and put in search path**

Once the file is downloaded, make it executable with `chmod +x nb`
and put it (or make a symlink) somewhere in your system's search path,
such as `/home/${USER}/.local/bin/`.

As a quick test, try the command `nb --version`.

## D - Usage

### Command

If you already use NoSQLBench... then all you need to know is that invocations should include the following
parameters to locate an Astra DB instance and authenticate to it:

```
nb \
  [...] \
  username=CLIENT_ID                                 \
  password=CLIENT_SECRET                             \
  secureconnectbundle=/PATH/TO/SECURE-CONNECT-DB.zip \
  keyspace=KEYSPACE_NAME                             \
  [...]
```

In the above, you should pass your Client ID and Client Secret as found in
the Astra DB Token, and the path to the Secure Bundle zipfile you obtained
earlier (see [Prerequisites](#b---prerequisites)). Please prepend `./` to
the bundle path if it is a relative path.

You may want to specify a keyspace, as seen in the sample command quoted here,
because, as Astra DB does not support the `CREATE KEYSPACE` CQL command,
it would be your responsibility to match the keyspace used in the benchmark
with the name of an existing one. Please inspect the contents of your
workload `yaml` file more closely for more details on the keyspace name used
by default.

### Quick-start

There is a comprehensive [Getting Started page](https://docs.nosqlbench.io/docs/getting_started/01-example-commands/)
on NoSQLBench documentation, so here only a couple of sample full commands will be given.
Please consult the full documentation for more options and configurations.

Some of the ready-made workloads included with NoSQLBench are specific
for benchmarking realistic usage patterns of Cassandra/Astra DB.
A quick way to get started is to launch those workloads with the
"workload scenario" syntax (where the 'scenario' specifies that you are
targeting an Astra DB instance).

**"cql-keyvalue" workload**

The following will run the "cql-keyvalue" workload, specifically its "astra" scenario,
on an Astra DB instance:

```bash
nb cql-keyvalue astra                                \
  username=CLIENT_ID                                 \
  password=CLIENT_SECRET                             \
  secureconnectbundle=/PATH/TO/SECURE-CONNECT-DB.zip \
  keyspace=KEYSPACE_NAME
```

Alternatively, if you are using the `jar` version of the tool,

```bash
java -jar nb.jar cql-keyvalue astra                  \
  username=CLIENT_ID                                 \
  password=CLIENT_SECRET                             \
  secureconnectbundle=/PATH/TO/SECURE-CONNECT-DB.zip \
  keyspace=KEYSPACE_NAME
```

This workload emulates usage of Astra DB/Cassandra as a simple key-value store,
and does so by alternating "random" reads and writes to a single table.
A preliminar "rampup" phase is run, consisting only of writes, and then the "main"
phase takes place (this structure is a rather universal features of these benchmarks).

(Note: most likely you may want to add further options, such as
[`cyclerate`](https://docs.nosqlbench.io/docs/reference/core-activity-parameters/#cyclerate),
`rampup-cycles`, `main-cycles` or
[`--progress console`](https://docs.nosqlbench.io/docs/reference/command-line/#execution-options).
See the NoSQLBench docs and inspect the workload `yaml` for more).

The above command, as things progress, will produce an output similar to:

```
cqlkeyvalue_astra_schema: 100.00%/Stopped (details: min=0 cycle=1 max=1) (last report)
cqlkeyvalue_astra_rampup: 15.60%/Running (details: min=0 cycle=234 max=1500)
cqlkeyvalue_astra_rampup: 32.40%/Running (details: min=0 cycle=486 max=1500)
[...]
cqlkeyvalue_astra_main: 96.67%/Running (details: min=0 cycle=1450 max=1500)
cqlkeyvalue_astra_main: 100.00%/Running (details: min=0 cycle=1500 max=1500) (last report)
```

followed by a final summary - reflected also in files in the `logs/` directory,
similar to:

```
-- Gauges ----------------------------------------------------------------------
cqlkeyvalue_astra_main.cycles.config.burstrate
             value = 55.00000000000001

[...]

cqlkeyvalue_astra_schema.tokenfiller
             count = 57086
         mean rate = 941.29 calls/second
     1-minute rate = 940.67 calls/second
     5-minute rate = 939.91 calls/second
    15-minute rate = 939.71 calls/second
```

You may want to check that at this point a new table has been created,
if it did not exist yet, in the keyspace.

**"cql-iot" workload**

Similar to the above for the "cql-iot" workload, aimed at emulating
time-series-based reads and writes for a hypothetical IoT system:

```bash
nb cql-iot astra                                     \
  username=CLIENT_ID                                 \
  password=CLIENT_SECRET                             \
  secureconnectbundle=/PATH/TO/SECURE-CONNECT-DB.zip \
  keyspace=KEYSPACE_NAME
```

**Other workloads**

You can inspect all available workloads with:

```
nb --list-scenarios
```

and look for `astra` in the output example scenario invocations there.

Moreover, you can [design your own workload](https://docs.nosqlbench.io/docs/workloads_101/00-designing-workloads/).
