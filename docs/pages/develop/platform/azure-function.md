---
title: "Azure Functions"
description: "Azure Functions is Microsoft Azure's function-as-a-service offering that provides a serverless execution environment for your code. Azure Functions are commonly used to extend Astra DB with additional data processing capabilities and connect Astra DB with other cloud services into data pipelines."
tags: "FaaS, serverless, Azure, Java, Python"
icon: "https://awesome-astra.github.io/docs/img/azure-functions/azure-functions.svg"
developer_title: "Azure Functions"
developer_url: "https://learn.microsoft.com/en-us/azure/azure-functions/"
---

<div class="nosurface" markdown="1">
# Azure Functions
</div>

## Overview

[Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/) is Microsoft Azure's function-as-a-service offering that provides a serverless execution environment for your code. Azure Functions are commonly used to:

- Extend Astra DB with additional data processing capabilities, such as aggregating, summarizing and validating data periodically;
- Connect Astra DB with other cloud services into data pipelines that move, process and analyze data.

## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
</ul>

## Using Python Driver

### <span class="nosurface" markdown="1">✅ 1.</span> Create a function.

1. Follow [the Quickstart](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-python) to create a Python function in Azure from the command line using the `v1` Python programming model and Azure CLI. Complete all the steps to successfully deploy and test the function in Azure.

2. Use Azure CLI to add these runtime environment variables to the application settings:
    - `ASTRA_DB_CLIENT_ID`: A **Client ID** is generated together with an application token (see the **Prerequisites** section above).
    - `ASTRA_DB_CLIENT_SECRET`: A **Client secret** is generated together with an application token (see the **Prerequisites** section above).
```bash

az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings "ASTRA_DB_CLIENT_ID=Hdisr..."

az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings "ASTRA_DB_CLIENT_SECRET=UB3Tm8cR,Ic..."
```
Note that `<APP_NAME>` and `<RESOURCE_GROUP_NAME>` must be replaced with correct application and resurce group names used in the previous step. Similarly, `ASTRA_DB_CLIENT_ID` and `ASTRA_DB_CLIENT_SECRET` must be assigned correct values generated for your database.

3. Copy the secure connect bundle file to the project directory. (See the **Prerequisites** section above if you need to download your secure connect bundle.)

4. Add [**cassandra-driver**](https://github.com/datastax/python-driver), a Python client library for Apache Cassandra, DataStax Astra DB and DataStax Enterprise, to the `requirements.txt` file:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-driver/requirements_txt.png" />

5. Replace the `__init__.py` content with:
```python
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import logging
import azure.functions as func
import os

ASTRA_DB_CLIENT_ID = os.environ['ASTRA_DB_CLIENT_ID']
ASTRA_DB_CLIENT_SECRET = os.environ['ASTRA_DB_CLIENT_SECRET']

cloud_config= {
    'secure_connect_bundle': 'secure-connect-bundle-for-your-database.zip',
    'use_default_tempdir': True
}
auth_provider = PlainTextAuthProvider(ASTRA_DB_CLIENT_ID, ASTRA_DB_CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider, protocol_version=4)

def main(req: func.HttpRequest) -> func.HttpResponse:    
    
    session = cluster.connect()

    row = session.execute("SELECT cql_version FROM system.local WHERE key = 'local';").one()
    cql_version = row[0]   
 
    logging.info(f"{cql_version} Success")
   
    return func.HttpResponse(f"{cql_version} Success")
```
You can learn more about the code above by reading the [**python-driver**](https://github.com/datastax/python-driver) documentation. Note that `secure-connect-bundle-for-your-database.zip` must be replaced with a correct file name for your secure connect bundle.

### <span class="nosurface" markdown="1">✅ 2.</span> Deploy the function.

1. Use Astra CLI to deploy the updated function:
```bash
func azure functionapp publish <APP_NAME>
```

2. On the Microsoft Azure portal, find the newly deployed function:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-driver/deploy.png" />

### <span class="nosurface" markdown="1">✅ 3.</span> Test the function.

1. Under **Developer**, select **Code + Test** and then **Test/Run**. Locate the **Run** button:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-driver/test-function.png" />


2. Click **Run** and observe the output and logs:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-driver/test-results.png" /><br/>
Notice the CQL version output **3.4.5** and status code **200**.


## Using Python SDK

<div class="counterReset" markdown="1">

### <span class="nosurface" markdown="1">✅ 1.</span> Create a function.

1. Follow [the Quickstart](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-python) to create a Python function in Azure from the command line using the `v1` Python programming model and Azure CLI. Complete all the steps to successfully deploy and test the function in Azure.

2. Use Azure CLI to add these runtime environment variables to the application settings:
    - `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
    - `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
    - `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above).
```bash

az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings "ASTRA_DB_ID=0c2f6f34-41ea-..."

az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings "ASTRA_DB_REGION=us-east1"

az functionapp config appsettings set --name <APP_NAME> --resource-group <RESOURCE_GROUP_NAME> --settings "ASTRA_DB_APPLICATION_TOKEN=AstraCS:avDWzU..."
```
Note that `<APP_NAME>` and `<RESOURCE_GROUP_NAME>` must be replaced with correct application and resurce group names used in the previous step. Similarly, `ASTRA_DB_ID`, `ASTRA_DB_REGION` and `ASTRA_DB_APPLICATION_TOKEN` must be assigned correct values associated with your database.

3. Add [**AstraPy**](https://github.com/datastax/astrapy), a Pythonic SDK for DataStax Astra and Stargate, to the `requirements.txt` file:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-sdk/requirements_txt.png" />

4. Replace the `__init__.py` content with:
```python
from astrapy.rest import create_client, http_methods
import logging
import azure.functions as func
import os

ASTRA_DB_ID = os.environ['ASTRA_DB_ID']
ASTRA_DB_REGION = os.environ['ASTRA_DB_REGION']
ASTRA_DB_APPLICATION_TOKEN = os.environ['ASTRA_DB_APPLICATION_TOKEN']

astra_http_client = create_client(astra_database_id=ASTRA_DB_ID,
                                  astra_database_region=ASTRA_DB_REGION,
                                  astra_application_token=ASTRA_DB_APPLICATION_TOKEN)

def main(req: func.HttpRequest) -> func.HttpResponse:    
    
    res = astra_http_client.request(
        method=http_methods.GET,
        path=f"/api/rest/v2/keyspaces/system/local/local"
    )
    cql_version = res["data"][0]['cql_version']   
 
    logging.info(f"{cql_version} Success")
   
    return func.HttpResponse(f"{cql_version} Success")
```
You can learn more about the code above by reading the [AstraPy](https://github.com/datastax/astrapy) documentation.


### <span class="nosurface" markdown="1">✅ 2.</span> Deploy the function.

1. Use Astra CLI to deploy the updated function:
```bash
func azure functionapp publish <APP_NAME>
```

2. On the Microsoft Azure portal, find the newly deployed function:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-sdk/deploy.png" />

### <span class="nosurface" markdown="1">✅ 3.</span> Test the function.

1. Under **Developer**, select **Code + Test** and then **Test/Run**. Locate the **Run** button:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-sdk/test-function.png" />


2. Click **Run** and observe the output and logs:
<br/><img src="https://awesome-astra.github.io/docs/img/azure-functions-python-sdk/test-results.png" /><br/>
Notice the CQL version output **3.4.5** and status code **200**.

</div>

