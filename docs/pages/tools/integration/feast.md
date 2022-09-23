---
title: "Feast"
description: "Feast is an open-source feature store for machine learning."
tags: "python, third party tools, machine learning"
icon: "https://awesome-astra.github.io/docs/img/feast/feast_logo.png"
recommended: "true"
developer_title: "Tecton"
developer_url: "https://feast.dev"
links:
- title: "Feast Documentation"
  url: "https://docs.feast.dev"
- title: "Minimal quickstart with Feast"
  url: "https://docs.feast.dev/getting-started/quickstart"
- title: "The feast-cassandra plugin"
  url: "https://pypi.org/project/feast-cassandra/"
---

<div class="nosurface" markdown="1">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/) | *Last Update {{ git_revision_date }}* 

<img src="../../../../img/feast/feast_logo.png" height="100px" />
</div>

## A - Overview

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
by Feast itself). Some of the backends are native in Feast, but several more are
available as external plugins. Feast is built with the cloud in mind: one of its
goals is to free MLOps practitioners and data engineers from having to manage
their own infrastructure.

In this spirit, the
[Feast online store plugin for Cassandra](https://pypi.org/project/feast-cassandra/)
flexibly supports both Cassandra and Astra DB, as will be explained below.

<div class="nosurface" markdown="1">
Reference documentation:

- ℹ️ [Feast documentation](https://docs.feast.dev/)
- ℹ️ [Minimal quickstart with Feast](https://docs.feast.dev/getting-started/quickstart)
- ℹ️ [The `feast-cassandra` plugin](https://pypi.org/project/feast-cassandra/)
</div>

## B - Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a> In the following example, a keyspace called `feastks` is created in the database.</li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Create an Astra Token</a> with the role "Database Administrator" (Feast will have to dynamically create and delete tables in the keyspace).</li>
    <li class="nosurface">You should <a href="/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a>.</li>
    <li>Install Feast and the Cassandra/Astra DB plugin in your local Python environment, i.e. `pip install feast feast-cassandra`. See the specific pages (<a href="https://docs.feast.dev/getting-started/quickstart#step-1-install-feast">Feast</a>, <a href="https://pypi.org/project/feast-cassandra/">Cassandra plugin</a>) for additional installation info.</li>
</ul>

Keep the token information and the bundle file location ready: these will be soon provided in the Feast configuration.

## C - Quickstart

_Note: this quickstart is modeled after the one
found in the
[Feast documentation](https://docs.feast.dev/getting-started/quickstart).
The numbering of the steps is chosen to be consistent with it.
All credits for the sample code given here goes to the Feast documentation._

A new feature store is created and configured to use Astra DB as online store;
next, it will be materialized to database using sample feature definitions and
sample data; finally, historical/online feature retrieval is demonstrated.

### <span class="nosurface">✅ </span>Steps:

#### 1. Install Feast and the plugin

See last item in the "Prerequisites" above.

#### 2. Create a feature repository

In a directory of your choice, create a new repository and `cd` to the
corresponding directory:

```
feast init astra_feature_repo
cd astra_feature_repo
```

As you can see, the new feature store already contains sample data
and a sample feature definition. These will be used in this walkthrough,
so don't delete them.

#### 2B. Configure Astra DB as online store

Locate and open the store configuration file, `feature_store.yaml`. Replace
the `online_store` portion of the file with something like (_use your values
for the bundle path and the token authentication info_):

```
online_store:
    type: feast_cassandra_online_store.cassandra_online_store.CassandraOnlineStore
    secure_bundle_path: /path/to/secure/bundle.zip
    username: Client_ID
    password: Client_Secret
    keyspace: feastks
```

<details><summary>Settings in "feature_store.yaml" for usage with Cassandra</summary>

If using regular Cassandra as opposed to Astra DB, the "online_store" portion might look like:

```
online_store:
    type: feast_cassandra_online_store.cassandra_online_store.CassandraOnlineStore
    hosts:
        - 192.168.1.1
        - 192.168.1.2
        - 192.168.1.3
    keyspace: feastks
    port: 9042        # optional
    username: user    # optional
    password: secret  # optional
```
</details>

#### 3. Register feature definitions and deploy the store

With the `apply` command, features defined in Python modules (in this case,
`example.py`) are scanned and used for actual deployment of the infrastructure.

Run the command
```
feast apply
```

> This is the step that actually accesses the database. After running it,
> you may want to check directly the presence of a new table in the Astra DB
> keyspace.

#### 4. Generate training data

This illustrates the `get_historical_features` store method,
which directly scans the offline source data and performs
a point-in-time join to construct the features requested
up to a certain provided timestamp.

Create a file `generate.py` and run it with `python generate.py`:

<details><summary>Show "generate.py"</summary>

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

</details>

#### 5. Load features in the online store

With the `materialize-incremental` command, Feast is instructed
to carry the latest feature values over to the online store, for
quick access during feature serving:

```
CURRENT_TIME=$(date -u +"%Y-%m-%dT%H:%M:%S")
feast materialize-incremental $CURRENT_TIME
```

> At this point, inspection of the Astra DB table will show the presence of
> newly-inserted rows.

#### 6. Fetch feature vectors from the online store

The `get_online_features` store method will query the online store
and return the required features, as resulting from the last
"materialize" operation.

Create a `fetch_online.py` script and run it with `python fetch_online.py`:

<details><summary>Show "fetch_online.py"</summary>

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

</details>

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>
