---
title: "Feast"
description: "Feast is an open-source feature store for machine learning."
tags: "python, third party tools, machine learning"
icon: "https://awesome-astra.github.io/docs/img/feast/feast.svg"
recommended: "true"
developer_title: "Tecton"
developer_url: "https://feast.dev"
links:
- title: "Feast Documentation"
  url: "https://docs.feast.dev"
- title: "Cassandra online store"
  url: "https://docs.feast.dev/reference/online-stores/cassandra"
- title: "Feast minimal quickstart"
  url: "https://docs.feast.dev/getting-started/quickstart"
---

<div class="nosurface" markdown="1">

<img src="../../../../img/feast/feast_logo.png" height="100px" />
</div>

## Overview

[Feast](https://feast.dev/)
is a (Apache-licensed) open-source feature store for machine learning.
Feast aims at providing a fast solution to the typical MLOps needs one encounters
when bringing ML applications to production.

Feast offers a solution to the problem of training/serving skew, provides tools
to standardize the data engineering workflows (thus avoiding having to
"re-invent the features" every time), and ensures reproducible feature sets with
point-in-time historical retrievals.

This feature store supports several backends, both as offline store (for historical
time-series data) and online store (with the latest features, synced from the former
by Feast itself). Besides a few core backends, the Feast project features
additional backends contributed by the community.

Feast is built with the cloud in mind: one of its
goals is to free MLOps practitioners and data engineers from having to manage
their own infrastructure.
In this spirit, starting with version `0.24`,
the [Feast online store for Cassandra](https://docs.feast.dev/reference/online-stores/cassandra)
contribution flexibly supports both Cassandra and Astra DB, as will be explained below.

<div class="nosurface" markdown="1">
Reference documentation:

- ℹ️ [Feast Documentation](https://docs.feast.dev)
- ℹ️ [Cassandra online store](https://docs.feast.dev/reference/online-stores/cassandra)
- ℹ️ [Feast minimal quickstart](https://docs.feast.dev/getting-started/quickstart)

</div>

## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a> In the following example, a keyspace called `feastks` is created in the database.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Create an Astra Token</a> with the role "Database Administrator" (Feast will have to dynamically create and delete tables in the keyspace).</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a>.</li>
    <li>Install Feast, including the dependencies for the Cassandra/Astra DB backend, in your local Python environment: <code>pip install feast[cassandra]</code>.</li>
</ul>

Keep the token information and the bundle file location ready: these will be soon provided in the Feast configuration.

## Quickstart

!!! note "Note"
    In this minimal quickstart, modeled after the one found in the [Feast documentation](https://docs.feast.dev/getting-started/quickstart), you will be providing the store configuration file by hand.

    Alternatively, an **interactive command-line procedure** to help you set up your store is available by launching `feast init REPO_NAME -t cassandra`.
    
    All credits for the sample code given here goes to the Feast documentation.

A new feature store is created and configured to use Astra DB as online store;
next, a few sample features will be materialized to database;
finally, historical/online feature retrieval is demonstrated.


### Install Feast

See last item in the "Prerequisites" above.

### Create a feature repository

In a directory of your choice, create a new repository and `cd` to the
corresponding directory:

```
feast init astra_feature_repo
cd astra_feature_repo
```

As you can see, the new feature store already contains sample data
and a sample feature definition. These will be used in this walkthrough,
so don't delete them.

#### Configure Astra DB as online store

Locate and open the store configuration file, `feature_store.yaml`. Replace
the `online_store` portion of the file with something like the following.
Make sure you use your values for the Secure Bundle file full path,
the Client ID and Client Secret from your token and the keyspace name:

```
online_store:
    type: cassandra
    secure_bundle_path: /path/to/secure/bundle.zip
    username: Client_ID
    password: Client_Secret
    keyspace: feastks
```

!!! note "Settings in 'feature_store.yaml' for usage with Cassandra"
    If using regular Cassandra as opposed to Astra DB, the "online_store" portion might look like:
    ```
    online_store:
        type: cassandra
        hosts:
            - 192.168.1.1
            - 192.168.1.2
            - 192.168.1.3
        keyspace: feastks
        port: 9042        # optional
        username: user    # optional
        password: 123456  # optional
    ```

Additional settings are available when configuring your Cassandra/Astra DB
online store: check out [the full examples](https://docs.feast.dev/reference/online-stores/cassandra#getting-started)
on the Feast documentation.


### Register feature definitions and deploy the store

With the `apply` command, features defined in Python modules (in this case,
`example.py`) are scanned and used for actual deployment of the infrastructure.

Run the command

```
feast apply
```

> This is the step that actually accesses the database. After running it,
> you may want to check directly the presence of a new table in the Astra DB
> keyspace.

### Generate training data

This illustrates the `get_historical_features` store method,
which directly scans the offline source data and performs
a point-in-time join to construct the features requested
up to a certain provided timestamp.

Create a file `generate.py` and run it with `python generate.py`:

```python
from datetime import datetime, timedelta
import pandas as pd

from feast import FeatureStore

# The entity dataframe is the dataframe we want to enrich with feature values
entity_df = pd.DataFrame.from_dict(
    {
        # entity's join key -> entity values
        "driver_id": [1001, 1002, 1003],

        # label name -> label values
        "label_driver_reported_satisfaction": [1, 5, 3], 

        # "event_timestamp" (reserved key) -> timestamps
        "event_timestamp": [
            datetime.now() - timedelta(minutes=11),
            datetime.now() - timedelta(minutes=36),
            datetime.now() - timedelta(minutes=73),
        ],
    }
)

store = FeatureStore(repo_path=".")

training_df = store.get_historical_features(
    entity_df=entity_df,
    features=[
        "driver_hourly_stats:conv_rate",
        "driver_hourly_stats:acc_rate",
        "driver_hourly_stats:avg_daily_trips",
    ],
).to_df()

print("----- Feature schema -----\n")
print(training_df.info())

print()
print("----- Example features -----\n")
print(training_df.head())
```


### Load features in the online store

With the `materialize-incremental` command, Feast is instructed
to carry the latest feature values over to the online store, for
quick access during feature serving:

```
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%S")
feast materialize-incremental $CURRENT_TIME
```

> At this point, inspection of the Astra DB table will show the presence of
> newly-inserted rows.



### Fetch feature vectors from the online store

The `get_online_features` store method will query the online store
and return the required features, as resulting from the last
"materialize" operation.

Create a `fetch_online.py` script and run it with `python fetch_online.py`:


```python
from pprint import pprint
from feast import FeatureStore

store = FeatureStore(repo_path=".")

feature_vector = store.get_online_features(
    features=[
        "driver_hourly_stats:conv_rate",
        "driver_hourly_stats:acc_rate",
        "driver_hourly_stats:avg_daily_trips",
    ],
    entity_rows=[
        # {join_key: entity_value}
        {"driver_id": 1004},
        {"driver_id": 1005},
    ],
).to_dict()

pprint(feature_vector)
```

### Next steps

Have a look at the `feature_store.yaml`
[examples](https://docs.feast.dev/reference/online-stores/cassandra#getting-started)
for Cassandra and Astra DB to check the full set of options available.

Head over to the [Feast documentation](https://docs.feast.dev/)
to find out what you can do with your newly-deployed feature store.