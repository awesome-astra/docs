## 1. Overview

<img src="../../../../img/tile-go.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. 

If you have issues or requests about these code samples, please open a ticket under [Awesome-Astra](https://github.com/awesome-astra/).

## 2. Interfaces List

<a href="#3-cql">
 <img src="../../../../img/tile-api-cql.png" height="130px" width="130px"/>
 <a href="#5-api-rest">
<img src="../../../../img/tile-api-rest.png" height="130px" width="130px"/>
</a>
 <a href="#6-api-graphql">
<img src="../../../../img/tile-api-graphql.png" height="130px" width="130px"/>
</a>
 <a href="#7-api-document">
<img src="../../../../img/tile-api-document.png" height="130px" width="130px"/>
</a>
<a href="#8-api-grpc">
<img src="../../../../img/tile-api-grpc.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;

## 3. <a name="3-cql">CQL</a> 

### 3.1 The gocql-astra driver

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using the custom Astra Gocql driver.  

***Basic driver instructions***
Basic instructions can be found at the home page for [gocql-astra](https://github.com/datastax/gocql-astra). They are included here.

??? note "gocql for Astra from [gocql-astra](https://github.com/datastax/gocql-astra)"

	This provides a custom `gocql.HostDialer` that can be used to allow gocql to connect to DataStax Astra. The goal is to
	provide native support for gocql on Astra.

	This library relies on the following features of gocql:

	* The ability to customize connection features via the [HostDialer interface](https://github.com/gocql/gocql/pull/1629)
	* [Querying system.peers](https://github.com/gocql/gocql/pull/1646) if system.peers_v2 should be used but isn't available 

	You must use a version of gocql which supports both of these features.  Both features have been merged into master as of
	version [1.2.1](https://github.com/gocql/gocql/releases/tag/v1.2.1) so any release >= 1.2.1 should work.

	## Issues

	* Need to verify that topology/status events correctly update the driver when using Astra.
	* This seems to work correctly and was tested by removing Astra coordinators
	* There is a bit of weirdness around contact points. I'm just using a place holder `"0.0.0.0"` (some valid IP address) 
	then the `HostDialer` provides a host ID from the metadata service when the host ID in the `HostInfo` is empty.

??? note "How to use gocql-astra"

	Using an Astra bundle:

	```go
	cluster, err := gocqlastra.NewClusterFromBundle("/path/to/your/bundle.zip", 
		"<username>", "<password>", 10 * time.Second)

	if err != nil {
		panic("unable to load the bundle")
	}

	session, err := gocql.NewSession(*cluster)

	// ...
	```

	Using an Astra token:

	```go
	cluster, err = gocqlastra.NewClusterFromURL(gocqlastra.AstraAPIURL, 
		"<astra-database-id>", "<astra-token>", 10 * time.Second)

	if err != nil {
	panic("unable to load the bundle")
	}

	session, err := gocql.NewSession(*cluster)

	// ...
	```

***Environment variable version***

To use this library with environment variables, you can follow these steps.

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

The best way to use this sample is to clone it from the repository.

Clone the  [repository](https://github.com/awesome-astra/go-sample-code) and change into the 'gocql-astra' directory in that repository.

```
git clone https://github.com/awesome-astra/go-sample-code
cd go-sample-code/gocql-astra/envvars
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

??? "Sample code details"

	"If you want to use this sample without cloning the repository, you will need to have the following:"

	- github.com/datastax/astra-client-go/v2 v2.2.9
	- github.com/datastax/cql-proxy v0.1.3

	```
	package main

	import (
		"fmt"
		"log"
		"os"
		"time"

		gocqlastra "github.com/datastax/gocql-astra"
		"github.com/gocql/gocql"
		"github.com/joho/godotenv"
	)

	func main() {

		var err error

		err = godotenv.Load()

		var cluster *gocql.ClusterConfig
		if len(os.Getenv("ASTRA_DB_SECURE_BUNDLE_PATH")) > 0 {
			cluster, err = gocqlastra.NewClusterFromBundle(os.Getenv("ASTRA_DB_SECURE_BUNDLE_PATH"), "token", os.Getenv("ASTRA_DB_APPLICATION_TOKEN"), 10*time.Second)
			if err != nil {
				err = fmt.Errorf("unable to open bundle %s from file: %v", os.Getenv("ASTRA_DB_SECURE_BUNDLE_PATH"), err)
				panic(err)
			}
		} else if len(os.Getenv("ASTRA_DB_APPLICATION_TOKEN")) > 0 {
			if len(os.Getenv("ASTRA_DB_ID")) == 0 {
				panic("database ID is required when using a token")
			}
			cluster, err = gocqlastra.NewClusterFromURL("https://api.astra.datastax.com", os.Getenv("ASTRA_DB_ID"), os.Getenv("ASTRA_DB_APPLICATION_TOKEN"), 10*time.Second)
			fmt.Println(cluster)
			if err != nil {
				fmt.Errorf("unable to load cluster %s from astra: %v", os.Getenv("ASTRA_DB_APPLICATION_TOKEN"), err)
			}
		} else {
			fmt.Errorf("must provide either bundle path or token")
		}

		start := time.Now()
		session, err := gocql.NewSession(*cluster)
		elapsed := time.Now().Sub(start)
		if err != nil {
			log.Fatalf("unable to connect session: %v", err)
		}

		fmt.Println("Making the query now")

		iter := session.Query("SELECT release_version FROM system.local").Iter()

		var version string
		for iter.Scan(&version) {
			fmt.Println(version)
		}

		if err = iter.Close(); err != nil {
			log.Printf("error running query: %v", err)
		}

		fmt.Printf("Connection process took %s\n", elapsed)
	}
	```

	To get this to work, you will need to pull the dependencies:

	```
	go mod init gocql
	go mod tidy
	go build envvars.go
	./envvars
	```



### 3.2 Other Astra CQL Interfaces
- [cql-proxy](https://github.com/qzg/cql-proxy) This proxy sidecar is not Go-specific, but it works with the existing Go drivers to provide an interface into Astra.

## 4. The Stargate API Signing Library

### 4.1 Using the Stargate API Signing Library

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using Stargate's API interface

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Have an Astra Token](/docs/pages/astra/create-token/) with "Database Administrator" permissions
- You should [Install the Astra CLI](/docs/pages/astra/astra-cli/)

**🖥️ Sample Code**

To use the signing library, you simply include it in your code and then create a client for making calls.

??? note "Sample go code for Stargate APIs"

	```
	package main

	import (
		"bytes"
		"fmt"
		"os"

		"github.com/awesome-astra/astra_stargate_go"

		"github.com/joho/godotenv"
	)

	func main() {
		err := godotenv.Load()
		if len(os.Getenv("ASTRA_DB_APPLICATION_TOKEN")) == 0 {
			fmt.Println(fmt.Errorf("please set your environment variables or use 'astra db create-dotenv' to create a .env file"))
			return
		}

		client := astra_stargate_go.NewBasicAuthClient(os.Getenv("ASTRA_DB_APPLICATION_TOKEN"), os.Getenv("ASTRA_DB_ID"), os.Getenv("ASTRA_DB_REGION"))
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

		// Basic Document Query
		fmt.Println("Create 'library' collection in the library keyspace")
		jsonStr := []byte(`{"name":"library"}`)
		responsebody, err = client.APIPost("/api/rest/v2/namespaces/library/collections", bytes.NewBuffer(jsonStr))
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(responsebody)

		// Basic GraphQL query
		query := "{\"query\":\"query GetTables {keyspace(name: \\\"library\\\") {name}}\"}"
		queryBody := []byte(query)
		bodyReader := bytes.NewBuffer(queryBody)

		if err != nil {
			panic(err)
		}
		req, err := client.APIPost("/api/graphql-schema", bodyReader)
		if err != nil {
			panic(err)
		}
		fmt.Println(req)

	}
	```

## 5 <a name="5-api-rest">Stargate REST API</a>

While the basic code is shown above, you can interact with a more extensive REST example by following these instructions.

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

You want to have a go version of at least 1.17.


To get started you need to [Install the Astra CLI](/docs/pages/astra/astra-cli/). Create a directory you want to use and change into that directory. 


Clone the [repository](https://github.com/awesome-astra/go-sample-code) into your directory, then change into the astra_stargate_rest directory.

```
git clone https://github.com/awesome-astra/go-sample-code
cd astra_stargate_rest
```

Using the [token](/docs/pages/astra/create-token/) you created with the "Database Administrator" permission, use the CLI to setup your environment.

```
astra setup
```

Create a database and keyspace to work with.

```
astra db create workshops -k library --if-not-exist
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k library 
```

Run the code in your environment.

```
go build astra_stargate_example.go
./astra_stargate_example
```

## 6 <a name="6-api-graphql">Stargate GraphQL API</a>

While the basic code is shown above, you can interact with a more extensive REST example by following these instructions.

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

You want to have a go version of at least 1.17.


To get started you need to [Install the Astra CLI](/docs/pages/astra/astra-cli/). Create a directory you want to use and change into that directory. 


Clone the [repository](https://github.com/awesome-astra/go-sample-code) into your directory, then change into the astra_stargate_rest directory.

```
git clone https://github.com/awesome-astra/go-sample-code
cd astra_stargate_graphql
```

Using the [token](/docs/pages/astra/create-token/) you created with the "Database Administrator" permission, use the CLI to setup your environment.

```
astra setup
```

Create a database and keyspace to work with.

```
astra db create workshops -k library --if-not-exist
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k library 
```

Run the code in your environment.

```
go build astra_stargate_graphql.go
./astra_stargate_graphql
```

## 7 <a name="7-api-document">Stargate Document API</a>

While the basic code is shown above, you can interact with a more extensive REST example by following these instructions.

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

You want to have a go version of at least 1.17.


To get started you need to [Install the Astra CLI](/docs/pages/astra/astra-cli/). Create a directory you want to use and change into that directory. 


Clone the [repository](https://github.com/awesome-astra/go-sample-code) into your directory, then change into the astra_stargate_rest directory.

```
git clone https://github.com/awesome-astra/go-sample-code
cd astra_stargate_document
```

Using the [token](/docs/pages/astra/create-token/) you created with the "Database Administrator" permission, use the CLI to setup your environment.

```
astra setup
```

Create a database and keyspace to work with.

```
astra db create workshops -k library --if-not-exist
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k library 
```

Run the code in your environment.

```
go build astra_stargate_document.go
./astra_stargate_document
```


## 8. <a name="8-api-grpc">CQL API GRPC</a>

### 8.1 The Gocql GRPC Cassandra Astra Driver

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
astra db create workshops -k library --if-not-exist
```

Create .env with astra CLI

```
astra db create-dotenv workshops -k library 
```

**🖥️ Sample Code**


Clone the [repository](https://github.com/awesome-astra/go-sample-code) into your directory, then change into the astra-gprc directory.

```
git clone https://github.com/awesome-astra/go-sample-code
cd astra-grpc

```

Run the code in your environment.

```
go build AstraGRPCQuickStart.go
./AstraGRPCQuickStart
```
