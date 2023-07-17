---
title: "Microsoft Power Query"
description: "Microsoft Power Query ..."
tags: "microsoft, third party tools, etl, workflow, powerbi"
icon: "https://awesome-astra.github.io/docs/img/microsoft-powerquery/microsoft-powerquery.svg"
recommended: "true"
developer_title: "Microsoft"
developer_url: "https://powerquery.microsoft.com/en-us/"
links:
- title: "Power Query Desktop download (Microsoft)"
  url: "https://learn.microsoft.com/en-us/power-query/power-query-ui"
- title: "Astra DB connector, Releases page"
  url: "https://github.com/datastax/powerquery_astra_db_connector/releases/latest"
- title: "Personal Data Gateway support page (Microsoft)"
  url: "https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-install#download-and-install-a-personal-mode-gateway"
- title: "DataStax ODBC Drivers for Windows"
  url: "https://downloads.datastax.com/#odbc-jdbc-drivers"
---

<div class="nosurface" markdown="1">

<!-- <img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/microsoft-powerquery_logo.png" style="height: 180px;" /> -->
<img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/microsoft-powerquery_logo.png" style="height: 180px;" />
</div>

## Overview

Microsoft Power Query is a data preparation and transformation ETL engine that
lets you connect to various data sources. Power Query is available in
Microsoft Excel, Power BI, Power BI dataflows, Azure Data Factory wrangling
dataflows, SQL Server Analysis Services, and much more. A great number of
disparate data sources is available thanks to its support for third-party
"plugins" (i.e. Connectors).

You have two options to connect Power Query to Astra:
1. either through a standard **Power Query ODBC connector**, paired with the
**DataStax ODBC Driver** for Apache Cassandra;
2. or **directly** through our **Power Query custom connector**.
Keep reading to find out which one is best suited to your needs.

