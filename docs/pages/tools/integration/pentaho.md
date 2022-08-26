---
tags: 'integration, middleware, python, IoT'
icon: 'https://awesome-astra.github.io/docs/img/pentaho-data-integration/logo-pentaho.png'
developer_title: 'Hitachi'
developer_url: 'https://sourceforge.net/projects/pentaho/'
links:
- title: "Introduction to PDI"
  url: "https://blog.knoldus.com/introduction-to-pdi/"
- title: "PDI Download Link"
  url: "https://sourceforge.net/projects/pentaho/"
- title: "Linux Installation Guide"
  url: "https://www.hitachivantara.com/en-us/pdf/white-paper/pentaho-ce-installation-guide-on-linux-operating-system-whitepaper.pdf"
- title: "Windows Installation Guide"
  url: "https://www.hitachivantara.com/en-us/pdf/white-paper/pentaho-community-edition-installation-guide-for-windows-whitepaper.pdf"
---

<div class="nosurface" markdown="1">
_Last Update {{ git_revision_date }}_

_This article was originally written by **Erick Ramirez** on [community.datastax.com](https://community.datastax.com/articles/12289/how-to-connect-to-astra-db-from-pentaho-data-integ.html)_

<img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/logo-pentaho.png" height="100px" />
</div>

## Overview

<img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/pdi.png" height="100px" />

Pentaho Data Integration (PDI) provides the Extract, Transform, and Load (ETL) capabilities that facilitate the process of capturing, cleansing, and storing data using a uniform and consistent format that is accessible and relevant to end users and IoT technologies.

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to PDI](https://blog.knoldus.com/introduction-to-pdi/)
- 📥 [PDI Download Link](https://sourceforge.net/projects/pentaho/)
- 📘 [Installation Guide on Linux](https://www.hitachivantara.com/en-us/pdf/white-paper/pentaho-ce-installation-guide-on-linux-operating-system-whitepaper.pdf)
- 📘 [Installation Guide on Windows](https://www.hitachivantara.com/en-us/pdf/white-paper/pentaho-community-edition-installation-guide-for-windows-whitepaper.pdf)
</div>

## Prerequisites

<ul class="prerequisites">
  <li class="nosurface">You should have an <a href="http://astra.datastax.com/">Astra account</a></li>
  <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
  <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Have an Astra Token</a></li>
  <li class="nosurface">You should <a href="/docs/pages/astra/download-scb/">Download your Secure bundle</a></li>
<li>You should <a href="https://sourceforge.net/projects/pentaho/">Download and install PDI</a></li>
</ul>

This article was written for version `9.1` on `MacOS` but it should also work for the Windows version.

## Installation and Setup

### <span class="nosurface">✅ </span>Step 1: Download JDBC Driver

Download the JDBC driver from the DataStax website:

1. Go to https://downloads.datastax.com/#odbc-jdbc-drivers.
2. Select **Simba JDBC Driver for Apache Cassandra.**
3. Select **JDBC 4.2.**
4. Read the license terms and accept it _(click the checkbox)._
5. Hit the blue **Download** button.
6. Once the download completes, **unzip** the downloaded file.

### <span class="nosurface">✅ </span>Step 2: Import Driver JAR in Pentaho

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

      ```bash
      -rw-r--r--  1 erick  vaxxed   16M 14 Sep 22:18 design-tools/data-integration/lib/CassandraJDBC42.jar
      ```

      ```bash
      $ file design-tools/data-integration/lib/CassandraJDBC42.jar
      ```

      - Expected output:

      ```bash
      design-tools/data-integration/lib/CassandraJDBC42.jar: Java archive data (JAR)
      ```

4. Restart Pentaho on your workstation for the Simba driver to be loaded.

### <span class="nosurface">✅ </span>Step 3: Define a connection in Pentaho

> In this section we assume that your database in Astra is called `pentaho` and as such the download secure bundle is called `secure-connect-pentaho.zip`

1. Create a new Transformation.
2. Open a new **Database Connection** dialog box.
3. In the **Connection name** field, give your DB connection a name.
4. Under **Connection type,** select **Generic database.**
5. Set the **Custom connection URL**. _(Note that you will need to specify the full path to your secure bundle and adapt to your database name)_

      ```
       jdbc:cassandra://;AuthMech=2;TunableConsistency=6;SecureConnectionBundlePath=/path/to/secure-connect-pentaho.zip
      ```

6. In the **Username** field, enter the string `token`.
7. In the **Password** field, paste the value of the token you created in the Prerequisites section above. The token looks like `AstraCS:AbC...XYz:123...edf0`
   <img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/pentaho-01-new-astra-connection.png" />
8. Click on the **Test Connection** button to confirm that the driver configuration is working:
   <img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/pentaho-02-test-connection.png" />
9. Click on the OK button to save the connection settings.

### <span class="nosurface">✅ </span>Step 4: Final Test

Connect to your Astra DB by launching the SQL Editor in Pentaho and run a simple CQL statement. For example:

<img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/pentaho-03-sql-editor.png" />

Here's an example output:

<img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/pentaho-04-preview-data.png" />

You should also be able to browse the keyspaces in your Astra DB using the DataBase Explorer. Here's an example output:

<img src="https://awesome-astra.github.io/docs/img/pentaho-data-integration/pentaho-05-db-explorer.png" />

<div class="nosurface" markdown="1">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/) |
</div>
