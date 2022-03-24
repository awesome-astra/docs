[🏠 Back to HOME](https://awesome-astra.github.io/docs/)

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/tableplus/download.png?raw=true" height="500px" />


- _Last Update `2/11/2022`_
- _This article includes information that was originally written by **Erick Ramirez** on [DataStax Community](https://community.datastax.com/articles/12299/how-to-connect-to-astra-db-from-tableplus.html)_


## A - Overview

TablePlus is a modern, native tool with elegant UI that allows you to simultaneously manage multiple databases such as MySQL, PostgreSQL, SQLite, Microsoft SQL Server and more.

- ℹ️ [Introduction to TablePlus](https://docs.tableplus.com/getting-started)
- 📥 [TablePlus Download Link](https://docs.tableplus.com/#download-and-install)

## B - Prerequisites

- [Create an Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- [Create an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)
- [Download your secure connect bundle ZIP](https://github.com/datastaxdevs/awesome-astra/wiki/Download-the-secure-connect-bundle)

This article assumes you have a running installation of Tableplus on your laptop or PC. It was written for the MacOS version but it should also work for the Windows version.

## C - Installation and Setup

**Note:** For simplicity, the secure connect bundle has been placed in `/path/to/scb`

### ✅ Step 1: DB Information

On your laptop or PC where Tableplus is installed, unpack your secure bundle. For example:

```
$ cd /path/to/scb
$ unzip secure-connect-getvaxxed.zip
```

Here is an example file listing after unpacking the bundle:

```
/
  path/
    to/
      scb/
        ca.crt
        cert
        cert.pfx
        config.json
        cqlshrc
        identity.jks
        key
        trustStore.jks
```

Obtain information about your database from the config.json file. Here is an example:

```
{
  "host": "70bf8560-105f-11ec-a3ea-0800200c9a66-us-west1.db.astra.datastax.com",
  "port": 98765,
  "cql_port": 34567,
  "keyspace": "getvaxxed",
  "localDC": "us-west-2",
  "caCertLocation": "./ca.crt",
  "keyLocation": "./key",
  "certLocation": "./cert",
  "keyStoreLocation": "./identity.jks",
  "keyStorePassword": "Kga1OJ83EF2oBQYR5",
  "trustStoreLocation": "./trustStore.jks",
  "trustStorePassword": "n8F9ptJO3H7YRxTW1",
  "csvLocation": "./data",
  "pfxCertPassword": "9b3HgFChtY60m4nfJ"
}
```

We will use this information to configure Astra DB as the data source in Tableplus.

### ✅ Step 2: New Connection

1. In Tableplus, create a new connection and select **Cassandra** as the target database.

2. In the **Host** and **Port** fields, use the `host` and `cql_port` values in the `config.json` above.

3. In the **User** and **Password** fields, use the client ID and client secret from the token you created in the **Prerequisites** section of this article.

4. In the **Keyspace** field, use the `keyspace` values in the `config.json` above.

5. Choose `SSL VERIFY NONE` for the **SSL mode.**

6. For SSL keys, select the secure bundle files:

- `key` for Key (leave the password blank when prompted)
- `cert` for Cert
- `ca.crt` for CA Cert

Here's an example of what the **Cassandra Connection** dialog box should look like:

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/tableplus/2383-tableplus-cassandra-connection.png?raw=true" height="350px" />

### ✅ Step 3: Final Test

Connect to your Astra DB. If the connection was successful, you should be able to see all the tables on the left-hand side of the UI.

Here's an example output:

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/tableplus/2384-tableplus-astra-connected.png?raw=true" height="350px" />

[🏠 Back to HOME](https://awesome-astra.github.io/docs/)
