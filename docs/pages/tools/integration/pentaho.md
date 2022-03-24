<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/pentaho-data-integration/img/logo-pentaho.png?raw=true" height="100px" />

_This article was originally written by **Erick Ramirez** on [community.datastax.com](https://community.datastax.com/articles/12289/how-to-connect-to-astra-db-from-pentaho-data-integ.html)_

## Overview

<img src="https://github.com/datastaxdevs/awesome-astra/blob/3e05907c0a194c92aa96cf88bb26dd1fcb57b2bb/pentaho-data-integration/img/pdi.png?raw=true" height="100px" />

Pentaho Data Integration (PDI) provides the Extract, Transform, and Load (ETL) capabilities that facilitate the process of capturing, cleansing, and storing data using a uniform and consistent format that is accessible and relevant to end users and IoT technologies.

- ℹ️ [Introduction to PDI](https://blog.knoldus.com/introduction-to-pdi/)
- 📥 [PDI Download Link](https://sourceforge.net/projects/pentaho/)
- 📘 [Installation Guide on Linux](https://www.hitachivantara.com/en-us/pdf/white-paper/pentaho-ce-installation-guide-on-linux-operating-system-whitepaper.pdf)
- 📘 [Installation Guide on Windows](https://www.hitachivantara.com/en-us/pdf/white-paper/pentaho-community-edition-installation-guide-for-windows-whitepaper.pdf)

## - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create and Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- You should [Have an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)
- You should [Download your Secure bundle](https://github.com/datastaxdevs/awesome-astra/wiki/Download-the-secure-connect-bundle)
- You should [Download and install PDI](https://sourceforge.net/projects/pentaho/)

This article was written for version `9.1` on `MacOS` but it should also work for the Windows version.

## Installation and Setup

### ✅ Step 1: Download JDBC Driver

Download the JDBC driver from the DataStax website:

1. Go to https://downloads.datastax.com/#odbc-jdbc-drivers.
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it *(click the checkbox).*
5. Hit the blue **Download** button.
6. Once the download completes, **unzip** the downloaded file.

### ✅ Step 2: Import Driver JAR in Pentaho

Deploy the Simba driver to Pentaho servers using the distribution tool:

1. On your laptop or PC, copy the Simba JAR to the JDBC distribution directory:
```bash
$ cp CassandraJDBC42.jar pentaho/jdbc-distribution/
```

2. Run the distribution tool (`distribute-files.bat` on Windows)
```bash
$ cd /Applications/Pentaho/jdbc-distribution
$ ./distribute-files.sh CassandraJDBC42.jar
```

3. Verify that the JAR has been copied to the PDI library:
```bash
$ cd /Applications/Pentaho
$ ls -lh design-tools/data-integration/lib/CassandraJDBC42.jar
```

- Expected output:
```
-rw-r--r--  1 erick  vaxxed   16M 14 Sep 22:18 design-tools/data-integration/lib/CassandraJDBC42.jar
```

```bash
$ file design-tools/data-integration/lib/CassandraJDBC42.jar
```

- Expected output:
```
design-tools/data-integration/lib/CassandraJDBC42.jar: Java archive data (JAR)
```

4. Restart Pentaho on your workstation for the Simba driver to be loaded.

### ✅ Step 3: Define a connection in Pentaho

> In this section we assume that your database in Astra is called `pentaho` and as such the download secure bundle is called `secure-connect-pentaho.zip`

1. Create a new Transformation.
2. Open a new **Database Connection** dialog box.
3. In the **Connection name** field, give your DB connection a name.
4. Under **Connection type,** select **Generic database.**
5. Set the **Custom connection URL**. *(Note that you will need to specify the full path to your secure bundle and adapt to your database name)*
```
jdbc:cassandra://;AuthMech=2;TunableConsistency=6;SecureConnectionBundlePath=/path/to/secure-connect-pentaho.zip
```
6. In the **Username** field, enter the string `token`.
7. In the **Password** field, paste the value of the token you created in the Prerequisites section above. The token looks like `AstraCS:AbC...XYz:123...edf0`
> <img src="https://github.com/datastaxdevs/awesome-astra/blob/3e05907c0a194c92aa96cf88bb26dd1fcb57b2bb/pentaho-data-integration/img/pentaho-01-new-astra-connection.png?raw=true" />
8. Click on the **Test Connection** button to confirm that the driver configuration is working:
> <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/pentaho-data-integration/img/pentaho-02-test-connection.png?raw=true" />
9. Click on the OK button to save the connection settings.


### ✅ Step 4: Final Test

Connect to your Astra DB by launching the SQL Editor in Pentaho and run a simple CQL statement. For example:

> <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/pentaho-data-integration/img/pentaho-03-sql-editor.png?raw=true" />

Here's an example output:

> <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/pentaho-data-integration/img/pentaho-04-preview-data.png?raw=true" />

You should also be able to browse the keyspaces in your Astra DB using the DataBase Explorer. Here's an example output:

> <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/pentaho-data-integration/img/pentaho-05-db-explorer.png?raw=true" />

