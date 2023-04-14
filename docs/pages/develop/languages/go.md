## 1. Overview

<img src="../../../../img/tile-go.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. 

If you have issues or requests about these code samples, please open a ticket under [Awesome-Astra](https://github.com/awesome-astra/).

## 2. Interfaces List

<a href="#3-cql">
 <img src="../../../../img/tile-api-cql.png" height="130px" width="130px"/>
 <a href="#4-api-rest">
<img src="../../../../img/tile-api-rest.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp; <a href="#5-api-grpc">
<img src="../../../../img/tile-api-grpc.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;

## 3. <a name="3-cql">CQL</a> 

### 3.1 The gocql-astra driver

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using the custom Astra Gocql driver.  

***Basic driver instructions***
Basic instructions can be found at the home page for [gocql-astra](https://github.com/datastax/gocql-astra)

***Environment variable version***

To use this library with environment variables, you can use the following steps.

***📦 Prerequisites [ASTRA]***

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Have an Astra Token](/docs/pages/astra/create-token/) with "Database Administrator" permissions
- You should [Install the Astra CLI](/docs/pages/astra/astra-cli/)

***📦 Prerequisites [Development Environment]***

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

You want to have a go version of at least 1.17.


To get started you need to [Install the Astra CLI](/docs/pages/astra/astra-cli/). Create a directory you want to use and change into that directory. 

Using the [token](/docs/pages/astra/create-token/) you created with the "Database Administrator" permission, use the CLI to setup your environment.

```
astra setup
```

Create a database and keyspace to work with.

```
astra db create workshops -k gotest --if-not-exist
```

***🖥️ Sample Code***

Clone the  [repository](https://github.com/awesome-astra/sample-code) and change into the 'gocql-astra' directory in that repository.

```
git clone https://github.com/awesome-astra/sample-code
cd sample-code/gocql-astra/envvars
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k gotest 
```

Build the environment variable example.

```
go build envvars.go
```

Run the code in your environment.

```
./envvars
```


### 3.2 Other Astra CQL Interfaces
- [cql-proxy](https://github.com/qzg/cql-proxy) This proxy sidecar is not Go-specific, but it works with the existing Go drivers to provide an interface into Astra.

## 4. <a name="4-api-rest">Stargate REST API</a>

### 4.1 The Stargate API Signing Library

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using Stargate's REST interface

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Have an Astra Token](/docs/pages/astra/create-token/) with "Database Administrator" permissions
- You should [Install the Astra CLI](/docs/pages/astra/astra-cli/)



**🖥️ Sample Code**

To use the signing library, you simply include it in your code and then create a client for making calls.

```
package main

import (
	"bytes"
	"fmt"
	"net/url"
	"os"

	"github.com/synedra/astra_stargate"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if len(os.Getenv("ASTRA_DB_APPLICATION_TOKEN")) == 0 {
		fmt.Println(fmt.Errorf("please set your environment variables or use astra db create-dotenv to create a .env file"))
		return
	}

	client := astra_stargate.NewBasicAuthClient(os.Getenv("ASTRA_DB_APPLICATION_TOKEN"), os.Getenv("ASTRA_DB_ID"), os.Getenv("ASTRA_DB_REGION"))
	if err != nil {
		fmt.Println(err)
	}

	// Basic REST Query
	fmt.Println("Basic REST query for keyspaces")
	responsebody, err := client.APIGet("/api/rest/v1/keyspaces")
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(responsebody)

```

You can see a more extensive example by following these instructions.

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

You want to have a go version of at least 1.17.


To get started you need to [Install the Astra CLI](/docs/pages/astra/astra-cli/). Create a directory you want to use and change into that directory. 


Clone the [repository](https://github.com/awesome-astra/sample-code) into your directory, then change into the astra_stargate_rest directory.

```
git clone https://github.com/awesome-astra/sample-code
cd astra_stargate_rest
```

Using the [token](/docs/pages/astra/create-token/) you created with the "Database Administrator" permission, use the CLI to setup your environment.

```
astra setup
```

Create a database and keyspace to work with.

```
astra db create workshops -k gotest --if-not-exist
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k gotest 
```

Run the code in your environment.

```
go build astra_stargate_example.go
./astra_stargate_example
```


## 5. <a name="5-api-grpc">CQL API GRPC</a>

### 5.1 The Gocql GRPC Cassandra Astra Driver

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using the Astra specific Golang driver  

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Have an Astra Token](/docs/pages/astra/create-token/) with "Database Administrator" permissions
- You should [Install the Astra CLI](/docs/pages/astra/astra-cli/)

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

You want to have a go version of at least 1.17.


To get started you need to [Install the Astra CLI](/docs/pages/astra/astra-cli/). Create a directory you want to use and change into that directory. 

Using the [token](/docs/pages/astra/create-token/) you created with the "Database Administrator" permission, use the CLI to setup your environment.

```
astra setup
```

Create a database and keyspace to work with.

```
astra db create workshops -k gotest --if-not-exist
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k gotest 
```

**🖥️ Sample Code**


Clone the [repository](https://github.com/awesome-astra/code-samples) into your directory, then change into the astra-gprc directory.

```
git clone https://github.com/awesome-astra/code-samples
cd astra-gprc

```

Run the code in your environment.

```
go build AstraGRPCQuickStart.go
./AstraGRPCQuickStart
```