!!! note
  Power Query and the related data products run only on Microsoft Windows.

  In the following, out of several [products and services](https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query#where-can-you-use-power-query), usage with Microsoft Power BI (Desktop and Service) is assumed.
  
  Depending on the product/service you are using, the appearance will vary; also, some of the features might also differ.

The Power Query engine, which operates the Connector, can run in three different modes: with reference to
Power BI, the possible setups are:

- **Local**, where the engine is contained in Power BI Desktop, hence the connector runs on-premises;
- **Data Gateway**, where the cloud product Power BI Service is used, which receives the connector data through an installed On-Premises Data Gateway (whether in "personal mode" or not);
- **Cloud**, where the whole stack runs in Azure's cloud. _This requires a connector certified by Microsoft; moreover, for security reasons, it cannot make use of any external dependency (such as a custom ODBC driver)._

![Power Query running modes](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-run-modes.png)

Here is the support matrix for these options:

| Mode         | ODBC Connector     | Custom Connector |
|--------------|-----------|------------|
| Local        | OK (requires Simba ODBC driver) | OK (currently self-signed) |
| Data Gateway | OK (requires Simba ODBC driver) | OK (currently self-signed) |
| Cloud        | **NO** (security limitations from Azure) | _pending_ (certification in progress) |

In the following, the various ways to connect with data from Astra DB are outlined:
keep in mind that, reagardless whether through ODBC or the Custom connector,
you will need to successfully create a report locally before publishing it
to Power BI Service.

??? danger "Precautions about very large tables"
  Regardless of whether you use the ODBC or the Custom connector, reading indiscriminately from a very large table is a process that can last a long time.

  **It is discouraged to fully import huge tables through Power Query**.
  If you do, chances are you will see something like this "preview" dialog for a long time:

  ![Stuck on very large tables](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-lt-1-evaluating.png)

  In essence, this is a manifestation of Cassandra's take on data models and its OLTP-first nature, whereby tables should be generally designed to support single-partition queries only (and not whole-table scans). In practice, this potential issue can reasonably be ignored below the 10k-100k-rows mark _(depending on factors such as your latency requirements, the network bandwidth and cost, and the average row size)_.

  The ODBC connector lets you _specify a query string_ in order to `SELECT` a subset of rows from very large tables: as long as the query complies with Cassandra's data modeling best practices, this is a sensible approach. **Keep reading for details.**

  The Custom connector, conversely, is _not suitable for very large tables_ as it only supports reading a table in full.

  _In any case, keep in mind that by reading from massive tables one might unwittingly consume a sizeable amount of Astra credits._

## ODBC connection (local)

This way of connecting works by first creating and configuring,
outside of Power Query, an ODBC connection
right to your specific target database and then simply
connecting to it (without specifying additional connection parameters anymore)
from Power Query (e.g. from Power BI). Let's see how this works.

### Pre-requisites

!!! note
  In the following it is assumed that you have a local installation of [Power BI Desktop](https://learn.microsoft.com/en-us/power-query/power-query-ui). Consult the Microsoft documentation if your goal is to use another of the products that support Power Query.

#### Database

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a>.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a>.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a>. You will need the various string fields contained therein.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a>.</li>
</ul>

??? note "Minimal token permissions"
  While you can certainly use a standard "Database Administrator" token, you may want to use a least-privilege token for this data connection through the ODBC connector. These are the specifications for a minimal Custom Role for this purpose:

  - The token must have, in Table Permissions, (1) _Select Table_ and (2) _Describe Table_; and (3) in API Access it needs _CQL_;
  - It is OK if the token is scoped to just the one DB that is being used;
  - If the token is disallowed on certain keyspaces, you will still be able to list the tables they contain, but **you will get a permission error if trying to read data from them**.

  <img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-tk-1-odbcminimalpermissions.png" width="70%" />

!!! note
  You might find it convenient to have some tables with data in your database in order to ensure the connection works all right. See Awesome Astra's ["Load and Export"](/pages/data/#load-and-export) page for suggestions on how to load data in Astra DB.

#### ODBC Driver

You need to install and configure the "DataStax ODBC Driver for Apache Cassandra" on your Windows machine.
A useful reference during these steps is the [Install Guide](https://downloads.datastax.com/odbc-cql/2.6.2.1002/DataStax_ODBC_Driver_for_Cassandra_and_DSE_Install_Guide.pdf).

**First**, visit this [download link](https://downloads.datastax.com/#odbc-jdbc-drivers) and select your architecture (most probably the 64-bit one will do).

**Second** install the driver (by double-clicking on the `*.msi` Windows installer
file you just downloaded and following the instructions).

**Third** you need to [download and install](https://www.microsoft.com/en-ca/download/details.aspx?id=40784) the "Visual C++ 2013 redistributable bundle" on your Windows machine.

**Fourth**. Run the **ODBC Data Source Administrator** program on Windows (choose _Run as administrator_). In the taskbar the program will show as "ODBC Data Sources (64-bit)".

1. Go to the "System DSN" tab click "Add..." to create a new Data Source, selecting the _DataStax Cassandra ODBC Driver_;
2. Configure the source (check the Install Guide linked above for details):
    - Authentication mechanisms is _Cloud secure connect bundle_;
    - User name is `token` (the literal lower-case word "token"!);
    - Password is the string starting with `AstraCS:...` in your Database Token;
    - Upload your Secure Connect Bundle zip file;
    - Choose a "Data source name";
    - Choose a "Description";
    - Set the "Default keyspace" to a keyspace in your database.
3. Hit the "Test ..." button and make sure you get back a "Test completed successfully" message.

??? quote "Visual guide"
  Starting the Manager:

  ![ODBC pre-requisites, Start ODBC Manager](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-odpre-1-startodbc.png)

  Creating the Data source:

  ![ODBC pre-requisites, Create Data source](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-odpre-2-create.png)

  Configuring the Data source:

  ![ODBC pre-requisites, Setup Data source](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-odpre-3-setup.png)

  The "Advanced settings" can be left to their defaults:

  ![ODBC pre-requisites, Leave Advanced settings unchanged](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-odpre-4-advanced.png)

  Testing the Data source:

  ![ODBC pre-requisites, Test data source](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-odpre-5-test.png)

Close the ODBC Administrator. You are ready to launch Power BI Desktop and head for the next section.

### How-to

Now that you have configured your Astra DB as a specific ODBC data source,
all that remains is to channel the data coming from it into a report.

Open Power BI Desktop and go through the "Get Data" action (usually the first
choice when starting the program). Choose the standard ODBC source among the
proposed connectors _(tip: you can restrict the list by typing a search term)_.

??? quote "Visual guide"
  Click "Get Data":

  ![ODBC, Get data in Power BI](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-1-getdata.png)

  Choose the ODBC connector:

  ![ODBC, Choose ODBC connector](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-2-connector.png)

In the configuration of the ODBC connector, pick the "Data source name (DSN)"
you just created, i.e. your Astra DB connection.

You can leave the "Advanced options" as they are; however, if you need to specify
a **custom query** (typically to restrict the data ingestion to a subset
of the whole table, such as a single partition), expand the options and write
an appropriate `SELECT` CQL query.

??? quote "Visual guide"
  Choosing the Data Source Name (DSN) for the ODBC connection:

  ![ODBC, Choose Data Source Name](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-3-dsn.png)

  (**Optional**) adding a CQL query in the Advanced options:

  ![ODBC, Choose Data Source Name](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-3b-sqlstatement.png)

You will need to **provide authentication credentials once more** at this point:
enter again `token` as user and your `AstraCS:...` string as password, and
leave the connection string empty. Confirm and wait a few seconds for the
connection to be established.

??? quote "Visual guide"
  ![ODBC, Enter credentials](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-4-token.png)

You will finally be able to explore the data in your database in Power BI's
"Navigator" preview, in the form of a "database / keyspaces / tables"
navigable hierarchy.

??? quote "Visual guide"
  ![ODBC, Preview data](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-5-preview.png)

Now you can select a table and hit "Load" (or "Transform data"):
the data will be available in Power BI
Desktop for you, e.g. to create a report which you can save to (local) file.
See the "Power BI Service" section below if you want to bring the report to the cloud.

??? quote "Visual guide"
  ![ODBC, Report created](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-od-6-report.png)



## Astra DB Custom connector (local)

When using the Custom connector, no ODBC is involved: the connector
uses directly the REST API endpoints to access your database data.
Pending completion of the certification process, you need to install
the connector as a self-signed plugin and authorize Power BI Desktop
to run it.

![Power Query Custom connector, flow](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-connector-flow.png)

### Pre-requisites

!!! note
  In the following it is assumed that you have a local installation of [Power BI Desktop](https://learn.microsoft.com/en-us/power-query/power-query-ui). Consult the Microsoft documentation if your goal is to use another of the products that support Power Query.

#### Database

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a>. Note that in this case you only need the "token" string, i.e. the one starting with "AstraCS:...".</li>
</ul>

??? note "Minimal token permissions"
  While you can certainly use a standard "Database Administrator" token, you may want to use a least-privilege token for this data connection through the Custom connector. These are the specifications for a minimal Custom Role for this purpose:

  - The token must have, in Table Permissions, (1) _Select Table_ and (2) _Describe Table_; and (3) in API Access it needs _REST_;
  - It is OK if the token is scoped to just the one DB that is being used;
  - If the token is disallowed on certain keyspaces, they will show up as empty in the connector's resulting navigation table.

  <img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-tk-1-customconnectorminimalpermissions.png" width="70%" />

!!! note
  You might find it convenient to have some tables with data in your database in order to ensure the connection works all right. See Awesome Astra's ["Load and Export"](/pages/data/#load-and-export) page for suggestions on how to load data in Astra DB.

#### Custom connector setup

This section explains how the Astra DB Custom connector is installed locally.
For more information, check the connector [project](https://github.com/datastax/powerquery_astra_db_connector#readme) on GitHub.

!!! note
  As soon as the connector will be certified by Microsoft, manual installation will be unnecessary, as the connector will ship bundled with Power BI already.

**First**, obtain the latest `PQX` file from the [releases](https://github.com/datastax/powerquery_astra_db_connector/releases/latest)
page and place the file in (your equivalent for) directory
`C:\Users\USER\Documents\Power BI Desktop\Custom Connectors`.

Now, as long as the connector awaits certification, it will run as "self-signed",
so you need a way to tell Power BI that you do indeed trust it to run.
To this aim, you can either list the certificate thumbprint as "trusted"
in your system (recommended) or alternatively enable untrusted extensions in PowerBI.

##### Trusted certificate thumbprint

To mark the thumbprint as trusted, the steps are outlined at [this link](https://learn.microsoft.com/en-us/power-bi/connect-data/desktop-trusted-third-party-connectors):

- Open `regedit` as admin;
- Locate the key `HKEY_LOCAL_MACHINE\Software\Policies\Microsoft\Power BI Desktop`, creating it if absent;
- In this key, create a multi-string (`REG_MULTI_SZ`) entry named `TrustedCertificateThumbprints`;
- The value must be a newline-separated string (right-click, Modify to edit as text), each with a trusted thumbprint;
- Enter the following thumbprint of the certificate used to sign the connector releases:

```
1BB690F359432E849D06FDEA4E82573B279AAD75
```

??? quote "Visual guide"
  ![Custom connector pre-requisites, Configure Thumbprint in regedit](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-ccpre-1a-regeditthumbprint.png)

You can now close `regedit` and move on.

##### Enable untrusted connectors

_Note: you don't need to do this if you marked the signer's thumbprint as trusted as per the instructions above._

Alternatively, if you don't have admin access to `regedit`, you can lower the overall security level of PowerBI Desktop as outlined [here](https://learn.microsoft.com/en-us/power-query/install-sdk#power-bi-desktop):

`File` => `Options and Settings` => `Options` => `Security` => in "Data Extensions", choose
_Allow any data extension to load without validation or warning_. Then restart PowerBI Desktop.

??? quote "Visual guide"
  Go to Power BI Desktop's Settings:

  ![Custom connector pre-requisites, Get to Power BI settings](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-ccpre-1b-pbisettings.png)

  Enable untrusted extensions:

  ![Custom connector pre-requisites, Disable extension validation](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-ccpre-2b-pbinovalidation.png)


### How-to

Now you can **start PowerBI Desktop**, choose **"Get Data"**, search for the **"Astra DB" connector** and select it. A warning will show up about the connector being a third-party plugin
in beta version: you can dismiss it and move on.

??? quote "Visual guide"
  Click "Get Data":

  ![Custom connector, Get data in Power BI](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-1-getdata.png)

  Choose the "Astra DB" connector:

  ![Custom connector, Choose Astra DB connector](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-2-connector.png)

  Dismiss the warning about a third-party connector:

  ![Custom connector, A warning about a third-party beta plugin](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-3-warning.png)

You will then be asked for the **connection details**: [database ID](https://awesome-astra.github.io/docs/pages/astra/faq/?h=database+id#where-should-i-find-a-database-identifier) and [region](https://awesome-astra.github.io/docs/pages/astra/faq/?h=database+id#where-should-i-find-a-database-region-name).

??? quote "Visual guide"
  ![Custom connector, Entering connection parameters](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-4-connectionparams.png)

Next, you will provide the **"Database Token"** (the string starting with `AstraCS:...`) as credentials.

??? quote "Visual guide"
  ![Custom connector, Entering database Token](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-5-token.png)

At this point you will be able to explore the data in your database in Power BI's
"Navigator" preview, in the form of a "keyspaces / tables"
navigable hierarchy.

??? quote "Visual guide"
  ![Custom connector, Preview data](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-6-preview.png)

Now you can select a table and hit "Load" (or "Transform data"): the data will be available in Power BI
Desktop for you, e.g. to create a report which you can save to (local) file.
See the "Power BI Service" section below if you want to bring the report to the cloud.

??? quote "Visual guide"
  ![Custom connector, Report created](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-cc-7-report.png)



## Power BI Service (with a Data Gateway)

You can publish the report to the cloud product Power BI Service with the help
of an On-Premises Data Gateway.

!!! note
  In the following it is assumed that you have a Power Query Service account (logged to the same account as the Desktop version). Consult the Microsoft documentation if your goal is to use another of the products that support Power Query.

### Pre-requisites

#### Desktop setup

First complete one of the Desktop flows described above (i.e. either
the ODBC option or the Custom connector option) and successfully create
a report powered by data from Astra DB.

You need to additionally **install a Data Gateway** which will serve as data bridge
between the locally-running connector and the data source as seen on
Power BI Service (running in Azure's cloud).
See [here](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-install#download-and-install-a-personal-mode-gateway)
for the "personal mode" installation (easiest) or
[here](https://learn.microsoft.com/en-us/data-integration/gateway/service-gateway-install#download-and-install-a-standard-gateway)
for an enterprise, production-grade setup. (See also this
[community blog post](https://community.fabric.microsoft.com/t5/Community-Blog/Custom-Data-Connector-How-to-Deploy-and-Test/ba-p/862678)
for gateway troubleshooting tips, also covering how to make sure
that the custom-connector directory is the same as for Power BI Desktop.)

??? quote "Visual guide"
  Starting the Data Gateway interface:

  ![Power BI Service pre-requisites, starting the Data Gateway](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-svpre-1-startdg.png)

  Checking the "Custom data connectors" it has detected:

  ![Power BI Service pre-requisites, the Data Gateway](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-svpre-2-dg.png)

### How-to

Make sure you **save** the report you created to a local `pbix` file.

From the Power BI Desktop main menu, pick "File" / "Publish to Power BI",
choosing your destination workspace.
This will **upload the report**, and the associated "Dataset", to the cloud service
in your account.

??? quote "Visual guide"
  The "Publish" item in Power BI Desktop's menu:

  ![Power BI Service, How to publish a report](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-1-pbipublishmenu.png)

  Publishing a report:

  ![Power BI Service, Publishing the report](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-2-pbipublishworkspace.png)

Open [app.powerbi.com](https://app.powerbi.com/) and check that you are logged
in with the correct account. Navigate to the chosen workspace, where you should
**see the newly-uploaded report**. Click on its name to open it.

??? quote "Visual guide"
  Your workspace on Power BI Service:

  ![Power BI Service, Checking your workspace](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-3-workspace.png)

  Viewing a report:

  ![Power BI Service, Viewing a report](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-4-report.png)

Now you have to check that Power BI Service can read from Astra DB.
Go back to the workspace and click
the **"Refresh now"** button next to the dataset name (you must hover on the dataset
for the
<img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-5c-refreshbutton.png" style="height: 1.4em; vertical-align: middle;"/>
button to show up).

??? quote "Visual guide"
  Hover on the data source name to reveal the buttons:

  ![Power BI Service, Refreshing a data source](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-5-refresh.png)

This will fail, as signaled by a tiny "danger" icon next to
the date in the "refreshed" column,
for lack of credentials (indeed, the Desktop and the Service product
do not share any credential store). To provide the credentials, click
the **"Schedule refresh"** button for the dataset
(hover with the mouse again to reveal the
<img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-5b-schedulerefreshbutton.png" style="height: 1.4em; vertical-align: middle;"/>
button)
and look for the "Data source credentials"
section in the settings page you just reached.

??? quote "Visual guide"
  A failed data refresh:

  ![Power BI Service, Refresh has failed](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-6-refreshfailure.png)

  The Data Source settings _for the ODBC method_:

  ![Power BI Service, Get to Data Source Settings (ODBC)](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-7od-settings.png)

  The Data Source settings _for the Custom connector method_:

  ![Power BI Service, Get to Data Source Settings (Custom connector)](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-7cc-settings.png)

Choose "Edit credentials"
to insert the required secrets, right as you did for the Desktop setup.
Note that depending on the connection method you are using, the Credentials
dialog will require either the `token`/`AstraCS:...` pair or just the
`AstraCS:...` token string (for ODBC and Custom connector, respectively).

??? quote "Visual guide"
  Entering the credentials _for the ODBC method_:

  ![Power BI Service, Enter credentials (ODBC)](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-8od-token.png)

  Entering the credentials _for the Custom connector method_:

  ![Power BI Service, Enter credentials (Custom connector)](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-8cc-token.png)

  Credentials are updated (_ODBC_):

  ![Power BI Service, Credentials updated (ODBC)](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-9od-updated.png)

  Credentials are updated (_Custom connector_):

  ![Power BI Service, Credentials updated (Custom connector)](https://awesome-astra.github.io/docs/img/microsoft-powerquery/power-query-howto-sv-9cc-updated.png)

Then click "Sign in" to confirm the credentials, go back to the workspace
and try "Refresh now" again. There should be no errors anymore.

As a confirmation **exercise**, you can try changing some data on the
table in an obvious way, then triggering a refresh, and finally opening the report
again (you may need to reload the browser page to see the change finally reflected
in your report).

??? tip "Further problems during data refresh"
  If you notice the small "danger" icon next to the dataset persists, there is presumably something wrong with the data connection. Please check the above-mentioned [community blog post](https://community.fabric.microsoft.com/t5/Community-Blog/Custom-Data-Connector-How-to-Deploy-and-Test/ba-p/862678) as a valid starting point for your troubleshooting journey.
