# DataStax Astra DB Explorer

*[Astra DB Explorer Plugin webpage](https://plugins.jetbrains.com/plugin/17013-datastax-astra-db-explorer)*

*[Astra DB Explorer Installation Page](https://github.com/datastax/astra-ide-plugin/wiki/Getting-Started)*

Astra DB is a serverless NoSQL database as a service, built on Apache Cassandra (tm). Navigate, insert and edit data in your Astra DB without coding, directly in your favorite JetBrains IDE using this plugin from DataStax. This plugin also works with open source Apache Cassandra 4.0 once a Stargate Data API gateway has been configured.

## Prerequisites

- Having an Astra Account and running Instance
- Having an Astra Token
- Download either Community or ultimate edition of intelliJ from [Download Page](https://www.jetbrains.com/idea/download/?fromIDE=#section=mac)

## Installation Guide


- Open the plugin panel and search for `astra`

```
File > Preferences > Plugins
```

- Click the `[INSTALL]` button

![my-pic](./img/plugin.png)

- Once the plugin is downloaded and installed you will be asked to restart

![my-pic](./img/plugin-restart-ide.png)

- During the first restart you will got an `IDE error occured` message it is expected we will now configure the plugin

![my-pic](./img/plugin-restart-error.png)

![my-pic](./img/plugin-restart-error2.png)

- The plugin configuration is defined in a file on disk located at `${user.home}/.astra/config`. Fortunately you can do it directly in the IDE

- In the bottom left hand corner locate the panel `astra.explorer` and open it

![my-pic](./img/plugin-setup-1.png)

- In the drop down menu select `Edit Profiles` the configuration file is referred as a profile

![my-pic](./img/plugin-setup-2.png)

- You will be asked if you want to create the file, click `[CREATE]`

![my-pic](./img/plugin-setup-3.png)

- Also pick the first option in the radio button *Edit this file anyway*

![my-pic](./img/plugin-setup-4.png)

- The file open and the content should look like. Not that the value used for the `bearerToken` is the one starting by `AstraCS:....`. Save the file

```

[astraProfileFile.profiles]
default = "AstraCS:XXXX"
```

- Now on the drop down menu select `Reload Profiles`

![my-pic](./img/plugin-setup-5.png)

- Et voila you can now list databases on your Astra organization and for each you can see the different keyspaces

![my-pic](./img/plugin-setup-6.png)

## Usage

![my-pic](https://img.youtube.com/vi/d2a0rJd5fZg/maxresdefault.jpg)

