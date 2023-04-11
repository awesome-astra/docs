## 1. Overview

<img src="../../../../img/tile-go.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. 

If you have issues or requests about these code samples, please open a ticket under [Awesome-Astra](https://github.com/awesome-astra/)

## 2. Interfaces List

<a href="#3-cql">
 <img src="../../../../img/tile-api-cql.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp; <a href="#4-api-grpc">
<img src="../../../../img/tile-api-grpc.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;

## 3. <a name="3-cql">CQL</a> 

### 3.1 The Gocql Cassandra Driver

**ℹ️ Overview**

These instructions are aimed at helping people connect to Astra DB programmatically using the community-driven Gocql driver.  

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
astra db create-dotenv --directory `pwd` workshops -k gotest 
```

Unzip secure bundle

```
source .env
unzip $ASTRA_DB_SECURE_BUNDLE_PATH
```

**🖥️ Sample Code**


Download the [code](https://raw.githubusercontent.com/aar0np/go_stuff/main/AstraQuickStart.go) into your directory.

```
curl https://raw.githubusercontent.com/aar0np/go_stuff/main/AstraQuickStart.go -o AstraQuickStart.go
```

With Go installed locally, you can now use the Go package manager (`go get`) to install the Gocql driver.

```
go mod init mydemo
go get -u
```

Run the code in your environment.

```
go run AstraQuickStart.go
```
**📦 Code overview [ASTRA]**

There are a few sections of the code you'll want to be familiar with, so you can work from this file to interact with Astra successfully.

The godotenv library loads all of the environment variables from the .env file created by the create-dotenv Astra CLI command.  There is code to support command line options as well, so you can do `go run AstraQuickStart.go --hostname myhostname.com`.  By default, the values will be pulled from the .env file so you don't have to copy and paste them to run the command.

```go
err = godotenv.Load()
```

The SSL connection requires some configuration to work correctly.  First, the secure bundle files were placed into your current directory when you ran the unzip command above, so those files will be found at that location.  If you unzipped them somewhere else, you can pass that to the command with `--ssldir /my/ssl/dir`

```go
caPath,_ := filepath.Abs(directory + "/ca.crt")
certPath,_ := filepath.Abs(directory + "/cert")
keyPath,_ := filepath.Abs(directory + "/key")
```

The SSL object itself needs a flag to skip the verification for IP SANs, which the secure bundle doesn't have.

```go
tlsConfig := &tls.Config{
    Certificates: []tls.Certificate{cert},
    RootCAs:      caCertPool,
    InsecureSkipVerify: true,
}

cluster.SslOpts = &gocql.SslOptions{
    Config:                 tlsConfig,
    EnableHostVerification: false,
}
```

### 3.2 Other Astra CQL Interfaces
- [gocql-astra](https://github.com/datastax/gocql-astra) provides a custom dialer to access Astra installations.  Instructions show how to integrate this into your code.
- [cql-proxy](https://github.com/qzg/cql-proxy) This proxy sidecar is not Go-specific, but it works with the existing Go drivers to provide an interface into Astra.

## 4. <a name="4-api-grpc">CQL API GRPC</a>

### 4.1 The Gocql GRPC Cassandra Astra Driver

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
astra db create-dotenv --directory `pwd` workshops -k gotest 
```

**🖥️ Sample Code**


Download the [code](https://raw.githubusercontent.com/aar0np/go_stuff/main/AstraGRPCQuickStart.go) into your directory, or copy it from below into your workspace.

```
curl https://raw.githubusercontent.com/aar0np/go_stuff/main/AstraGRPCQuickStart.go -o AstraGRPCQuickStart.go
```

With Go installed locally, you can now use the Go package manager (`go get`) to install the Gocql driver.

```
go mod init grpc
go get -u
```

Run the code in your environment.

```
go run AstraGRPCQuickStart.go
```

### Code

```
package main

import (
	"fmt"
	"os"

	"github.com/datastax-ext/astra-go-sdk"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()

	token := os.Getenv("ASTRA_DB_APPLICATION_TOKEN")
	secureBundle := os.Getenv("ASTRA_DB_SECURE_BUNDLE_PATH")
	keyspace := os.Getenv("ASTRA_DB_KEYSPACE")

	c, err := astra.NewStaticTokenClient(
		token,
		astra.WithSecureConnectBundle(secureBundle),
		astra.WithDefaultKeyspace(keyspace),
	)
	if err != nil {
		fmt.Println("Error:")
		fmt.Println(err)
	}

	fmt.Println("SELECTing from system.local")

	rows, err := c.Query("SELECT cluster_name FROM system.local").Exec()
	if err != nil {
		fmt.Println(err)
	}

	for _, r := range rows {
		vals := r.Values()
		strClusterName := vals[0].(string)
		fmt.Println("cluster_name:", strClusterName)
	}
}
```
