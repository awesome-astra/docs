## Questions List

- [Where should I find a **database identifier** ?](#where-should-i-find-a-database-identifier)
- [Where should I find a **database region** name ?](#where-should-i-find-a-database-region-name)
- [How to **create a keyspace or a namespace** ?](#how-to-create-a-namespace-or-keyspace)

## Where should I find a database identifier ?

The database `id` is a unique identifier (`GUID`) for your database. You can find it on the main dashboard of AstraDB. You can copy it to the clip board by clicking the small icon 📋

![db](../../img/faq/where-database-id.png)

_ℹ️ Note that, on the contrary of the identifier, the database name is not unique in an organization. (`project` in the screenshot above)_

## Where should I find a database region name ?

A database can have one or multiple regions. Each regions will have a datacenter Id and a region name. The region name is the one used in the Api Urls.

- Access your database dashboard by clicking its name either in the menu on the left or on the main panel.

![db](../../img/faq/click-db-name.png)

- Locate the region name in the region table. In the screenshot below we do have 2 `europe-west1` and `us-east1`.

![db](../../img/faq/where-database-region.png)

## How to create a namespace or keyspace ?

Namespaces and keyspaces are synonyms. There are 2 ways to create them.

- You can create them when you create a database

![db](../../img/faq/create-db.png?raw=true)

- You can create them on the Database Dashboard in the `Keyspaces` section by clicking the button `Add Keyspace`.

_Access your database dashboard by clicking its name either in the menu on the left or on the main panel._

![db](../../img/faq/click-db-name.png?raw=true)

_Locate the create Keyspace Button on the botton right-hand corner_

![db](../../img/faq/create-keyspace-button.png?raw=true)

_Create Keyspace from its name. The database will switch in `MAINTENANCE` mode for a few seconds but do not worry the application can still request the other keyspaces._

![db](../../img/faq/create-keyspace.png?raw=true)
