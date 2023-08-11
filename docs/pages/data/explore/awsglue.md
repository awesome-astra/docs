---
title: "AWS Glue"
description: "AWS Glue is an ETL (Spark) system to allow you to extract, transform and load data into Amazon datastores (ETL).  By importing Astra data into Glue you can then take the data and push it into Redshift, Sagemaker, or other AWS Services."
tags: "jdbc, data management, ide"
icon: "https://awesome-astra.github.io/docs/img/awsglue/awsglue.svg"
developer_title: "AWSGlue"
developer_url: "https://console.aws.com/"
links:
- title: "Amazon Glue Docs"
  url: "https://docs.aws.amazon.com/glue/index.html"
---


<div class="nosurface" markdown="1">

<details>
<summary><b> 📖 Reference Documentation and Resources</b></summary>
<ol>
<li><a href="https://docs.aws.amazon.com/glue/index.html">AWS Glue Documentation</a>
</ol>
</details>
</div>

## Overview

AWS Glue is a serverless data integration service that makes it easy for analytics users to discover, prepare, move, and integrate data from multiple sources. You can use it for analytics, machine learning, and application development. It also includes additional productivity and dataOps tooling for authoring, running jobs, and implementing business workflows.

With AWS Glue, you can discover and connect to more than 70 diverse data sources and manage your data in a centralized data catalog. You can visually create, run, and monitor extract, transform, and load (ETL) pipelines to load data into your data lakes. Also, you can immediately search and query cataloged data using Amazon Athena, Amazon EMR, and Amazon Redshift Spectrum.

- <span class="nosurface">ℹ️ </span>[What is Glue?](https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html)

