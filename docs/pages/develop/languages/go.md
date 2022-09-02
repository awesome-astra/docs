### 1. Overview

<img src="../../../../img/tile-go.png" align="left" height="180px"/>

Astra provides **multiple services** such as; Database and Streaming, with **multiple Apis and interfaces**. There are different frameworks and tools to connect to Astra depending on the Api interface you choose.

Pick the interface in the table below to get relevant instructions. In most cases, you will download a working sample. There are standalone examples designed to be as simple as possible. Please note that a _Software developement KIT (SDK)_ for Go is forthcoming, and will be available in the near future.

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

### 3.1 The Gocql Cassandra Driver

**ℹ️ Overview**

```
These instructions are aimed at helping people connect to Astra DB programmatically using the community-driven Gocql driver.  This driver does not have an option to process the Astra secure connect bundle, so part of connecting is completing that process manually, as is shown below.
```

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)
- You should [Download your Secure bundle](/docs/pages/astra/download-scb/)

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

With Go installed locally, you can now use the Go package manager (`go get`) to install the Gocql driver.

```
go get github.com/gocql/gocql
```

**🖥️ Sample Code**

To connect to an Astra DB cluster, you will need a secure token generated specifically for use with your Astra DB cluster.  You will also need to unzip your secure bundle, to ensure that you can access the files contained within.  

```
mkdir mySecureBundleDir
cd mySecureBundleDir
mv ~/Downloads/secure-connect-bundle.zip .
unzip secure-connect-bundle.zip
```

Inside your editor/IDE, create a new code file with a `.go` extension, and import several libraries.

```go
import (
    "crypto/tls"
    "crypto/x509"
    "context"
    "fmt"
    "io/ioutil"
    "github.com/gocql/gocql"
    "os"
    "path/filepath"
    "strconv"
)
```

Next, create a `func main()` method.

```go
func main() {
    // set default port
    var port int = 29042
    var err error
```

