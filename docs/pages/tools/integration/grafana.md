---
title: "Grafana"
description: "Grafana is a multi-platform open source analytics and interactive visualization web application."
tags: "go, javascript, cql, data management, data visualization, devops"
icon: "https://awesome-astra.github.io/docs/img/grafana/grafana.svg"
developer_title: "Grafana"
developer_url: "https://grafana.com"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/grafana/grafana_logo.svg" style="height: 180px;" />
</div>

## Overview

[Grafana](https://grafana.com/) is a multi-platform open source analytics and interactive visualization web application. It provides charts, graphs, and alerts for the web when connected to supported data sources. A licensed Grafana Enterprise version with additional capabilities is also available as a self-hosted installation or an account on the Grafana Labs cloud service. It is expandable through a plug-in system. End users can create complex dashboards using interactive query builders.

Community-developed [Cassandra Datasource for Grafana](https://github.com/HadesArchitect/GrafanaCassandraDatasource) supports both Apache Cassandra as well as DataStax AstraDB, allowing to use Cassandra as a data backend for Grafana. Data can be pulled using simple Query Configurator or more advanced but powerful Query Editor.

<img src="https://awesome-astra.github.io/docs/img/grafana/grafana_demo.png" />

*(On the picture: Query Editor at work)*

## Prerequisites

<ul class="prerequisites">
    <li>To use Grafana, you will need a running Grafana instance deployed locally or in a cloud. Locally launched <a href="https://grafana.com/docs/grafana/next/setup-grafana/installation/docker/">Grafana in Docker</a> works well too.</li>
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a> and unpack it.</li>
</ul>

Keep the token information and the bundle file location ready: these will be soon provided in the datasource configuration.

## Quickstart

### Install the plugin using CLI or using web-interface

- Install the plugin using grafana console tool:

```
grafana-cli plugins install hadesarchitect-cassandra-datasource
```

It will be installed into your grafana plugins directory; the default is /var/lib/grafana/plugins. Alternatively, enable it using Grafana Web UI.

### Create a Datasource

- Add the Apache Cassandra Data Source as a data source at the datasource configuration page. 
- Enable `Custom TLS Settings` button and configure the datasource using following details:

* **Host**: specify the `host:cql_port` values from the `config.json` file from the SecureConnectBundle. It should look like `1234567890qwerty-eu-central-1.db.astra.datastax.com:29402` **IMPORTANT** Notice, it has to be the `cql_port` value, not just `port`
* **User**: `Client ID` of the API Token
* **Password**: `Client Secret` of the API Token
* **Certificate Path**: `/path/to/cert` (use `cert` file from SecureConnectBundle)
* **Root Certificate Path**: `/path/to/key` (use `key` file from SecureConnectBundle)
* **RootCA Certificate Path**: `/path/to/ca.crt` (use `ca.crt` file from SecureConnectBundle)

Push the `Save and Test` button, if everything is right, you will see a `Database Connection OK` message.

<img src="https://awesome-astra.github.io/docs/img/grafana/grafana_config.png" />

If the database cannot be connected, check the following known common issues:

#### Known issues:

**Misconfigured Port (Using `port` instead of `cql-port`)**

Sometimes users specify the wrong port and a connection cannot be established. If you can't connect to your Astra instance, please check if the correct port specified in the datasource config (See step 3 above)

**Unavailable TLS files**

if you have an error message like `[ERROR] cassandra-backend-datasource: Unable create tls config, open /cert: permission denied`, it means that Grafana cannot open TLS certificate files. Set the proper permission f.e. using `chown` command. If you copied the files using `docker cp` command, they'll be copied by a root user and grafana will have no access to them.

### Usage

First, to visualize the data, you have to create a panel. Choose or create a dashboard and create a panel. In the panel setup, choose the correct datasource from the previous steps.

There are **two ways** to query data from Cassandra: **Query Configurator** and **Query Editor**. Configurator is easier to use but has limited capabilities, Editor is more powerful but requires an understanding of [CQL](https://cassandra.apache.org/doc/latest/cql/). 

#### Query Configurator

<img src="https://user-images.githubusercontent.com/1742301/103153577-d12ab880-4791-11eb-9a6b-50c86423134d.png" width="500">

Query Configurator is the easiest way to query data. At first, enter the keyspace and table name, then pick proper columns. If keyspace and table names are given correctly, the datasource will suggest the column names automatically.

* **Time Column** - the column storing the timestamp value, it's used to answer "when" question. 
* **Value Column** - the column storing the value you'd like to show. It can be the `value`, `temperature` or whatever property you need.
* **ID Column** - the column to uniquely identify the source of the data, e.g. `sensor_id`, `shop_id`, or whatever allows you to identify the origin of data.

After that, you have to specify the `ID Value`, the particular ID of the data origin you want to show. You may need to enable "ALLOW FILTERING" although we recommend avoiding it.

**Example** Imagine you want to visualise reports of a temperature sensor installed in your smart home. Given the sensor reports its ID, time, location and temperature every minute, we create a table to store the data and put some values there:

```
CREATE TABLE IF NOT EXISTS temperature (
    sensor_id uuid,
    registered_at timestamp,
    temperature int,
    location text,
    PRIMARY KEY ((sensor_id), registered_at)
);

insert into temperature (sensor_id, registered_at, temperature, location) values (99051fe9-6a9c-46c2-b949-38ef78858dd0, '2020-04-01T11:21:59.001+0000', 18, 'kitchen');
insert into temperature (sensor_id, registered_at, temperature, location) values (99051fe9-6a9c-46c2-b949-38ef78858dd0, '2020-04-01T11:22:59.001+0000', 19, 'kitchen');
insert into temperature (sensor_id, registered_at, temperature, location) values (99051fe9-6a9c-46c2-b949-38ef78858dd0, '2020-04-01T11:23:59.001+0000', 20, 'kitchen');
```

In this case, we have to fill the configurator fields the following way to get the results:

* **Keyspace** - smarthome *(keyspace name)*
* **Table** - temperature *(table name)*
* **Time Column** - registered_at *(occurence)*
* **Value Column** - temperature *(value to show)*
* **ID Column** - sensor_id *(ID of the data origin)*
* **ID Value** - 99051fe9-6a9c-46c2-b949-38ef78858dd0 *ID of the sensor*
* **ALLOW FILTERING** - FALSE *(not required, so we are happy to avoid)*

In the case of a few origins (multiple sensors), you will need to add more rows. If your case is as simple as that, a query configurator will be a good choice, otherwise please proceed to the query editor.

#### Query Editor

Query Editor is a more powerful way to query data. To enable query editor, press the "toggle text edit mode" button.

<img src="https://user-images.githubusercontent.com/1742301/102781863-a8bd4b80-4398-11eb-8c28-4d06a1f29279.png" width="300">

Query Editor unlocks all possibilities of CQL including aggregations, etc. 

```
SELECT sensor_id, CAST(temperature as double), registered_at FROM test.test WHERE id IN (99051fe9-6a9c-46c2-b949-38ef78858dd1, 99051fe9-6a9c-46c2-b949-38ef78858dd0) AND created_at > $__timeFrom and created_at < $__timeTo
```

1. Follow the order of the SELECT expressions, **it's important!** 
* **Identifier** - the first property in the SELECT expression must be the ID, something that uniquely identifies the data (e.g. `sensor_id`)
* **Value** - The second property must be the value that you are going to show 
* **Timestamp** - The third value must be a timestamp of the value.
All other properties will be ignored

2. To filter data by time, use `$__timeFrom` and `$__timeTo` placeholders as in the example. The datasource will replace them with time values from the panel. **Notice** It's important to add the placeholders otherwise query will try to fetch data for the whole period of time. Don't try to specify the timeframe on your own, just put the placeholders. It's grafana's job to specify time limits.

<img src="https://user-images.githubusercontent.com/1742301/103153625-1fd85280-4792-11eb-9c00-085297802117.png" width="500">

### Contacts

We hope it works well for you! In case of any questions please contact developers using [GitHub Discussions](https://github.com/HadesArchitect/GrafanaCassandraDatasource/discussions).
