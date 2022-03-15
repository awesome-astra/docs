# Connecting to Astra DB from a Google Cloud Function using Python SDK and Cloud Console

<p float="left">
    <img src="img/gcf-logo.png" height="80px" />
    <img src="img/python-logo.png" height="80px" />
    <img src="img/astra-db-logo.png" height="80px" />
</p>


## Overview

[Cloud Functions](https://cloud.google.com/functions) is Google's function-as-a-service offering that provides a serverless execution environment for your code. Cloud Functions are commonly used to:
- Extend Astra DB with additional data processing capabilities, such as aggregating, summarizing and validating data periodically;
- Connect Astra DB with other cloud services into data pipelines that move, process and analyze data.


## Prerequisites

- [Create an Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- [Create an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)
- Optionally, if you are new to Cloud Functions, practice [creating a simpler function](https://cloud.google.com/functions/docs/quickstart-python) first


## Creating a Google Cloud Function to Access Astra DB using Python SDK and Cloud Console

### ✅ Step 1: Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select a project that has Cloud Functions enabled, and click **Create function**.
2. Under the **Basics** section, specify preferred **Function name** and **Region**.
3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.

<img src="img/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:

- `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
- `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
- `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above). 

<img src="img/runtime.png" />

Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage an application token as a secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field. 

6. Click **Next**.

7. Select **Python 3.7** or your preferred version in the **Runtime** field.

8. Select **Inline Editor** in the **Source code** field.

9. Enter **query_astra_db** in the **Entry point** field.

11. Add [**AstraPy**](https://github.com/datastax/astrapy), a Pythonic SDK for DataStax Astra and Stargate, and its preferred version to the `requirements.txt` file.

<img src="img/requirements_txt.png" />

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

<img src="img/main_py.png" />

You can learn more about the code above by reading the [AstraPy](https://github.com/datastax/astrapy) documentation.


### ✅ Step 2: Deploy the function.

1. Click **Deploy**. 

2. On the Cloud Functions Overview page, find the newly deployed function.

<img src="img/deploy.png" />

### ✅ Step 3: Test the function.

1. Under **Actions**, select **Test function**.

<img src="img/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.

<img src="img/test-results.png" />

Notice the CQL version output **3.4.5** and status code **200**.

### ✅ Step 4: View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.

<img src="img/logs.png" />
<img src="img/logs-explorer.png" />


