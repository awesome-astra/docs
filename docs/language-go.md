TODO

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