AWS Glue uses the [Astra JDBC Driver](https://github.com/DataStax-Examples/astra-jdbc-connector/releases/download/5.0/astra-jdbc-connector-5.0-jdk8.jar) to connect to Cassandra as the storage backend. The Java driver itself supports connections to Astra DB natively.

## Prerequisites

This tutorial will take you through the process of connecting your Astra database to Glue.  This process is somewhat extensive, so please take care to read all of the instructions carefully.

<ul class="prerequisites">
  <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a>
    <ul>
      <li>Type: serverless</li>
      <li>Database: <b>astraglue_db</b></li>
      <li>keyspace: <b>astraglue_ks</b></li>
    </ul>
    </li>
  <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
  <li class="nosurface">You need an <a href="https://console.aws.amazon.com">AWS account with permissions for Glue, S3, IAM, and the AWS Secrets Manager</a>
</ul>

# Step 1 - Setup

## <span class="nosurface">✅ Step 1.1: </span> Put data in your database
1. From the Astra homepage, select your **astraglue_db** database from the list on the left hand side.
2. Click the **Load Data** button at the top of the page.
3. Download this sample <a href="https://awesome-astra.github.io/docs/assets/attachments/demographics.csv">CSV file</a>.
4. Drag the CSV file onto the file drop area and then click the **Next** button.
5. Scroll to the bottom and choose a partition key (**country_name**).
6. For "Target Keyspace" use the **astraglue_ks** you created as a prerequisite.
7. Click "Finish".
8. Move on to the next steps, the upload should be done before you need the data.

## <span class="nosurface">✅ Step 1.2: </span> Create Role in IAM

1. Open the [AWS Identity and Access Management](https://console.aws.amazon.com/iamv2/home) console.
2. In the left hand column, select Select **Roles**.

    <details>
        <summary>Show me!</summary>
        <img src="https://awesome-astra.github.io/docs/img/awsglue/IAMLeftBar.png" />
    </details>

3. On the right hand side, click the **Create Role** button.

4. For your Trusted entity type, choose  **AWS service**.  In the "Use cases for other AWS Services" type and select "Glue".

5. Select **Next**.

6. On the **Add permissions** page you will need to search for a few different permissions.  You should select the following:
    - AmazonS3FullAccess
    - AWSGlueServiceRole
    - AWSGlueConsoleFullAccess
    - SecretsManagerReadWrite
    <details>
        <summary>Show me!</summary>
        <img src="https://awesome-astra.github.io/docs/img/awsglue/IAMPermissions.png" />
    </details>

7. On the Name, review, and create page, choose a name for your role (For example purposes I will use **AstraGlueRole**), then scroll to the bottom of the page and click the blue **Create role** button.

## <span class="nosurface">✅ Step 1.3: </span> Setup JDBC Driver in S3 

1. Download [Astra JDBC connector jar](https://github.com/DataStax-Examples/astra-jdbc-connector/releases/download/5.0/astra-jdbc-connector-5.0-jdk8.jar) from Github.
2. Open the [S3 Console](https://s3.console.aws.amazon.com/s3/home).
3. Click the **Create bucket** button on the right hand side.
4. Choose a bucket name - this must be unique across all accounts so you will need to pick something unique to you.
5. Choose which type of permission model to use.  I chose here to use ACLs as they are easier for managing access to buckets and their contents.
    <details>
        <summary>Show me!</summary>
        <img src="https://awesome-astra.github.io/docs/img/awsglue/s3configuration.png" />
    </details>
6. Scroll to the bottom and click the orange **Create bucket** button.
7. Open the bucket by clicking its name on the bucket listings.
8. Click the **Upload** button and follow the steps to upload the driver you just downloaded.
9. Once that's done, from the **Objects** page for your bucket in S3, click on the driver.
10. From here you can copy the S3 URI, which you will need later, or you can get it when it's needed.

## <span class="nosurface">✅ Step 1.4: </span> Secrets Manager

This assumes that you have gone through the process of getting an Astra token for your database.

1. Open the [AWS Secrets Manager](https://us-west-1.console.aws.amazon.com/secretsmanager/listsecrets) console.
2. Click the orange **Store a new secret** button on the right hand side.
3. Choose **Other type of secret**.
4. Add key/value pairs for user and password:
    - user: `token`
    - password: Your AstraCS token here
    <details>
        <summary>Show me!</summary>
        <img src="https://awesome-astra.github.io/docs/img/awsglue/secrettype.png" />
    </details>
5. Click the orange **Next** button at the bottom of the page.
6. Choose a secret name like "AstraGlueCreds" and click **Next**.
7. On the "Configure Rotation" screen just click **Next**.
8. Review the entries then click **Store**.

Ok, that was a lot of steps, great job getting things set up. Feel free to take a moment before moving on to the next section.

# Step 2 - Glue Connector

Now that all of the pieces have been put in place, it's time to create the connector and connection from Astra to Glue.

## <span class="nosurface">✅ Step 2.1: </span> Create Glue Connector

1. Open the [AWS Glue Studio](https://us-west-1.console.aws.amazon.com/gluestudio/home) console.
2. In the left hand column, click on **Data connections**.
3. Click on **Create custom connector** in the "Custom connectors" section.
4. Paste the S3 URI for your JDBC driver under **Connector S3 URL**.  If you need to retrieve this URI you can find it by browsing from the [S3 Console](https://s3.console.aws.amazon.com/s3/home).
5. Choose a **Name** for your connector.
6. Select *JDBC* as the connector type.
7. For the **Class name** enter **com.datastax.astra.jdbc.AstraJdbcDriver**.
8. The JDBC URL base is composed of the following pieces
    - jdbc:astra://<databasename>/<keyspace>?user=token&password=<YourAstraCSToken>
    - If you followed the instructions on naming your db and keyspace it will be:
        - jdbc:astra://astraglue_db/astraglue_ks?user=token&password=AstraCS:YourTokenHere
    - (yes, this is the same username/password you used in the secrets manager, just go with it)
9. For the URL parameter delimiter enter '&'.
    <details>
        <summary>Show me!</summary>
        <img src="https://awesome-astra.github.io/docs/img/awsglue/connectorProperties.png" />
    </details>
10. Click **Create connector**.

## <span class="nosurface">✅ Step 2.2: </span> Create Connection

From the **Connectors** page (**Data connections** in the left panel):

1. Click on your connector name in the central **Connectors** section.
2. Click the **Create connection** button.
3. Enter a **Name** for your connection.
4. Under **Connection credential type** select "default".
5. Under **AWS Secret - optional** choose the secret you created during setup.
6. Click the **Create connection** button at the bottom of the page.

# Step 3 - Job setup

## 3.1 - Job details
From the **Connectors** page (**Data connections** in the left panel):

1. Click on your connection name in the central **Connections** section.
2. Click the orange **Create job** button.
3. Enter a name for the job at the top of the console
4. Click on the node with your connection name in the visual editor.
5. Under **Table name** enter "demographics".
6. Click the **Data preview** tab on the right hand side of the page.
7. Click **Start data preview session** to start the data transfer.
8. Wait for it to complete.  You should see the data from the original Astra database here.  This indicates that the extraction of the data from Astra has successfully completed.
9. Click the **Output schema** tab on the right side of the page.  Choose **Use datapreview schema**.

## 3.3 - Transform
1. Click the **ApplyMapping** node in the visual editor.
2. Under **Transform** you will see the fields from the Connection node.
3. **Output schema** shows the schema it will send forward.
4. **Data preview** shows the data.

Click **Save** at the upper right of the page to save your work for later.

# Step 4 - Load into Glue Tables 

At this point your data has been loaded into the system and you can use any load node going forward; if you wish to load your data into a Glue database and table, move on to the next step

## 4.1 - Create buckets
A Glue database requires a separate S3 bucket for storing your data.

1. Open the [S3 Console](https://s3.console.aws.amazon.com/s3/home).
2. Create a new empty bucket for Glue to use (see the steps above during setup for details).  Name it something memorable for you, like `astradatabase`.

## 4.2 - Create database and table
1. In the **AWS Glue** console, choose **Data Catalog/Databases** from the left column.
2. Click the orange **Add database** button at the top right
3. Name your database and click the orange **Create database** button at the bottom.
4. Click on **Tables** in the left hand panel.
5. Click **Add table**.
    - Name your table whatever you like.
    - Choose the database you just created.
    - **Data store** is S3:
        - Browse and select the S3 bucket you created, with a slash at the end (you may need to click outside the box for it to accept your entry). The prefix is not needed for this entry.
    - **Data format** is 'CSV' with Comma(,) as the delimiter.
    - Click **Next**.
6. Next is **Choose or define schema**.
    - Download the <a href="https://awesome-astra.github.io/docs/assets/attachments/schema.txt">Schema</a>
    - Click **Edit schema as JSON**.
    - Click **Choose file** and pick the schema.txt file you downloaded.
    - Click **Save** then **Next**.
    - Review the entry and then click **Create**.

## 4.3 - Add Glue Database target

1. Open your job from the list of ETL entries(**ETL Jobs** on the Glue navbar).
2. Select the **ApplyMapping** node.
3. Click the big plus circle to add a new node to the flow.
4. Click **Data** then collapse Sources and expand Targets.
5. Choose the Glue Data Catalog target.
6. For the Glue Data Catalog configure it in the right panel:
    - Make sure the parent node is ApplyMapping.
    - Choose your database and table.
    - Save your job and click **Run**.

## 4.4 - View table (requires Athena)
1. Click on **Tables** in the left hand column, under Data Catalog/Databases.
2. Click **Table data** for the table you created/populated.
3. Acknowledge the charges for Athena.
4. You will be taken to the Athena console.
5. If the **Run** button is not active:
    - Go to the **Settings** tab in the editor.
    - Click the **Manage** button.
    - Click **Browse S3** next to "Location of query result", locate the bucket you created earlier to store the Glue data, and click "Choose" to confirm.
    - Click **Save** to leave the settings management and go back to the Editor tab of Athena.
4. Check out the resulting data by clicking the **Run** button.
