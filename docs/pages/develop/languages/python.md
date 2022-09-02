### 1. Overview

<img src="../../../../img/tile-python.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface in the table below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. Please note that a _Software developement KIT (SDK)_ is also available for you to reduce the amount of boilerplate code needed to get started. More information is [here](https://github.com/datastax/python-driver).

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

### 3.1 Cassandra Drivers

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using the DataStax Python driver.

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)
- You should [Download your Secure bundle](/docs/pages/astra/download-scb/)

**📦 Prerequisites [Development Environment]**

You will need a recent version of Python 3.  Visit [https://www.python.org/downloads/](https://www.python.org/downloads/) for more information on downloads and installation instructions for your machine architecture.  To verify your Python install, run the following command:

```
python -V
```

With Python installed locally, you can now use Pip (Python's package manager) to install the DataStax Python driver.

```
pip install cassandra-driver
```

You can verify that the DataStax Python driver was installed successfully with this command:

```
python -c 'import cassandra; print (cassandra.__version__)'
```

**📦 Setup Project**

Create a new file and/or directory for your Python program.

```
mkdir python_project
cd python_project
touch testAstra.py
```

**🖥️ Sample Code**

To connect to an Astra DB cluster, you will need a secure token generated specifically for use with your Astra DB cluster.

```
mkdir ~/mySecureBundleDir
cd ~/mySecureBundleDir
mv ~/Downloads/secure-connect-bundle.zip .
```

Open up your favorite editor or IDE, and add 3 imports:

```Python
from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import sys
```

Next we will inject the connection parameters into the code.  This can be done either by reading them as environment variables or passing them as command line arguments.

This example will be done using command line arguments:

```Python
clientID=sys.argv[1]
secret=sys.argv[2]
secureBundleLocation=sys.argv[3]
```

We'll also define the location of our secure connect bundle, and set that as a property in our `cloud_config`:

```Python
cloud_config= {
    'secure_connect_bundle': secureBundleLocation
}
```

Next, we'll define our authenticator and pass our credentials to it.

```Python
auth_provider = PlainTextAuthProvider(clientID, secret)
```

With all of that defined, we can build a cluster object and a connection:

```Python
cluster = Cluster(cloud=cloud_config, auth_provider=auth_provider)
session = cluster.connect()
```

With a connection made, we can run a simple query to return the name of the cluster from the `system.local` table:

```Python
row = session.execute("select cluster_name from system.local").one()
if row:
    print(row[0])
else:
    print("An error occurred.")
```

Running this code with arguments in the proper order should yield output similar to this:

```
python testAstra.py token "AstraCS:ASjPlHbTYourSecureTokenGoesHered3cdab53b" /Users/aaronploetz/mySecureBundleDir/secure-connect-bundle.zip

cndb
```

The complete code to this example can be found [here](https://github.com/aar0np/DS_Python_stuff/blob/main/testAstra.py).

### 3.2 Astra SDK

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