As seen above, we'll define Astra DB's default CQL port to 29042 as well as an error variable (which we'll use later).

Next we will inject the connection parameters into the code.  This can be done either by reading them as environment variables or passing them as command line arguments.

This example will be done using command line arguments:

```go
hostname := os.Args[1]
username := os.Args[2]
password := os.Args[3]

caPath,_ := filepath.Abs(os.Args[4])
certPath,_ := filepath.Abs(os.Args[5])
keyPath,_ := filepath.Abs(os.Args[6])
```

As seen above, we are going to read in six arguments.

First, we'll take the `hostname` and `port` to establish our connection endpoint.  With Astra DB, you should only use a single endpoint to connect, as that Astra endpoint itself resolves to multiple nodes.

```go
cluster := gocql.NewCluster(hostname)
cluster.Port = port
```

Next, we'll define our connection authenticator and pass our credentials to it.

```go
cluster.Authenticator = gocql.PasswordAuthenticator{
			Username: username,
			Password: password,
}
```

Finally, we'll need to process the filepaths of our TLS/X509 certificate, key, and certificate authority files.

```go
cert, _ := tls.LoadX509KeyPair(certPath, keyPath)
caCert, err := ioutil.ReadFile(caPath)
caCertPool := x509.NewCertPool()
caCertPool.AppendCertsFromPEM(caCert)
tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{cert},
		RootCAs:      caCertPool,
}
```

We'll them pass our `tlsConfig` to the `SslOpts` property on the `cluster` object.

```go
cluster.SslOpts = &gocql.SslOptions{
		Config:                 tlsConfig,
		EnableHostVerification: false,
}
```

With all of that defined, we can open a connection to our cluster:

```go
session, err := cluster.CreateSession()
if err != nil {
		fmt.Println(err)
}
defer session.Close()
ctx := context.Background()
```

If you get an error concerning a mismatch of the CQL protocol version at this point, try forcing protocol version 4 _before_ the session code block above.

```go
cluster.ProtoVersion = 4
```

With a connection made, we can run a simple query to return the name of the cluster from the `system.local` table:

```go
var strClusterName string
err2 := session.Query(`SELECT cluster_name FROM system.local`).WithContext(ctx).Scan(&strClusterName)
if err2 != nil {
		fmt.Println(err)
} else {
		fmt.Println("cluster_name:", strClusterName)
}
```

Running this code with arguments in the proper order should yield output similar to this:

```
go run testCassandraSSL.go ce111111-1111-1111-1111-d11b1d4bc111-us-east1.db.astra.datastax.com token "AstraCS:ASjPlHbTYourSecureTokenGoesHered3cdab53b" /Users/aaronploetz/mySecureBundleDir/ca.crt /Users/aaronploetz/mySecureBundleDir/cert /Users/aaronploetz/mySecureBundleDir/key

cluster_name: cndb
```

The complete code to this example can be found [here](https://github.com/aar0np/go_stuff/blob/main/testCassandraSSL.go).

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

```go
package main

import (
	"archive/zip"
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gocql/gocql"
)

type Config struct {
	Host string `json:"host"`
	Port int    `json:"cql_port"`
}

func main() {
	var clientID = os.Getenv("ASTRA_CLIENT_ID")
	var clientSecret = os.Getenv("ASTRA_CLIENT_SECRET")
	var secureConnectBundle = os.Getenv("SECURE_CONNECT_BUNDLE")
	if clientID == "" || clientSecret == "" || secureConnectBundle == "" {
		panic("missing required environment variables")
	}

	secureBundleDir := os.TempDir()
	fmt.Printf("extracting secure connect bundle [%s] to [%s]\n", secureConnectBundle, secureBundleDir)
	if err := Unzip(secureConnectBundle, secureBundleDir); err != nil {
		panic(err)
	}

	configPath, _ := filepath.Abs(secureBundleDir + "/config.json")
	fmt.Println("config: " + configPath)
	configData, _ := ioutil.ReadFile(configPath)
	var cfg Config
	json.Unmarshal(configData, &cfg)

	cluster := gocql.NewCluster(cfg.Host)
	cluster.Authenticator = gocql.PasswordAuthenticator{
		Username: clientID,
		Password: clientSecret,
	}
	host := cfg.Host + ":" + strconv.Itoa(cfg.Port)
	cluster.Hosts = []string{host}
	fmt.Println("connecting to: " + host)

	certPath, _ := filepath.Abs(secureBundleDir + "/cert")
	keyPath, _ := filepath.Abs(secureBundleDir + "/key")
	caPath, _ := filepath.Abs(secureBundleDir + "/ca.crt")
	cert, _ := tls.LoadX509KeyPair(certPath, keyPath)

	caCert, _ := ioutil.ReadFile(caPath)
	caCertPool := x509.NewCertPool()
	caCertPool.AppendCertsFromPEM(caCert)

	cluster.SslOpts = &gocql.SslOptions{
		Config: &tls.Config{
			Certificates: []tls.Certificate{cert},
			ServerName:   cfg.Host,
			RootCAs:      caCertPool,
		},
	}

	session, err := cluster.CreateSession()
	if err != nil {
		panic(err)
	}

	fmt.Printf("session established: %v\n", session)

	var releaseVersion string
	if err := session.Query("select release_version from system.local").
		WithContext(context.Background()).
		Consistency(gocql.One).
		Scan(&releaseVersion); err != nil {
		panic(err)
	}

	fmt.Printf("release version: %s\n", releaseVersion)
}

func Unzip(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer func() {
		if err := r.Close(); err != nil {
			panic(err)
		}
	}()

	os.MkdirAll(dest, 0755)

	// Closure to address file descriptors issue with all the deferred .Close() methods
	extractAndWriteFile := func(f *zip.File) error {
		rc, err := f.Open()
		if err != nil {
			return err
		}
		defer func() {
			if err := rc.Close(); err != nil {
				panic(err)
			}
		}()

		path := filepath.Join(dest, f.Name)

		// Check for ZipSlip (Directory traversal)
		if !strings.HasPrefix(path, filepath.Clean(dest)+string(os.PathSeparator)) {
			return fmt.Errorf("illegal file path: %s", path)
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(path, f.Mode())
		} else {
			os.MkdirAll(filepath.Dir(path), f.Mode())
			f, err := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
			if err != nil {
				return err
			}
			defer func() {
				if err := f.Close(); err != nil {
					panic(err)
				}
			}()

			_, err = io.Copy(f, rc)
			if err != nil {
				return err
			}
		}
		return nil
	}

	for _, f := range r.File {
		err := extractAndWriteFile(f)
		if err != nil {
			return err
		}
	}

	return nil
}
```
