_Last Update {{ git_revision_date }}_

## Overview

DataStation is an open-source data IDE for developers. It allows you to easily build graphs and tables with data pulled from SQL databases, logging databases, metrics databases, HTTP servers, and all kinds of text and binary files. Need to join or munge data? Write embedded scripts as needed in languages like Python, JavaScript, R or SQL. All in one application. This tutorial will show you step-by-step how to connect your Astra DB with DataStation. 


- ℹ️ [Introduction to DataStation](https://datastation.multiprocess.io/)
- 📥 [DataStation Quick Install](https://datastation.multiprocess.io/docs/)

## Prerequisites
- You should [Install DataStation](https://datastation.multiprocess.io/docs/)
- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should have an [Astra Token](/docs/pages/astra/create-token/)
- Clone this [repository](https://github.com/datastax/cql-proxy) to use to set up CQL-Proxy which is a sidecar that enables unsupported CQL drivers to work with DataStax Astra
    - You need your Astra Token and Astra Database ID to use CQL-Proxy
    - Follow the steps in the repo to spin up CQL-Proxy using Terminal/Command Line. Once successfully running, you should see the following output:
```
{"level":"info","ts":1651012815.176512,"caller":"proxy/proxy.go:222","msg":"proxy is listening","address":"[::]:9042"}
```

fgdfgdfg
df
gdf
g
dfg