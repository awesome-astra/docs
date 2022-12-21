---
title: "AWS Lambda Functions"
description: "AWS Lambda is AWS's function-as-a-service offering that provides a serverless execution environment for your code. AWS Lambda are commonly used to extend Astra DB with additional data processing capabilities and connect Astra DB with other cloud services into data pipelines."
tags: "FaaS, serverless, AWS, Java, Python"
icon: "https://awesome-astra.github.io/docs/img/aws-lambda-functions/aws-lambda.svg"
developer_title: "AWS Lambda Functions"
developer_url: "https://docs.aws.amazon.com/lambda/"
---

<div class="nosurface" markdown="1">
# AWS Lambda Functions
</div>

## Overview

[AWS Lambda](https://docs.aws.amazon.com/lambda/) is AWS' function-as-a-service offering that provides a serverless execution environment for your code. AWS Lambda functions are commonly used to:

- Extend Astra DB with additional data processing capabilities, such as aggregating, summarizing and validating data periodically;
- Connect Astra DB with other cloud services into data pipelines that move, process and analyze data.

## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
    <li>Optionally, if you are new to AWS Lambda, practice <a href="https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html">creating a simpler function</a> first.</li>
</ul>

## Using Python Driver

<div class="counterReset" markdown="1">

### <span class="nosurface" markdown="1">✅ 1. </span> Create a deployment package.

A deployment package is a `.zip` file with a function source code and dependencies. To access Astra DB from a function using Python Driver, we must add [**cassandra-driver**](https://github.com/datastax/python-driver), a Python client library for Apache Cassandra, DataStax Astra DB and DataStax Enterprise, as a dependency. In addition, as part of the deployment package, we need to include a secure connect bundle for a database in Astra DB that we want to query.

1. Open a command prompt and create a project directory:
```bash
mkdir lambda-astra-db-project
cd lambda-astra-db-project
```

2. Create file `lambda_function.py` with the function source code:
```python
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import os

ASTRA_DB_CLIENT_ID = os.environ.get('ASTRA_DB_CLIENT_ID')
ASTRA_DB_CLIENT_SECRET = os.environ.get('ASTRA_DB_CLIENT_SECRET')

cloud_config= {
    'secure_connect_bundle': 'secure-connect-bundle-for-your-database.zip',
    'use_default_tempdir': True
}
auth_provider = PlainTextAuthProvider(ASTRA_DB_CLIENT_ID, ASTRA_DB_CLIENT_SECRET)
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider, protocol_version=4)
session = cluster.connect()

def lambda_handler(event, context):

    row = session.execute("SELECT cql_version FROM system.local WHERE key = 'local';").one()
    cql_version = row[0]

    print(cql_version) 
    print('Success')

    return cql_version
```
You can learn more about the code above by reading the [**cassandra-driver**](https://github.com/datastax/python-driver) documentation.

3. Install the [**cassandra-driver**](https://github.com/datastax/python-driver) library:
```bash
pip install --target . cassandra-driver
```

4. [Download the Secure Connect Bundle](https://awesome-astra.github.io/docs/pages/astra/download-scb/) for your database and copy it into the project directory.

5. Create a deployment package with `lambda_function.py`, `cassandra-driver`, and secure connect bundle:
```bash
zip -r lambda-astra-db-deployment-package.zip .
```

### <span class="nosurface" markdown="1">✅ 2. </span> Create a function.

1. Go to [the Functions page](https://console.aws.amazon.com/lambda/home#/functions) of the Lambda console and click **Create function**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/functions-page.png" />

2. Choose **Author from scratch**.

3. Under the **Basic information** section, specify preferred **Function name**, **Runtime**, and **Architecture**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/create-function.png" />

4. Click **Create function**.

5. Under the **Code** tab and the **Code source** section, select **Upload from** and upload the deployment package created in the previous steps.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/upload.png" /><br/>
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/upload-zip.png" />
<br/>
<br/>
Since the deployment package exceeds 3 MBs, the Console Editor may not be available to view the source code:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/too-large.png" /><br/>

6. Under the **Configuration** tab, select and create these **Environment variables**:
    - `ASTRA_DB_CLIENT_ID`: A **Client ID** is generated together with an application token (see the **Prerequisites** section above).
    - `ASTRA_DB_CLIENT_SECRET`: A **Client secret** is generated together with an application token (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/variables.png" /><br/>
Note that, for better security, you can alternatively use the [AWS Secret Manager](https://docs.aws.amazon.com/secretsmanager/index.html) service to store and manage client id and secret, and then retrieve them programmatically. 

### <span class="nosurface" markdown="1">✅ 3. </span> Test the function.

Under the **Test** tab, click the **Test** button and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-driver/test.png" /><br/>
Notice the CQL version output and return value of **3.4.5**.

</div>

## Using Python SDK

<div class="counterReset" markdown="1">

### <span class="nosurface" markdown="1">✅ 1. </span> Create a deployment package.

A deployment package is a `.zip` file with a function source code and dependencies. To access Astra DB from a function using REST API, we must add [**AstraPy**](https://github.com/datastax/astrapy), a Pythonic SDK for DataStax Astra and Stargate, as a dependency.

1. Open a command prompt and create a project directory:
```bash
mkdir lambda-astra-db-project
cd lambda-astra-db-project
```

2. Create file `lambda_function.py` with the function source code:
```python
from astrapy.rest import create_client, http_methods
import os

ASTRA_DB_ID = os.environ.get('ASTRA_DB_ID')
ASTRA_DB_REGION = os.environ.get('ASTRA_DB_REGION')
ASTRA_DB_APPLICATION_TOKEN = os.environ.get('ASTRA_DB_APPLICATION_TOKEN')

astra_http_client = create_client(astra_database_id=ASTRA_DB_ID,
                                  astra_database_region=ASTRA_DB_REGION,
                                  astra_application_token=ASTRA_DB_APPLICATION_TOKEN)

def lambda_handler(event, context):

    res = astra_http_client.request(
        method=http_methods.GET,
        path=f"/api/rest/v2/keyspaces/system/local/local"
    )
    cql_version = res["data"][0]['cql_version']

    print(cql_version) 
    print('Success')

    return cql_version
```
You can learn more about the code above by reading the [AstraPy](https://github.com/datastax/astrapy) documentation.

3. Install the [**AstraPy**](https://github.com/datastax/astrapy) library:
```bash
pip install --target . astrapy
```

4. Create a deployment package with `lambda_function.py` and `astrapy`:
```bash
zip -r lambda-astra-db-deployment-package.zip .
```

### <span class="nosurface" markdown="1">✅ 2. </span> Create a function.

1. Go to [the Functions page](https://console.aws.amazon.com/lambda/home#/functions) of the Lambda console and click **Create function**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/functions-page.png" />

2. Choose **Author from scratch**.

3. Under the **Basic information** section, specify preferred **Function name**, **Runtime**, and **Architecture**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/create-function.png" />

4. Click **Create function**.

5. Under the **Code** tab and the **Code source** section, select **Upload from** and upload the deployment package created in the previous steps.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/upload.png" /><br/>
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/upload-zip.png" />

6. Verify that the uploaded function has the correct `lambda_function.py` and dependencies:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/lambda_function_py.png" /><br/>
You can learn more about the code above by reading the [AstraPy](https://github.com/datastax/astrapy) documentation.

7. Click **Deploy** to deploy the function.

8. Under the **Configuration** tab, select and create these **Environment variables**:
    - `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
    - `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
    - `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/variables.png" /><br/>
Note that, for better security, you can alternatively use the [AWS Secret Manager](https://docs.aws.amazon.com/secretsmanager/index.html) service to store and manage an application token as a secret. A secret can then be retrieved programmatically. 

### <span class="nosurface" markdown="1">✅ 3. </span> Test the function.

Under the **Test** tab, click the **Test** button and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-python-sdk/test.png" /><br/>
Notice the CQL version output and return value of **3.4.5**.

</div>

## Using Java Driver

<div class="counterReset" markdown="1">

### <span class="nosurface" markdown="1">✅ 1. </span> Create a deployment package.

A deployment package is a `.zip` or `.jar` file archive with compiled function code and dependencies. In this tutorial, we use [Apache Maven™](https://maven.apache.org/) to create, compile and package a function into a `.jar` file. We need to include the following pieces into a deployment package to access Astra DB from an AWS Lambda function: a) [**aws-lambda-java-core**](https://github.com/aws/aws-lambda-java-libs/tree/master/aws-lambda-java-core) that defines necessary interfaces and classes to create functions; b) [**java-driver**](https://github.com/datastax/java-driver) that enables connectivity to Apache Cassandra, DataStax Astra DB and DataStax Enterprise; and c) [**secure connect bundle**](https://awesome-astra.github.io/docs/pages/astra/download-scb/) for a database in Astra DB that we want to query.

1. Open a command prompt and create a new project using [Apache Maven™](https://maven.apache.org/):
```bash
mvn archetype:generate -DgroupId=com.example -DartifactId=AstraDBFunction -DinteractiveMode=false
```

2. Rename file `App.java` to `AstraDBFunction.java` and replace its content with the function source code:
```java
package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.LambdaLogger;

import com.datastax.oss.driver.api.core.CqlSession;
import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import java.nio.file.Paths;

import java.util.Map;

public class AstraDBFunction implements RequestHandler<Map<String,String>, String>{

  private static final String ASTRA_DB_CLIENT_ID = System.getenv("ASTRA_DB_CLIENT_ID");
  private static final String ASTRA_DB_CLIENT_SECRET = System.getenv("ASTRA_DB_CLIENT_SECRET");

  private static CqlSession session = CqlSession.builder()
           .withCloudSecureConnectBundle(Paths.get("secure-connect-bundle-for-your-database.zip"))
           .withAuthCredentials(ASTRA_DB_CLIENT_ID,ASTRA_DB_CLIENT_SECRET)
           .build();
           
  public String handleRequest(Map<String,String> event, Context context)
  {
    LambdaLogger logger = context.getLogger();
     
    ResultSet rs = session.execute("SELECT cql_version FROM system.local WHERE key = 'local';");
    Row row = rs.one();
    String response = row.getString("cql_version");
    
    logger.log(response + " Success \n"); 

    return response;
  }  
}
```
You can learn more about the code above by reading the [**java-driver**](https://github.com/datastax/java-driver) documentation.

3. In the project directory, under `/src/main`, create directory `resources`.

4. [Download the Secure Connect Bundle](https://awesome-astra.github.io/docs/pages/astra/download-scb/) for your database and copy it into the `resources` directory. The project directory structure should look like this:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/project-structure.png" />

5. Add AWS Lambda and Java Driver dependencies to the `pom.xml` file:
```xml
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-lambda-java-core</artifactId>
      <version>1.2.1</version>
    </dependency>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-lambda-java-events</artifactId>
      <version>3.11.0</version>
    </dependency>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-lambda-java-log4j2</artifactId>
      <version>1.5.1</version>
    </dependency>
    <dependency>
      <groupId>com.datastax.oss</groupId>
      <artifactId>java-driver-core</artifactId>
      <version>4.14.1</version>
    </dependency>  
```

6. Add or replace an existing `build` section in the `pom.xml` file with the following:
```xml
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>2.22.2</version>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.2.2</version>
        <configuration>
          <createDependencyReducedPom>false</createDependencyReducedPom>
          <filters>
            <filter>
               <artifact>*:*</artifact>
               <excludes>
                  <exclude>**/Log4j2Plugins.dat</exclude>
               </excludes>
            </filter>
          </filters>
        </configuration>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
           <source>1.8</source>
           <target>1.8</target>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

7. Run the Maven command in the project directory to compile code and create a `.jar` file:
```bash
 mvn clean compile package
```
Find the deployment package file `AstraDBFunction-1.0-SNAPSHOT.jar` under the `target` directory:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/final-project-structure.png" />

### <span class="nosurface" markdown="1">✅ 2. </span> Create a function.

1. Go to [the Functions page](https://console.aws.amazon.com/lambda/home#/functions) of the Lambda console and click **Create function**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/functions-page.png" />

2. Choose **Author from scratch**.

3. Under the **Basic information** section, specify preferred **Function name**, **Runtime**, and **Architecture**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/create-function.png" />

4. Click **Create function**.

5. Under the **Code** tab and the **Code source** section, select **Upload from** and upload the deployment package created in the previous steps.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/upload.png" /><br/>
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/upload-jar.png" />
<br/>
<br/>
Since the deployment package exceeds 3 MBs, the Console Editor may not be available to view the source code:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/too-large.png" /><br/>

6. Under the **Code** tab, change **Handler** in section **Runtime settings** to `com.example.AstraDBFunction::handleRequest`:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/handler.png" />

7. Under the **Configuration** tab, select and create these **Environment variables**:
    - `ASTRA_DB_CLIENT_ID`: A **Client ID** is generated together with an application token (see the **Prerequisites** section above).
    - `ASTRA_DB_CLIENT_SECRET`: A **Client secret** is generated together with an application token (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/variables.png" /><br/>
Note that, for better security, you can alternatively use the [AWS Secret Manager](https://docs.aws.amazon.com/secretsmanager/index.html) service to store and manage client id and secret, and then retrieve them programmatically. <br/>

### <span class="nosurface" markdown="1">✅ 3. </span> Test the function.

Under the **Test** tab, click the **Test** button and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-driver/test.png" /><br/>
Notice the CQL version output and return value of **3.4.5**.

</div>

## Using Java gRPC

<div class="counterReset" markdown="1">

### <span class="nosurface" markdown="1">✅ 1. </span> Create a deployment package.

A deployment package is a `.zip` or `.jar` file archive with compiled function code and dependencies. In this tutorial, we use [Apache Maven™](https://maven.apache.org/) to create, compile and package a function into a `.jar` file. We need to include the following pieces into a deployment package to access Astra DB from an AWS Lambda function: a) [**aws-lambda-java-core**](https://github.com/aws/aws-lambda-java-libs/tree/master/aws-lambda-java-core) that defines necessary interfaces and classes to create functions; b) [**Stargate**](https://stargate.io/) that enables connectivity to Apache Cassandra, DataStax Astra DB and DataStax Enterprise; and c) [**gRPC**](https://grpc.io/) that works as a high performance Remote Procedure Call (RPC) framework.

1. Open a command prompt and create a new project using [Apache Maven™](https://maven.apache.org/):
```bash
mvn archetype:generate -DgroupId=com.example -DartifactId=AstraDBFunction -DinteractiveMode=false
```
<br/>
The project directory structure should look like this:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/project-structure.png" />

2. Rename file `App.java` to `AstraDBFunction.java` and replace its content with the function source code:
```java
package com.example;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.LambdaLogger;

import java.util.Map;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.stargate.grpc.StargateBearerToken;
import io.stargate.proto.QueryOuterClass;
import io.stargate.proto.QueryOuterClass.Row;
import io.stargate.proto.StargateGrpc;

public class AstraDBFunction implements RequestHandler<Map<String,String>, String>{

  private static final String ASTRA_DB_TOKEN    = System.getenv("ASTRA_DB_APPLICATION_TOKEN");
  private static final String ASTRA_DB_ID       = System.getenv("ASTRA_DB_ID");
  private static final String ASTRA_DB_REGION   = System.getenv("ASTRA_DB_REGION");
  
  public static ManagedChannel channel = ManagedChannelBuilder
            .forAddress(ASTRA_DB_ID + "-" + ASTRA_DB_REGION + ".apps.astra.datastax.com", 443)
            .useTransportSecurity()
            .build();

  public static StargateGrpc.StargateBlockingStub blockingStub =
        StargateGrpc.newBlockingStub(channel).withCallCredentials(new StargateBearerToken(ASTRA_DB_TOKEN));

  public String handleRequest(Map<String,String> event, Context context)
  {
    LambdaLogger logger = context.getLogger();

    QueryOuterClass.Response queryString = blockingStub.executeQuery(QueryOuterClass
        .Query.newBuilder()
        .setCql("SELECT cql_version FROM system.local WHERE key = 'local';")
        .build());

    QueryOuterClass.ResultSet rs = queryString.getResultSet();
    String response = rs.getRows(0).getValues(0).getString();

    logger.log(response + " Success \n"); 

    return response;
  }  
}
```
You can learn more about the code above by reading the [**Stargate**](https://stargate.io/) documentation.

3. Add AWS Lambda, Stargate and gRPC dependencies to the `pom.xml` file:
```xml
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-lambda-java-core</artifactId>
      <version>1.2.1</version>
    </dependency>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-lambda-java-events</artifactId>
      <version>3.11.0</version>
    </dependency>
    <dependency>
      <groupId>com.amazonaws</groupId>
      <artifactId>aws-lambda-java-log4j2</artifactId>
      <version>1.5.1</version>
    </dependency>
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

4. Add or replace an existing `build` section in the `pom.xml` file with the following:
```xml
  <build>
    <plugins>
      <plugin>
        <artifactId>maven-surefire-plugin</artifactId>
        <version>2.22.2</version>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.2.2</version>
        <configuration>
          <createDependencyReducedPom>false</createDependencyReducedPom>
        </configuration>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
           <source>1.8</source>
           <target>1.8</target>
        </configuration>
      </plugin>
    </plugins>
  </build>
```

5. Run the Maven command in the project directory to compile code and create a `.jar` file:
```bash
 mvn clean compile package
```
Find the deployment package file `AstraDBFunction-1.0-SNAPSHOT.jar` under the `target` directory:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/final-project-structure.png" />

### <span class="nosurface" markdown="1">✅ 2. </span> Create a function.

1. Go to [the Functions page](https://console.aws.amazon.com/lambda/home#/functions) of the Lambda console and click **Create function**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/functions-page.png" />

2. Choose **Author from scratch**.

3. Under the **Basic information** section, specify preferred **Function name**, **Runtime**, and **Architecture**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/create-function.png" />

4. Click **Create function**.

5. Under the **Code** tab and the **Code source** section, select **Upload from** and upload the deployment package created in the previous steps.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/upload.png" /><br/>
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/upload-jar.png" />
<br/>
<br/>
Since the deployment package exceeds 3 MBs, the Console Editor may not be available to view the source code:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/too-large.png" /><br/>

6. Under the **Code** tab, change **Handler** in section **Runtime settings** to `com.example.AstraDBFunction::handleRequest`:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/handler.png" />

7. Under the **Configuration** tab, select and create these **Environment variables**:
    - `ASTRA_DB_ID`: A **Database ID** value can be found on the [Astra DB](https://astra.datastax.com/) dashboard.
    - `ASTRA_DB_REGION`: A **Region** name can be found on the overview page for a specific [Astra DB](https://astra.datastax.com/) database.
    - `ASTRA_DB_APPLICATION_TOKEN`: An **Application Token** can be generated for a specific [Astra DB](https://astra.datastax.com/) database (see the **Prerequisites** section above).
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/variables.png" /><br/>
Note that, for better security, you can alternatively use the [AWS Secret Manager](https://docs.aws.amazon.com/secretsmanager/index.html) service to store and manage an application token as a secret. A secret can then be retrieved programmatically.
<br/>

### <span class="nosurface" markdown="1">✅ 3. </span> Test the function.

Under the **Test** tab, click the **Test** button and observe the output.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-lambda-functions-java-grpc/test.png" /><br/>
Notice the CQL version output and return value of **3.4.5**.

</div>