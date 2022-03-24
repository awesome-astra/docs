??? abstract "Reference Documentation"

    <ol>
        <li><a href="https://stargate.io/2020/10/19/the-stargate-cassandra-documents-api.html">Document API reference Blogpost</a>
        <li><a href="https://stargate.io/2021/04/05/the-stargate-documents-api-storage-mechanisms-search-filters-and-performance-improvements.html">Design Improvements in 2021</a>
        <li><a href="https://stargate.io/docs/stargate/1.0/quickstart/quick_start-document.html">QuickStart</a>
    </ol>

## Overview

<!-- Adding it inside a container will center the form-->

<div class="container">
  <h4>Basic vertical form with two text inputs a checkbox and a submit button</h4>
    <form>
      <div class="mb-3">
        <label for="dbid" class="form-label">Database ID</label>
        <input type="text" class="form-control" id="dbid" placeholder="Enter your Database id">
      </div>
      <div class="mb-3">
        <label for="dbregion" class="form-label">Database Region</label>
        <input type="text" class="form-control" id="dbregion" placeholder="">
      </div>
      <div class="mb-3">
        <label for="token" class="form-label">Astra Token</label>
        <input type="text" class="form-control" id="token" placeholder="AstraCS...">
      </div>
    </form>
</div>

## Call Api on spot

<iframe width="850" height="500" src="https://codehs.com/sandbox/id/listkeyspaces-aKxXwR/embed/?display_mode=default&show_file_tree=False&astra_db_id=dde308f5-a8b0-474d-afd6-81e5689e3e25" frameborder="0" allowfullscreen class="video-iframe"></iframe>

<script async src="https://cdn.reqbin.com/embed/js/uwsbvgq2?aoc"></script>

<iframe width="850" height="500" src="https://codehs.com/sandbox/id/java-main-LZI7fc/embed/?display_mode=default&show_file_tree=False" frameborder="0" allowfullscreen class="video-iframe"></iframe>

The document Api is an abstraction on top of Apache Cassandra to allow document-oriented accesses. The algorithm used is called **_document shredding_** and optimized to limit tombstones on edits and deletes.

- You would work with JSON document with no validation.

- You can search on any field thanks to the support out of the box of the secondary index `SAI`

- Data is stored in `collections`, that would create a technical table under the hood not mean to be queried through CQL

```sql
create table <collection_name> (
  key text,
  p0 text,
  … p[N] text,
  bool_value boolean,
  txt_value text,
  dbl_value double,
  leaf text
)
```

A json like `{"a": { "b": 1 }, "c": 2}` will be stored like
| key | p0 | p1 | dbl*value |
|:--------------:|:--------------:|:-----------|:-----------|
| {docid} | `a` | `b` | `1` |
| {docid} | `c` | \_null* | `2` |

This also work with arrays `{"a": { "b": 1 }, "c": [{"d": 2}]}`

|   key   | p0  | p1    | p2     | dbl_value |
| :-----: | :-: | :---- | :----- | :-------- |
| {docid} | `a` | `b`   | _null_ | `1`       |
| {docid} | `c` | `[0]` | `d`    | `2`       |

> ⚠️ **Limitations:** As of today there are no aggregations nor sorting available in the Document Api.

## Working with Postman

#### 📦. Prerequisites [ASTRA]

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create and Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- You should [Have an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)

#### 📦. Prerequisites [Development Environment]

- You should install **[Postman](https://www.postman.com/downloads/)** to import some collections we provided.

#### 📦. Setup Postman

- Import the configuration File `Astra_Document_Api_Configuration.json` in postman. In the menu locate `File > Import` and drag the file in the box.

![import-doc](https://github.com/datastaxdevs/awesome-astra/blob/main/postman/docapi-conf-import.png?raw=true)

- Edit the values for you db:

| Parameter Name | parameter value                       | Description                                                                                                                                                                                                                                       |
| :------------: | :------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
|     token      | `AstraCS:....`                        | _When you generate a new token it is the third field. Make sure you add enough privileges to use the APis, Database Administrator is a good choice to develop_                                                                                    |
|       db       | `00000000-0000-0000-0000-00000000000` | _Unique identifier of your DB, [you find on the main dashboard](https://github.com/datastaxdevs/awesome-astra/wiki/Astra-FAQ#where-should-i-find-a-database-identifier-)_                                                                         |
|     region     | `us-east1`                            | _region name, [you find on the datanase dashboard](https://github.com/datastaxdevs/awesome-astra/wiki/Astra-FAQ#where-should-i-find-a-database-region-name-)_                                                                                     |
|   namespace    | `demo`                                | _Namespaces are the same as keyspaces. They are created with the database or added from the database dashboard: [How to create a keyspace](https://github.com/datastaxdevs/awesome-astra/wiki/Astra-FAQ#how-to-create-a-namespace-or-keyspace-)]_ |
|   collection   | `person`                              | _Collection name (like table) to store one type of documents._                                                                                                                                                                                    |

- this is what it is look like

![import-doc](https://github.com/datastaxdevs/awesome-astra/blob/main/postman/docapi-conf-edit.png?raw=true)

- Import the Document Api Collection `Astra_Document_Api.json` in postman. Same as before `File > Menu`

![import-doc](https://github.com/datastaxdevs/awesome-astra/blob/main/postman/docapi-import.png?raw=true)

- That's it you have now access to a few dozens operations for `namespace`, `collections` and `documents`

![import-doc](https://github.com/datastaxdevs/awesome-astra/blob/main/postman/docapi-resources.png?raw=true)

## Working with CURL

#### 📦. Prerequisites [ASTRA]

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create and Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- You should [Have an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)

#### 📦. Prerequisites [Development Environment]

- Working with CURL:You should have **curl** commands available either installing following steps [here](https://curl.se/download.html) or

```bash
curl --version
```

## Working with Swagger
