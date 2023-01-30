### 1. Overview

<img src="../../../../img/tile-javascript.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface in the table below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. Please note that a _Software developement KIT (SDK)_ is also available for you to reduce the amount of boilerplate code needed to get started.  More information [here](https://github.com/datastax/astrajs).

### 2. Interfaces List

|      Component      |                                                                                                   Interface                                                                                                    | Description                                 |
| :-----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------------------ |
|    **Astra DB**     |                    [![cql](https://dabuttonfactory.com/button.png?t=CQL&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=eb6c34&ebgc=77440e&bs=1&bc=f90)](#3-cql)                     | Main connection to Cassandra                |
|    **Astra DB**     |      [![cql](https://dabuttonfactory.com/button.png?t=Stargate+Rest+apis&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=eb6c34&ebgc=77440e&bs=1&bc=f90)](#4-stargate-rest-api)      | CQL exposes as stateless rest resources     |
|    **Astra DB**     |  [![cql](https://dabuttonfactory.com/button.png?t=Stargate+Document+apis&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=eb6c34&ebgc=77440e&bs=1&bc=f90)](#5-stargate-document-api)  | Use Cassandra as a Document DB              |
|    **Astra DB**     |     [![cql](https://dabuttonfactory.com/button.png?t=Stargate+GraphQL+Apis&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=eb6c34&ebgc=77440e&bs=1&bc=f90)](#6-stargate-graphql)     | Create tables and use generated CRUD        |
|    **Astra DB**     |        [![cql](https://dabuttonfactory.com/button.png?t=Stargate+gRPC+Apis&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=eb6c34&ebgc=77440e&bs=1&bc=f90)](#7-stargate-grpc)        | CQL exposes through serialized protobuf     |
| **Astra Streaming** |         [![cql](https://dabuttonfactory.com/button.png?t=Pulsar+Client&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=4a9ab4&ebgc=0b5394&bs=1&bc=073763)](#8-pulsar-client)         | Create Producer, Consumers, Subscriptions.. |
| **Astra Streaming** |          [![cql](https://dabuttonfactory.com/button.png?t=Pulsar+Admin&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=4a9ab4&ebgc=0b5394&bs=1&bc=073763)](#9-pulsar-admin)          | Administrate your Pulsar cluster            |
|   **Astra Core**    |        [![cql](https://dabuttonfactory.com/button.png?t=Devops+Apis+DB&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=200&h=50&c=11&bgt=pyramid&bgc=3a3a42&ebgc=000&bs=1&bc=444)](#10-devops-api-database)        | Manage Databases                            |
|   **Astra Core**    | [![cql](https://dabuttonfactory.com/button.png?t=Devops+Apis+Organization&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=200&h=50&c=11&bgt=pyramid&bgc=3a3a42&ebgc=000&bs=1&bc=444)](#11-devops-api-organization) | Manage users and roles                      |
|   **Astra Core**    |    [![cql](https://dabuttonfactory.com/button.png?t=Devops+Apis+Streaming&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=200&h=50&c=11&bgt=pyramid&bgc=3a3a42&ebgc=000&bs=1&bc=444)](#12-devops-api-streaming)    | Manage Streaming                            |

## 3. CQL

### 3.1 Cassandra Native Driver

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using the DataStax Node driver.

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)
- You should [Download your Secure bundle](/docs/pages/astra/download-scb/)

Covered the basics and looking for more? We’ve got docs to help you complete a variety of tasks. Here are some relevant topics for you:

[Node.js Driver Overview](https://docs.datastax.com/en/astra/docs/connect/drivers/connect-nodejs.html)
[Migrating Node.js Driver](https://docs.datastax.com/en/astra/docs/connect/drivers/connect-nodejs.html#_migrating_node_js_driver)

**📦 Prerequisites [ASTRA]**

You need a current version of Node (16+) and NPM (9+)

**📦 Setup Project**

```
npm install cassandra-driver
```

**🖥️ Sample Code**
Create a connect-database.js file in the main directory of your Node.js project:

```
mkdir nodejsProject
cd nodejsProject
touch connect-database.js
```

Add the following connection code to the new file. Set username to your App Token’s Client ID. Set password to your App Token’s Client Secret. Set PATH/TO secure with the path to your secure connect bundle zip file.

```
const { Client } = require("cassandra-driver");
async function run() {
   const client = new Client({
      cloud: {
      secureConnectBundle: "<<PATH/TO/>>secure-connect-stargate.zip",
      },
      credentials: {
      username: "<<CLIENT ID>>",
      password: "<<CLIENT SECRET>>",
      },
   });

   await client.connect();

   // Execute a query
   const rs = await client.execute("SELECT * FROM system.local");
   console.log(`Your cluster returned ${rs.rowLength} row(s)`);

   await client.shutdown();
}

// Run the async function
run();
```

Ensure you set username to your App Token's Client ID, password to your App Token's Client Secret, and path/to/secure-connect-database_name.zip with the path to your [SCB](/docs/pages/astra/download-scb/). 
This code creates a Client instance to connect to your Astra DB, runs a CQL query, and prints the output to the console.

Then, Save and close the connect-database.js file and run the connect-database.js example with the Node.js runtime.

```
node connect-database.js
```

### 3.2 Cassandra Cloud Driver (GRPC)

**ℹ️ Overview**

The cloud native (known as Google Remote Procedure Call or gRPC) client is well-supported across multiple languages. Using the gRPC client means you can easily query CQL from any source without the worry of driver installation or upgrades.

Covered the basics and looking for more? We’ve got docs to help you complete a variety of tasks. Here are some relevant topics for you:

[Node.js Driver Overview](https://docs.datastax.com/en/astra/docs/develop/api-grpc/gRPC-node-client.html)
[Node.js Querying](https://docs.datastax.com/en/astra/docs/develop/api-grpc/gRPC-node-client.html#_node_js_querying)
[Processing a result set](https://docs.datastax.com/en/astra/docs/develop/api-grpc/gRPC-node-client.html#_node_js_processing_result_set)
[Node.js Developing](https://docs.datastax.com/en/astra/docs/develop/api-grpc/gRPC-node-client.html#_node_js_developing)
[Node full sample script](https://docs.datastax.com/en/astra/docs/develop/api-grpc/gRPC-node-client.html#_node_full_sample_script)

**📦 Prerequisites [ASTRA]**

* If you do not already have one, get an [API Token](https://astra.datastax.com/org/2e0bb003-9a90-4163-b23a-53acc04969fb/settings/tokens) and set the role to “Database Administrator”.
* Create a [keyspace](https://docs.datastax.com/en/astra/docs/managing-keyspaces.html).
* Create a table in your keyspace(optional): [REST](https://docs.datastax.com/en/astra/docs/creating-a-table-in-your-keyspace.html)

**📦 Setup Project**

Install stargate-grpc-node-client using either npm or yarn:

npm command

```
npm i @stargate-oss/stargate-grpc-node-client
```

Yarn command

```
yarn add @stargate-oss/stargate-grpc-node-client
```

**🖥️ Sample Code**

This example assumes that you’re running Stargate on Astra DB. For more information, please see the [documentation](https://docs.datastax.com/en/astra/docs/manage-application-tokens.html). You’ll need to download your token from the Astra DB dashboard and add the token to the connection portion of the script.

The token to use in the Header of API calls is the same as your database's Application token. It starts with an AstraCS: prefix, followed by a generated alphanumeric string. You can generate this token in Astra DB console, via Organization Settings > Token Management > Select Role > Generate Token. Copy the token value, and paste it into your API call to authenticate with Astra DB resources.

```
// Astra DB configuration
// replace with values from the Astra DB dashboard
const astra_uri = "{astra-base-url}-{astra-region}.apps.astra.datastax.com:443";
const bearer_token = "AstraCS:xxxxxxx";

// Set up the authentication
// For Astra DB: Enter a bearer token for Astra, downloaded from the Astra DB dashboard
const bearerToken = new StargateBearerToken(bearer_token);
const credentials = grpc.credentials.combineChannelCredentials(
  grpc.credentials.createSsl(), bearerToken);

// Uncomment if you need to check the credentials
//console.log(credentials);
```

For a connection to a remote Stargate instance like Astra automatically generate on every call to the client:

```
// Create the gRPC client
// For Astra DB: passing the credentials created above
const stargateClient = new StargateClient(astra_uri, credentials);

console.log("made client");

// Create a promisified version of the client, so we don't need to use callbacks
const promisifiedClient = promisifyStargateClient(stargateClient);

console.log("promisified client")
```

### 3.3 Astra SDK

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

## 4. Stargate REST Api

### 4.1 Axios

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

### 4.2 Astra SDK

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

## 5. Stargate Document Api

### 5.1 Axios

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

### 5.2 Astra SDK

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

## 6 Stargate GraphQL

### 6.1 CQL First

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

### 6.2 GraphQL First

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

## 7. Stargate gRPC

### 7.1 Stargate Client

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

### 7.2 Astra SDK

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

## 8. Pulsar Client

### 8.1 Pulsar Client

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

### 8.2 Astra SDK

**ℹ️ Overview**

```
TODO
```

**📦 Prerequisites [ASTRA]**

```
TODO
```

**📦 Prerequisites [Development Environment]**

```
TODO
```

**📦 Setup Project**

```
TODO
```

**🖥️ Sample Code**

```
TODO
```

## 9. Pulsar Admin

## 10 Devops API Database

## 11 Devops API Organization

## 12 Devops API Streaming
