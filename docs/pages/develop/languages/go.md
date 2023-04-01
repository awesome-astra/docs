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

These instructions are aimed at helping people connect to Astra DB programmatically using the community-driven Gocql driver.  This driver does not have an option to process the Astra secure connect bundle, so part of connecting is completing that process manually, as is shown below.

**📦 Prerequisites [ASTRA]**

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Have an Astra Token](/docs/pages/astra/create-token/) with "Database Administrator" permissions
- You should [Install the Astra CLI](/docs/pages/astra/astra-cli/)

**📦 Prerequisites [Development Environment]**

You will need to have a recent (1.17+) version of Go.  Visit the [official download page](https://go.dev/dl/), and select the appropriate version for your machine architecture.  To verify that Go is installed, run the following command:

```
go version
```

With Go installed locally, you can now use the Go package manager (`go get`) to install the Gocql driver.

```
go get github.com/gocql/gocql
```

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

Run the code in your environment.

```
go run AstraQuickStart.go
```
***📦 Code overview [ASTRA]**

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

The complete code to this example can be found [here](https://raw.githubusercontent.com/aar0np/go_stuff/main/AstraQuickStart.go).

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
