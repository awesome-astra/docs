## 1. Overview

<img src="../../../../img/tile-go.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. 

If you have issues or requests about these code samples, please open a ticket under [Awesome-Astra](https://github.com/awesome-astra/).

## 2. Interfaces List

<a href="#3-cql">
 <img src="../../../../img/tile-api-cql.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp; <a href="#4-api-grpc">
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

<<<<<<< Updated upstream
Clone the [repository](https://github.com/awesome-astra/gocql-astra) and change into the 'envvar' directory in that repository.

```
git clone https://github.com/awesome-astra/gocql-astra
cd gocql-astra/envvar
=======
Clone the  [repository](https://github.com/awesome-astra/sample-code) and change into the 'gocql-astra' directory in that repository.

```
git clone https://github.com/awesome-astra/sample-code
cd sample-code/gocql-astra
>>>>>>> Stashed changes
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


<<<<<<< Updated upstream
Download the [code](https://raw.githubusercontent.com/awesome-astra/sample-code/main/AstraGPRCQuickStart.go) into your directory, or copy it from below into your workspace.

```
curl https://raw.githubusercontent.com/awesome-astra/sample-code/main/AstraGPRCQuickStart.go -o AstraGRPCQuickStart.go
```

With Go installed locally, you can now use the Go package manager (`go get`) to install the dependencies.

```
go mod init grpc
go get -u
=======
Clone the [repository](https://github.com/awesome-astra/code-samples) into your directory, then change into the astra-gprc directory.

```
git clone https://github.com/awesome-astra/code-samples
cd astra-gprc

>>>>>>> Stashed changes
```

Run the code in your environment.

```
go run AstraGRPCQuickStart.go
```
