---
title: "Authorizer"
description: "Authorizer is an open source auth solution for application.  It works with many different databases, allowing the developers to use a single datastore for the entire application stack and have complete control over all user data."
tags: "python, third party tools, machine learning, workflow, etl"
icon: "https://awesome-astra.github.io/docs/img/authorizer/authorizer.png"
developer_title: "Authorizer"
developer_url: "https://authorizer.dev"
links:
- title: "Authorizer Documentation"
  url: "https://docs.authorizer.dev"
---

<div class="nosurface" markdown="1">
<img src="../../../../img/authorizer/authorizer.png" height="100px" />
</div>

## A - Overview

Authorizer is an open source auth solution for application.  It works with many different databases, allowing the developers to use a single datastore for the entire application stack and have complete control over all user data.

<div class="nosurface" markdown="1">
- ℹ️ [Authorizer Documentation](https://docs.authorizer.dev/)
</div>

## B - Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
</ul>

## C - Installation

**<span class="nosurface">✅</span> Step 0 Download and install**

Following the [Authorizer documentation](https://docs.authorizer.dev/deployment/binary) download and untar the software where you would like to install it.

**<span class="nosurface">✅</span> Step 1 Create the keyspace `authorizer`**

From the [Astra DB dashboard](https://astra.datastax.com), click on your database name. Scroll down to where the keyspaces are listed, and click the `Add Keyspace` button to create a new keyspace. Name this keyspace `authorizer`.

**<span class="nosurface">✅</span> Step 2 Create configuration file**

Use the delivered `.env.sample` file to create a new `.env` file for your configuration.  Edit this file with Atom, Vi, or whichever editor you choose.
```bash
    cd authorizer
    cp .env.sample .env
    atom .env
```

**<span class="nosurface">✅</span> Step 3 Create base64 encoded strings from your cert, ca.crt, and key files**

To successfully connect with Astra DB, you will need to open the secure bundle and convert the following files into base64 encoded strings:

 - cert
 - ca.crt
 - key

 You can accomplish this with the `base64` command:

```
base64 cert cert_base64_file
base64 ca.crt ca_base64_file
base64 key key_base64_file
```

Note that you can omit the file parameter and output the base64 encoded string to STDOUT for easy copy/paste accessibility.

**<span class="nosurface">✅</span> Step 4 Connect to Astra DB**

To connect to Astra DB, you will need to specify the following variables in the `.env` file:

```
DATABASE_HOST="ASTRA_DB_ID-ASTRA_DB_REGION.db.astra.datastax.com"
DATABASE_TYPE="cassandradb"
DATABASE_PORT=29042
DATABASE_USERNAME="token"
DATABASE_PASSWORD="AstraCS:yourAstraT0ken"

DATABASE_CERT="LS0tLS1CRUdJTiBDblahblahblahnotrealRVJUSUZJQ0FURS0tLS0"
DATABASE_CERT_KEY="RXNRNVcKYXkwblahblahblahnotrealkt4b1FnL2s4K29IaD"
DATABASE_CA_CERT="WVhneERqQU1CZblahblahblahnotrealWQkFzVEJVTnNiM1Z"
```

**<span class="nosurface">✅</span> Step 5 Start Authorizer**

From the `authorizer` directory, run the `server` binary from the `build` directory.  It will run in the foreground.
```
build/server
```

Verify that it is running by bringing up the Authorizer dashboard in a browser: http://127.0.0.1:8080/dashboard/

## D - Acknowledgements

Special thanks goes out to Lakhan Samani of Authorizer.
[YouTube channel](https://www.youtube.com/c/LakhanSamani/featured)
[GitHub repo](https://github.com/authorizerdev/authorizer)

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>
