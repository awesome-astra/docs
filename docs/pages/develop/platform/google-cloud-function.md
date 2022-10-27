---
title: "Google Cloud Functions"
description: "Cloud Functions is Google's function-as-a-service offering that provides a serverless execution environment for your code. Cloud Functions are commonly used to extend Astra DB with additional data processing capabilities and connect Astra DB with other cloud services into data pipelines."
tags: "FaaS, serverless, GCP, Java, Python"
icon: "https://awesome-astra.github.io/docs/img/google-cloud-functions/google-cloud-functions.svg"
developer_title: "Google Cloud Functions"
developer_url: "https://cloud.google.com/functions"
links:
- title: "foo"
  url: "http://google.com"
- title: "bar"
  url: "http://yahoo.com"
---

<div class="nosurface" markdown="1">
# Google Cloud Functions
</div>

## Overview

[Cloud Functions](https://cloud.google.com/functions) is Google's function-as-a-service offering that provides a serverless execution environment for your code. Cloud Functions are commonly used to:

- Extend Astra DB with additional data processing capabilities, such as aggregating, summarizing and validating data periodically;
- Connect Astra DB with other cloud services into data pipelines that move, process and analyze data.

## Prerequisites

- [Create an Astra Database](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
- [Create an Astra Token](https://awesome-astra.github.io/docs/pages/astra/create-token/)
- [Download a Secure Connect Bundle](https://awesome-astra.github.io/docs/pages/astra/download-scb/)
- Optionally, if you are new to Cloud Functions, practice [creating a simpler function](https://cloud.google.com/functions/docs/quickstart-python) first

## Using Python Driver

### <span class="nosurface" markdown="1">✅ 1.</span> Create a secret with the secure connect bundle file.

1. Go to [the Secret Manager page](https://console.cloud.google.com/security/secret-manager), select a project that has Secret Manager and Cloud Functions enabled, and click **Create secret**.

2. Give a **Name** to the secret and upload the secure connect bundle file as a **Secret value**. (See the **Prerequisites** section above if you need to download your secure connect bundle.) Optionally, customize other secret management settings.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/create-secret.png" />

3. Click **Create secret**.

4. On [the Secret Manager page](https://console.cloud.google.com/security/secret-manager), find the newly created secret.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/secret-manager.png" />

### <span class="nosurface" markdown="1">✅ 2.</span> Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select the same project that has Secret Manager and Cloud Functions enabled, and click **Create function**.
2. Under the **Basics** section, specify preferred **Function name** and **Region**.
3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:

    - `ASTRA_DB_CLIENT_ID`: A **Client ID** is generated together with an application token (see the **Prerequisites** section above).
    - `ASTRA_DB_CLIENT_SECRET`: A **Client secret** is generated together with an application token (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/runtime.png" /><br/>
Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage a client secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field.

6. Under the **Runtime, build, connections and security settings** section and the **Security**, click **Reference a secret**. Select the previously created **Secret** with the secure connect bundle file, **Grant** the service account access to the secret, if needed, use **Mounted as volume** in the **Reference method** field, and enter **secrets** in the **Mount path** field.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/reference-secret.png" /><br/>
Notice the final **Path** that should be used to access the secure connect bundle in the function code.

7. Click **Done** and **Next**.

8. Select **Python 3.7** or your preferred version in the **Runtime** field.

9. Select **Inline Editor** in the **Source code** field.

10. Enter **query_astra_db** in the **Entry point** field.

11. Add [**cassandra-driver**](https://github.com/datastax/python-driver), a Python client library for Apache Cassandra, DataStax Astra DB and DataStax Enterprise, to the `requirements.txt` file.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/requirements_txt.png" />

12. Replace the `main.py` content with:
```python
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import os

ASTRA_DB_CLIENT_ID = os.environ.get('ASTRA_DB_CLIENT_ID')
ASTRA_DB_CLIENT_SECRET = os.environ.get('ASTRA_DB_CLIENT_SECRET')

cloud_config= {
    'secure_connect_bundle': '/secrets/secure-connect-secret',
    'use_default_tempdir': True
}
auth_provider = PlainTextAuthProvider(ASTRA_DB_CLIENT_ID, ASTRA_DB_CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider, protocol_version=4)

def query_astra_db(request):

    session = cluster.connect()

    row = session.execute("SELECT cql_version FROM system.local WHERE key = 'local';").one()
    print(row[0])

    print ('Success')
```
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/main_py.png" /><br/>
You can learn more about the code above by reading the [**python-driver**](https://github.com/datastax/python-driver) documentation.

### <span class="nosurface" markdown="1">✅ 3.</span> Deploy the function.

1. Click **Deploy**.

2. On the Cloud Functions Overview page, find the newly deployed function.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/deploy.png" />

### <span class="nosurface" markdown="1">✅ 4.</span> Test the function.

1. Under **Actions**, select **Test function**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/test-results.png" /><br/>
Notice the CQL version output **3.4.5** and status code **200**.

### <span class="nosurface" markdown="1">✅ 5.</span> View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/logs.png" />
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-driver/logs-explorer.png" />

## Using Python SDK

<div class="counterReset">

### <span class="nosurface" markdown="1">✅ 1.</span> Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select a project that has Cloud Functions enabled, and click **Create function**.

2. Under the **Basics** section, specify preferred **Function name** and **Region**.

3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:
    - `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
    - `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
    - `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/runtime.png" /><br/>
Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage an application token as a secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field.

6. Click **Next**.

7. Select **Python 3.7** or your preferred version in the **Runtime** field.

8. Select **Inline Editor** in the **Source code** field.

9. Enter **query_astra_db** in the **Entry point** field.

10. Add [**AstraPy**](https://github.com/datastax/astrapy), a Pythonic SDK for DataStax Astra and Stargate, and its preferred version to the `requirements.txt` file.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/requirements_txt.png" />

11. Replace the `main.py` content with:
```python
from astrapy.rest import create_client, http_methods
import os

ASTRA_DB_ID = os.environ.get('ASTRA_DB_ID')
ASTRA_DB_REGION = os.environ.get('ASTRA_DB_REGION')
ASTRA_DB_APPLICATION_TOKEN = os.environ.get('ASTRA_DB_APPLICATION_TOKEN')

astra_http_client = create_client(astra_database_id=ASTRA_DB_ID,
                                  astra_database_region=ASTRA_DB_REGION,
                                  astra_application_token=ASTRA_DB_APPLICATION_TOKEN)

def query_astra_db(request):

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
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/main_py.png" /><br/>
You can learn more about the code above by reading the [AstraPy](https://github.com/datastax/astrapy) documentation.


### <span class="nosurface" markdown="1">✅ 2.</span> Deploy the function.

1. Click **Deploy**.

2. On the Cloud Functions Overview page, find the newly deployed function.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/deploy.png" />

### <span class="nosurface" markdown="1">✅ 3.</span> Test the function.

1. Under **Actions**, select **Test function**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/test-results.png" /><br/>
Notice the CQL version output **3.4.5** and status code **200**.

### <span class="nosurface" markdown="1">✅ 4.</span> View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/logs.png" />
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-python-sdk/logs-explorer.png" />

</div>

## Using Java Driver

<div class="counterReset">

### <span class="nosurface" markdown="1">✅ 1.</span> Create a secret with the secure connect bundle file.

1. Go to [the Secret Manager page](https://console.cloud.google.com/security/secret-manager), select a project that has Secret Manager and Cloud Functions enabled, and click **Create secret**.

2. Give a **Name** to the secret and upload the secure connect bundle file as a **Secret value**. (See the **Prerequisites** section above if you need to download your secure connect bundle.) Optionally, customize other secret management settings.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/create-secret.png" />

3. Click **Create secret**.

4. On [the Secret Manager page](https://console.cloud.google.com/security/secret-manager), find the newly created secret.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/secret-manager.png" />

### <span class="nosurface" markdown="1">✅ 2.</span> Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select the same project that has Secret Manager and Cloud Functions enabled, and click **Create function**.
2. Under the **Basics** section, specify preferred **Function name** and **Region**.
3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:

    - `ASTRA_DB_CLIENT_ID`: A **Client ID** is generated together with an application token (see the **Prerequisites** section above).
    - `ASTRA_DB_CLIENT_SECRET`: A **Client secret** is generated together with an application token (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/runtime.png" /><br/>
Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage a client secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field.

6. Under the **Runtime, build, connections and security settings** section and the **Security**, click **Reference a secret**. Select the previously created **Secret** with the secure connect bundle file, **Grant** the service account access to the secret, if needed, use **Mounted as volume** in the **Reference method** field, and enter **secrets** in the **Mount path** field.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/reference-secret.png" /><br/>
Notice the final **Path** that should be used to access the secure connect bundle in the function code.

7. Click **Done** and **Next**.

8. Select **Java 11** or your preferred version in the **Runtime** field.

9. Select **Inline Editor** in the **Source code** field.

10. Enter **com.example.AstraDBFunction** in the **Entry point** field.

11. Add [**java-driver**](https://github.com/datastax/java-driver), a Java client library for Apache Cassandra, DataStax Astra DB and DataStax Enterprise, to the `pom.xml` file:
```xml
    <dependency>
      <groupId>com.datastax.oss</groupId>
      <artifactId>java-driver-core</artifactId>
      <version>4.13.0</version>
    </dependency>  
```
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/pom_xml.png" />

12. Rename the `Example.java` file to `AstraDBFunction.java` and replace its content with:
```java
package com.example;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import java.io.BufferedWriter;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import java.nio.file.Paths;

public class AstraDBFunction implements HttpFunction {

  public static final String ASTRA_DB_CLIENT_ID = System.getenv("ASTRA_DB_CLIENT_ID");
  public static final String ASTRA_DB_CLIENT_SECRET = System.getenv("ASTRA_DB_CLIENT_SECRET");

  public static CqlSession session = CqlSession.builder()
           .withCloudSecureConnectBundle(Paths.get("/secrets/secure-connect-secret"))
           .withAuthCredentials(ASTRA_DB_CLIENT_ID,ASTRA_DB_CLIENT_SECRET)
           .build();

  public void service(HttpRequest request, HttpResponse response) throws Exception {

    BufferedWriter writer = response.getWriter();
         
    ResultSet rs = session.execute("SELECT cql_version FROM system.local WHERE key = 'local';");
    Row row = rs.one();
    writer.write( row.getString("cql_version") );
   
    writer.newLine();
    writer.write("Success");
  }
}
```
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/source_code.png" /><br/>
You can learn more about the code above by reading the [**java-driver**](https://github.com/datastax/java-driver) documentation.

### <span class="nosurface" markdown="1">✅ 3.</span> Deploy the function.

1. Click **Deploy**.

2. On the Cloud Functions Overview page, find the newly deployed function.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/deploy.png" />

### <span class="nosurface" markdown="1">✅ 4.</span> Test the function.

1. Under **Actions**, select **Test function**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/test-results.png" /><br/>
Notice the CQL version output **3.4.5** and status code **200**.

### <span class="nosurface" markdown="1">✅ 5.</span> View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/logs.png" />
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-driver/logs-explorer.png" />

</div>

## Using Java gRPC

<div class="counterReset">

### <span class="nosurface" markdown="1">✅ 1.</span> Create a function.

1. Go to [the Functions Overview page](https://console.cloud.google.com/functions/list), select a project that has Cloud Functions enabled, and click **Create function**.
2. Under the **Basics** section, specify preferred **Function name** and **Region**.
3. Under the **Trigger** section, select **HTTP**, **Allow unauthenticated invocations**, and **Require HTTPS**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/basics.png" />

4. Click **Save**.

5. Under the **Runtime, build, connections and security settings** section, customize additional settings and create these **Runtime environment variables**:
    - `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
    - `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
    - `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/runtime.png" /><br/>
Note that, for better security, you can alternatively use the [Secret Manager](https://console.cloud.google.com/security/secret-manager) service to store and manage an application token as a secret. A secret can then be similarly exposed as an environment variable. The settings can be found under the **Runtime, build, connections and security settings** section, the **Security** tab, and the **Secrets** field.

6. Click **Next**.

7. Select **Java 11** or your preferred version in the **Runtime** field.

8. Select **Inline Editor** in the **Source code** field.

9. Enter **com.example.AstraDBFunction** in the **Entry point** field.

10. Add gRPC dependencies to the `pom.xml` file:
```xml
    <dependency>
      <groupId>io.stargate.grpc</groupId>
      <artifactId>grpc-proto</artifactId>
      <version>1.0.41</version>
    </dependency>
    <dependency>
      <groupId>io.grpc</groupId>
      <artifactId>grpc-netty-shaded</artifactId>
      <version>1.41.0</version>
    </dependency>   
```
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/pom_xml.png" />

11. Rename the `Example.java` file to `AstraDBFunction.java` and replace its content with:
```java
package com.example;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import java.io.BufferedWriter;

import java.util.concurrent.TimeUnit;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.stargate.grpc.StargateBearerToken;
import io.stargate.proto.QueryOuterClass;
import io.stargate.proto.QueryOuterClass.Row;
import io.stargate.proto.StargateGrpc;

public class AstraDBFunction implements HttpFunction {

  public static final String ASTRA_DB_TOKEN    = System.getenv("ASTRA_DB_APPLICATION_TOKEN");
  public static final String ASTRA_DB_ID       = System.getenv("ASTRA_DB_ID");
  public static final String ASTRA_DB_REGION   = System.getenv("ASTRA_DB_REGION");
  
  public static ManagedChannel channel = ManagedChannelBuilder
            .forAddress(ASTRA_DB_ID + "-" + ASTRA_DB_REGION + ".apps.astra.datastax.com", 443)
            .useTransportSecurity()
            .build();

  public static StargateGrpc.StargateBlockingStub blockingStub =
        StargateGrpc.newBlockingStub(channel).withCallCredentials(new StargateBearerToken(ASTRA_DB_TOKEN));

  public void service(HttpRequest request, HttpResponse response) throws Exception {

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
        .Query.newBuilder()
        .setCql("SELECT cql_version FROM system.local WHERE key = 'local';")
        .build());

    QueryOuterClass.ResultSet rs = queryString.getResultSet();

    BufferedWriter writer = response.getWriter();
    writer.write( rs.getRows(0).getValues(0).getString() );
    writer.newLine();
    writer.write("Success");
  }
}
```
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/source_code.png" /><br/>
You can learn more about the code above by reading the [**Stargate**](https://stargate.io/) documentation.

### <span class="nosurface" markdown="1">✅ 2.</span> Deploy the function.

1. Click **Deploy**.

2. On the Cloud Functions Overview page, find the newly deployed function.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/deploy.png" />

### <span class="nosurface" markdown="1">✅ 3.</span> Test the function.

1. Under **Actions**, select **Test function**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/test-function.png" />

2. On the testing page, click **Test the function** and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/test-results.png" /><br/>
Notice the CQL version output **3.4.5** and status code **200**.

### <span class="nosurface" markdown="1">✅ 4.</span> View logs.

You can further explore the log history by either clicking on the **Logs** tab or the **View all logs** link that opens **Logs Explorer**.
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/logs.png" />
<br/><img src="https://awesome-astra.github.io/docs/img/google-cloud-functions-java-grpc/logs-explorer.png" />

</div>