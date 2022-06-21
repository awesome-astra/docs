<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="https://docs.datastax.com/en/dsbulk/doc/"><b>📖  DSBulks Docs</b> - Reference documentation</a>
<li><a href="https://docs.datastax.com/en/astra/docs/loading-and-unloading-data-with-datastax-bulk-loader.html"><b>📖  Datastax Docs</b> - Reference Documentation</a>
</ol>
</details>

## A - Overview

### 📘 What is DSBulk ?

The DataStax Bulk Loader tool (DSBulk) is a unified tool for loading into and unloading from Cassandra-compatible storage engines, such as OSS Apache Cassandra®, DataStax Astra and DataStax Enterprise (DSE).

Out of the box, DSBulk provides the ability to:

- **Load (import)** large amounts of data into the database efficiently and reliably;
- **Unload (export)** large amounts of data from the database efficiently and reliably;
- **Count** elements in a database table: how many rows in total, how many rows per replica and per token range, and how many rows in the top N largest partitions.

```bash
# Load data
dsbulk load <options>

# Unload data
dsbulk unload <options>

# Count rows
dsbulk count <options>
```

Currently, CSV and Json formats are supported for both loading and unloading data.

### 📘 Datastax Bulk Loader with Astra

Use DataStax Bulk Loader `(dsbulk)` to load and unload data in CSV or JSON format with your DataStax Astra DB database efficiently and reliably.

You can use `dsbulk` as a standalone tool to remotely connect to a cluster. The tool is not required to run locally on an instances, but can be used in this configuration.

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)
- You should [Download your Secure bundle](/docs/pages/astra/download-scb/)

This article was written for Datastax Bulk Loader version `1.8.0`.

## C - Installation

**✅ Step 1 : Download the archive and unzip locally**

```bash
curl -OL https://downloads.datastax.com/dsbulk/dsbulk-1.8.0.tar.gz \
          && tar xvzf dsbulk-1.8.0.tar.gz \
          && rm -f dsbulk-1.8.0.tar.gz
```

_it will take a few seconds (file is about 30M)..._

```
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
 49 30.0M   49 14.8M    0     0   343k      0  0:01:29  0:00:44  0:00:45  244k
```

## D - Usage

### 📘 Load Data

- Given a table

```sql
CREATE TABLE better_reads.book_by_id (
    id text PRIMARY KEY,
    author_id list<text>,
    author_names list<text>,
    book_description text,
    book_name text,
    cover_ids list<text>,
    published_date date
)
```

- A sample CSV could be:

```csv
id|author_id|author_names|book_description|book_name|cover_ids|published_date
1234|["id1","id2","id3"]|["name1","name2","name3"]|this is a dsecription|Book name|["cover1","cover2"]|2022-02-02
```

- Loaded with the following command:

```bash
dsbulk load \
    -url book_by_id.csv \
    -c csv \
    -delim '|' \
    -k better_reads \
    -t book_by_id \
    --schema.allowMissingFields true \
    -u clientId \
    -p clientSecret \
    -b secureBundle.zip
```

### 📘 Export Data

- Unloaded the same table with the following command:

```bash
dsbulk unload \
    -k better_reads \
    -t book_by_id \
    -c csv \
    -u clientId \
    -p clientSecret \
    -b secureBundle.zip \
    > book_by_id_export.csv
```

### 📘 Count Table Records

- Counted the rows in the table with the following command:

```bash
dsbulk count \
    -k better_reads \
    -t book_by_id \
    -u clientId \
    -p clientSecret \
    -b secureBundle.zip
```

- Produces the following output:

```
Operation directory: /local/dsbulk-1.8.0/logs/COUNT_20220223-213637-046128
  total | failed | rows/s |  p50ms |  p99ms | p999ms
143,475 |      0 | 87,509 | 155.34 | 511.71 | 511.71
Operation COUNT_20220223-213637-046128 completed successfully in 1 second.
143475
```
