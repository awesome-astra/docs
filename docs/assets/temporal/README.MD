# Working with Astra DB and `Temporal/ Cadence`

<img src="img/logo.svg" height="100px" />

[🏠 Back to LIST](../README.MD)

## Overview

- Temporal is implemented in Go and use GoCQL Driver

- 2 ways to connect: Using SSL setting in the SCB or Cql-PROXY

### Procedure `GoCQLDriver`

```yaml
version: "3.5"
services:
  temporal:
    container_name: temporal
    environment:
      - DYNAMIC_CONFIG_FILE_PATH=config/dynamicconfig/development.yaml
      - DB=cassandra
      - SKIP_SCHEMA_SETUP=true
      - CASSANDRA_SEEDS=3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23-eu-west-1.db.astra.datastax.com
      - CASSANDRA_PORT=29042
      - CASSANDRA_USER=TBD
      - CASSANDRA_PASSWORD=TBD
      - CASSANDRA_TLS_ENABLED=true
      - CASSANDRA_TLS_DISABLE_HOST_VERIFICATION=true
      - CASSANDRA_TLS_SERVER_NAME=3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23-eu-west-1.db.astra.datastax.com
      - CASSANDRA_CERT=/etc/temporal/config/dynamicconfig/cert
      - CASSANDRA_CERT_KEY=/etc/temporal/config/dynamicconfig/key
      - CASSANDRA_CA=/etc/temporal/config/dynamicconfig/ca.crt
      
    image: temporalio/auto-setup:1.14.2
    networks:
      - temporal-network
    ports:
      - 7233:7233
    volumes:
      - ./dynamicconfig:/etc/temporal/config/dynamicconfig
```

### Procedure with `Cql-Proxy`

```yaml
version: "3.5"
services:
  cql-proxy:
    image: datastax/cql-proxy:v0.0.4
    volumes:
      - ./cql-proxy/secure-connect-temporal.zip:/tmp/scb.zip
    networks:
      - temporal-network
    ports:
      - 7001:7001
      - 7199:7199
      - 9042:9042
      - 9160:9160
    environment:
      - BUNDLE=/tmp/scb.zip
      - USERNAME=TBD
      - PASSWORD=TBD 

  temporal:
    container_name: temporal
    depends_on:
      - cql-proxy
    environment:
      - CASSANDRA_SEEDS=cql-proxy
      - CASSANDRA_KEYSPACE=temporal
      - DYNAMIC_CONFIG_FILE_PATH=config/dynamicconfig/development.yaml
      - CASSANDRA_USER=TBD
      - CASSANDRA_PASSWORD=TBD
```