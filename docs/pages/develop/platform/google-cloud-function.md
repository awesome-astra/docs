# Google Cloud Functions

[🏠 Back to home](https://awesome-astra.github.io/docs/) | \*Written by **Artem Chebotko\***

## A - Overview

[Cloud Functions](https://cloud.google.com/functions) is Google's function-as-a-service offering that provides a serverless execution environment for your code. Cloud Functions are commonly used to:

- Extend Astra DB with additional data processing capabilities, such as aggregating, summarizing and validating data periodically;
- Connect Astra DB with other cloud services into data pipelines that move, process and analyze data.

## B - Prerequisites

- [Create an Astra Database](/pages/astra/create-instance/)
- [Create an Astra Token](/pages/astra/create-token/)
- [Download a Secure Connect Bundle](/pages/astra/download-scb/)
- Optionally, if you are new to Cloud Functions, practice [creating a simpler function](https://cloud.google.com/functions/docs/quickstart-python) first

## C - Using `Python Driver`

### ✅ 1. Create a secret with the secure connect bundle file.

1. Go to [the Secret Manager page](https://console.cloud.google.com/security/secret-manager), select a project that has Secret Manager and Cloud Functions enabled, and click **Create secret**.
2. Give a **Name** to the secret and upload the secure connect bundle file as a **Secret value**. (See the **Prerequisites** section above if you need to download your secure connect bundle.) Optionally, customize other secret management settings.

<img src="/img/google-cloud-functions-python-driver/create-secret.png" />

3. Click **Create secret**.

4. On [the Secret Manager page](https://console.cloud.google.com/security/secret-manager), find the newly created secret.

<img src="/img/google-cloud-functions-python-driver/secret-manager.png" />

### ✅ 2. Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select the same project that has Secret Manager and Cloud Functions enabled, and click **Create function**.
2. Under the **Basics** section, specify preferred **Function name** and **Region**.
3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.

<img src="/img/google-cloud-functions-python-driver/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:

- `ASTRA_DB_CLIENT_ID`: A **Client ID** is generated together with an application token (see the **Prerequisites** section above).
- `ASTRA_DB_CLIENT_SECRET`: A **Client secret** is generated together with an application token (see the **Prerequisites** section above).

<img src="/img/google-cloud-functions-python-driver/runtime.png" />

Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage a client secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field.

6. Under the **Runtime, build, connections and security settings** section and the **Security**, click **Reference a secret**. Select the previously created **Secret** with the secure connect bundle file, **Grant** the service account access to the secret, if needed, use **Mounted as volume** in the **Reference method** field, and enter **secrets** in the **Mount path** field.

<img src="/img/google-cloud-functions-python-driver/reference-secret.png" />

Notice the final **Path** that should be used to access the secure connect bundle in the function code.

7. Click **Done** and **Next**.

8. Select **Python 3.7** or your preferred version in the **Runtime** field.

9. Select **Inline Editor** in the **Source code** field.

10. Enter **query_astra_db** in the **Entry point** field.

11. Add [**cassandra-driver**](https://github.com/datastax/python-driver), a Python client library for Apache Cassandra, DataStax Astra DB and DataStax Enterprise, to the `requirements.txt` file.

<img src="/img/google-cloud-functions-python-driver/requirements_txt.png" />

12. Replace the `main.py` content with:

```python
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import os
from shutil import copyfile

def query_astra_db(request):

    # Copy the secure connect bundle file to the writable part of the file system /tmp
    copyfile('/secrets/secure-connect-secret', '/tmp/secure-connect-for-my-database.zip')

    ASTRA_DB_CLIENT_ID = os.environ.get('ASTRA_DB_CLIENT_ID')
    ASTRA_DB_CLIENT_SECRET = os.environ.get('ASTRA_DB_CLIENT_SECRET')

    cloud_config= {
          'secure_connect_bundle': '/tmp/secure-connect-for-my-database.zip'
    }
    auth_provider = PlainTextAuthProvider(ASTRA_DB_CLIENT_ID, ASTRA_DB_CLIENT_SECRET)
    cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider, protocol_version=4)
    session = cluster.connect()

    row = session.execute("SELECT cql_version FROM system.local WHERE key = 'local';").one()
    print(row[0])

    print ('Success')
```

<img src="/img/google-cloud-functions-python-driver/main_py.png" />

You can learn more about the code above by reading the [**cassandra-driver**](https://github.com/datastax/python-driver) documentation.

### ✅ 3. Deploy the function.

1. Click **Deploy**.

2. On the Cloud Functions Overview page, find the newly deployed function.

<img src="/img/google-cloud-functions-python-driver/deploy.png" />

### ✅ 4. Test the function.

1. Under **Actions**, select **Test function**.

<img src="/img/google-cloud-functions-python-driver/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.

<img src="/img/google-cloud-functions-python-driver/test-results.png" />

Notice the CQL version output **3.4.5** and status code **200**.

### ✅ 5. View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.

<img src="/img/google-cloud-functions-python-driver/logs.png" />

<img src="/img/google-cloud-functions-python-driver/logs-explorer.png" />

## D - Using `Python SDK`

### ✅ 1. Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select a project that has Cloud Functions enabled, and click **Create function**.
2. Under the **Basics** section, specify preferred **Function name** and **Region**.
3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.

<img src="/img/google-cloud-functions-python-sdk/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:

- `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
- `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
- `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above).

<img src="/img/google-cloud-functions-python-sdk/runtime.png" />

Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage an application token as a secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field.

6. Click **Next**.

7. Select **Python 3.7** or your preferred version in the **Runtime** field.

8. Select **Inline Editor** in the **Source code** field.

9. Enter **query_astra_db** in the **Entry point** field.

10. Add [**AstraPy**](https://github.com/datastax/astrapy), a Pythonic SDK for DataStax Astra and Stargate, and its preferred version to the `requirements.txt` file.

<img src="/img/google-cloud-functions-python-sdk/requirements_txt.png" />

11. Replace the `main.py` content with:

```python
from astrapy.rest import create_client, http_methods
import os

def query_astra_db(request):

    ASTRA_DB_ID = os.environ.get('ASTRA_DB_ID')
    ASTRA_DB_REGION = os.environ.get('ASTRA_DB_REGION')
    ASTRA_DB_APPLICATION_TOKEN = os.environ.get('ASTRA_DB_APPLICATION_TOKEN')

    astra_http_client = create_client(astra_database_id=ASTRA_DB_ID,
                                      astra_database_region=ASTRA_DB_REGION,
                                      astra_application_token=ASTRA_DB_APPLICATION_TOKEN)

    # Retrieve a row with primary key value 'local'
    # from table 'local' in keyspace 'system'
    res = astra_http_client.request(
        method=http_methods.GET,
        path=f"/api/rest/v2/keyspaces/system/local/local"
    )
    # Print the 'cql_version' field value of the row
    print(res["data"][0]['cql_version'])

    print ('Success')
```

<img src="/img/google-cloud-functions-python-sdk/main_py.png" />

You can learn more about the code above by reading the [AstraPy](https://github.com/datastax/astrapy) documentation.

### ✅ 2. Deploy the function.

1. Click **Deploy**.

2. On the Cloud Functions Overview page, find the newly deployed function.

<img src="/img/google-cloud-functions-python-sdk/deploy.png" />

### ✅ 3. Test the function.

1. Under **Actions**, select **Test function**.

<img src="/img/google-cloud-functions-python-sdk/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.

<img src="/img/google-cloud-functions-python-sdk/test-results.png" />

Notice the CQL version output **3.4.5** and status code **200**.

### ✅ 4. View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.

<img src="/img/google-cloud-functions-python-sdk/logs.png" />

<img src="/img/google-cloud-functions-python-sdk/logs-explorer.png" />
