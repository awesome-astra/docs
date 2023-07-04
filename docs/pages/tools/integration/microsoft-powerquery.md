---
title: "Microsoft Power Query"
description: "Microsoft Power Query ..."
tags: "microsoft, third party tools, etl, workflow, powerbi"
icon: "https://awesome-astra.github.io/docs/img/microsoft-powerquery/microsoft-powerquery.svg"
recommended: "true"
developer_title: "Microsoft"
developer_url: "https://powerquery.microsoft.com/en-us/"
links:
- title: "Link A"
  url: ""
- title: "Link B"
  url: ""
---

<div class="nosurface" markdown="1">

<!-- <img src="https://awesome-astra.github.io/docs/img/microsoft-powerquery/microsoft-powerquery_logo.png" style="height: 180px;" /> -->
<img src="/img/microsoft-powerquery/microsoft-powerquery_logo.png" style="height: 180px;" />
</div>

## Overview

Microsoft Power Query is a data preparation and transformation ETL engine that
lets you connect to various data sources. Power Query is available in
Microsoft Excel, Power BI, Power BI dataflows, Azure Data Factory wrangling
dataflows, SQL Server Analysis Services, and much more. A great number of
disparate data sources is available thanks to its support for third-party
"plugins" (i.e. Connectors).

You have two options to connect Power Query to Astra:
1. either through a standard **Power Query ODBC connector** and the **DataStax ODBC Driver** for Apache Cassandra;
2. or **directly** through our **Power Query custom connector**.
Keep reading to find out which one is best suited to your needs.

!!! note

    Power Query and the related data products run only on Microsoft Windows.

    In the following, out of several [products and services](https://learn.microsoft.com/en-us/power-query/power-query-what-is-power-query#where-can-you-use-power-query),
    usage with Microsoft Power BI (Desktop and Service) is assumed.

    Depending on the product/service you are using, the appearance will
    vary; also, some of the features might also differ.

The Power Query engine, which operates the Connector, can run in three different modes: with reference to
Power BI, the possible setups are:

- **Local**, where the engine is contained in Power BI Desktop, hence the connector runs on-premises;
- **Data Gateway**, where the cloud product Power BI Service is used, which receives the connector data through an installed On-Premises Data Gateway (whether in "personal mode" or not);
- **Cloud**, where the whole stack runs in Azure's cloud. _This requires a connector certified by Microsoft; moreover, for security reasons, it cannot make use of any external dependency (such as a custom ODBC driver)._

![Power Query running modes](/img/microsoft-powerquery/power-query-run-modes.png)

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




## ODBC connection (local)

This way of connecting works by first creating and configuring,
outside of Power Query, an ODBC connection
right to your specific target database and then simply
connecting to it (without specifying additional connection parameters anymore)
from Power Query (e.g. from Power BI). Let's see how this works.

### Pre-requisites

!!! note

    in the following it is assumed that you have a local installation
    of [Power BI Desktop](https://learn.microsoft.com/en-us/power-query/power-query-ui). Consult the Microsoft
    documentation if your goal is to use another of the products that support
    Power Query.

#### Database

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a>.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a>.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a>. You will need the various string fields contained therein.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a>.</li>
</ul>

!!! note

    You might find it convenient to have some tables with data in your database in order
    to ensure the connection works all right.
    See Awesome Astra's ["Load and Export"](/pages/data/#load-and-export) page for suggestions on how to load data in Astra DB.

#### ODBC Driver

You need to install and configure the "DataStax ODBC Driver for Apache Cassandra" on your Windows machine.
A useful reference during these steps is the [Install Guide](https://downloads.datastax.com/odbc-cql/2.6.2.1002/DataStax_ODBC_Driver_for_Cassandra_and_DSE_Install_Guide.pdf).

**First**, visit this [download link](https://downloads.datastax.com/#odbc-jdbc-drivers) and select your architecture (most probably the 64-bit one will do).

**Second** install the driver (by double-clicking on the file you just downloaded and following the instructions).

**Third** you need to [download and install](https://www.microsoft.com/en-ca/download/details.aspx?id=40784) the "Visual C++ 2013 redistributable bundle" on your Windows machine.

**Fourth**. At this point, open the **ODBC Data Source Administrator** program on Windows:

1. Create a "Data Source" starting from the _Cassandra ODBC Driver_;
2. Configure the source (check the Install Guide linked above for details): choose "Astra mode" and input username/password (i.e. the "Client ID" and "Client Secret" from your Database Token), and upload the Secure Connect Bundle you got earlier;
3. Hit the "Test connection" button and make sure you get back a "Success" message. You are ready to launch Power BI Desktop and head for the next section.

### How-to

Now that you have configured your Astra DB as a specific ODBC data source,
all that remains is to channel the data coming from it into a report.

Open Power BI Desktop and go through the "Get Data" action (usually the first
choice when starting the program). Choose the standard ODBC source among the
proposed connectors _(tip: you can restrict the list by typing a search term)_.

In the configuration of the ODBC connector, pick the data source
you just created, i.e. your Astra DB connectin.

You will need to **provide authentication credentials once more** at this point.
You can pass the Client ID and the Client Secret from your database Token as a single
connection string:

```
UID=5pzMlk...;PWD=M5hLkp93db...
```

At this point you will be able to explore the data in your database in Power BI's
"Navigator" preview, in the form of a "database / keyspaces / tables"
navigable hierarchy.

Now you can select a table and hit "Load": the data will be available in Power BI
Desktop for you, e.g. to create a report which you can save to (local) file.
See the "Power BI Service" section below if you want to bring the report to the cloud.




## Astra DB Custom connector (local)

When using the Custom connector, no ODBC is involved: the connector
uses directly the REST API endpoints to access your database data.
Pending completion of the certification process, you need to install
the connector as a self-signed plugin and authorize Power BI Desktop
to run it.

![Power Query Custom connector, flow](/img/microsoft-powerquery/power-query-connector-flow.png)

### Pre-requisites

!!! note

    in the following it is assumed that you have a local installation
    of [Power BI Desktop](https://learn.microsoft.com/en-us/power-query/power-query-ui). Consult the Microsoft
    documentation if your goal is to use another of the products that support
    Power Query.

#### Database

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a>. Note that in this case you only need the "token" string, i.e. the one starting with "AstraCS:...".</li>
</ul>

??? note "Minimal token permissions"

    While you can certainly use a standard "Database Administrator" token,
    you may want to use a least-privilege token for this data connection.
    These are the specifications for a minimal Custom Role for this purpose:

    - The token must have, in Table Permissions, (1) _Select Table_ and (2) _Describe Table_; and (3) in API Access it needs _REST_;
    - It is OK if the token is scoped to just the one DB that is being used;
    - If the token is disallowed on certain keyspaces, they will show up as empty in the connector's resulting navigation table.

    <img src="/img/microsoft-powerquery/power-query-connector-minimal-token.png" width="70%" />

!!! note

    You might find it convenient to have some tables with data in your database in order
    to ensure the connection works all right.
    See Awesome Astra's ["Load and Export"](/pages/data/#load-and-export) page for suggestions on how to load data in Astra DB.

#### Custom connector setup

This section explains how the Astra DB Custom connector is installed locally.
For more information, check the connector [project](https://github.com/hemidactylus/powerquery_astra_db_connector#readme) on GitHub.

!!! note

    as soon as the connector gets certified by Microsoft, manual installation
    will be unnecessary, as the connector will ship bundled with Power BI already.

**First**, obtain the latest `PQX` file from the [releases](https://github.com/hemidactylus/powerquery_astra_db_connector/releases)
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

##### Enable untrusted connectors

_Note: you don't need to do this if you marked the signer's thumbprint as trusted as per the instructions above._

Alternatively, if you don't have access to `regedit`, you can lower the overall security level of PowerBI Desktop as outlined [here](https://learn.microsoft.com/en-us/power-query/install-sdk#power-bi-desktop):

`File` => `Options and Settings` => `Options` => `Security` => in "Data Extensions", choose
_Allow any data extension to load without validation or warning_. Then restart PowerBI Desktop.

### How-to

Now you can **start PowerBI Desktop**, choose **"Get Data"**, search for the **"Astra DB" connector** and select it.

You will then be asked for the **connection details**: [database ID](https://awesome-astra.github.io/docs/pages/astra/faq/?h=database+id#where-should-i-find-a-database-identifier) and [region](https://awesome-astra.github.io/docs/pages/astra/faq/?h=database+id#where-should-i-find-a-database-region-name).

Next, you will provide the **"Database Token"** (the string starting with `AstraCS:...`) as credentials.

At this point you will be able to explore the data in your database in Power BI's
"Navigator" preview, in the form of a "keyspaces / tables"
navigable hierarchy.

Now you can select a table and hit "Load": the data will be available in Power BI
Desktop for you, e.g. to create a report which you can save to (local) file.
See the "Power BI Service" section below if you want to bring the report to the cloud.




## Power BI Service (with a Data Gateway)

You can publish the report to the cloud product Power BI Service with the help
of an On-Premises Data Gateway.

!!! note

    in the following it is assumed that you have a Power Query Service
    account (logged to the same account as the Desktop version).
    Consult the Microsoft documentation if your goal is to use another
    of the products that support Power Query.

### Pre-requisites

#### Desktop setup

First complete one of the the Desktop flows described above (i.e. either
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

### How-to

Make sure you **save** the report you created to a local `pbx` file.

From the Power BI Desktop main menu, pick "File" / "Publish to Power BI",
choosing your destination workspace.
This will **upload the report**, and the associated "Dataset", to the cloud service
in your account.

Open [app.powerbi.com](https://app.powerbi.com/) and check that you are logged
in with the correct account. Navigate to the chosen workspace, where you should
**see the newly-uploaded report**. Click on its name to open it.

The last test is about data refresh. Go back to the workspace and click
the **"Refresh now"** button next to the dataset name (you must hover on the dataset
for the buttons to show up).

This will fail, as signaled by a tiny "danger" icon next to the buttons,
for lack of credentials (indeed, the Desktop and the Service product
do not share any credential store). To provide the credentials, click
the **"Schedule refresh"** button for the dataset and look for the "Credentials"
section in the settings page you just reached. Insert the required secrets as you
did for the Desktop setup.
Then click "Apply" and try refreshing again. There should be no errors anymore.

As a confirmation **exercise**, you can try changing some data on the
table in an obvious way, then triggering a refresh, and finally opening the report
again (you may need to reload the browser page to see the change finally reflected
in your report).

??? warning "Failure during data refresh"

    If you the small "danger" icon next to the dataset persists,
    there is presumably something wrong with the data connection.
    Please check the above-mentioned [community blog post](https://community.fabric.microsoft.com/t5/Community-Blog/Custom-Data-Connector-How-to-Deploy-and-Test/ba-p/862678)
    as a valid starting point for your troubleshooting journey.
