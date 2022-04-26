[🏠 Back to home](https://awesome-astra.github.io/docs/) | _Written by **Cedrick Lunven**, Last Update `2/18/2022`_

- This content has been built using [Reference Documentation ](https://plugins.jetbrains.com/plugin/17013-datastax-astra-db-explorer)

## A - Overview

<img src="https://plugins.jetbrains.com/files/17013/screenshot_8180f398-3612-4990-9d5b-d1b3917c40fc" height="200px"/>

<img src="https://plugins.jetbrains.com/files/17013/screenshot_04795b62-5479-42c8-b97d-04f0d5459e19" height="200px"/>

Astra DB is a serverless NoSQL database as a service, built on Apache Cassandra (tm). Navigate, insert and edit data in your Astra DB without coding, directly in your favorite JetBrains IDE using this plugin from DataStax. This plugin also works with open source Apache Cassandra 4.0 once a Stargate Data API gateway has been configured.

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create and Astra Database](/pages/astra/create-instance/)
- You should [Have an Astra Token](/pages/astra/create-token/)
- You should download either Community or ultimate edition of intelliJ from [Download Page](https://www.jetbrains.com/idea/download/?fromIDE=#section=mac)

## C - Installation Guide

### ✅ 1. Download Plugin

> _[Astra DB Explorer Installation Page](https://github.com/datastax/astra-ide-plugin/wiki/Getting-Started)_

- Open the plugin panel and search for `astra`

```
File > Preferences > Plugins
```

- Click the `[INSTALL]` button

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin.png)

- Once the plugin is downloaded and installed you will be asked to restart

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img//plugin-restart-ide.png)

### ✅ 2. Setup Plugin

- During the first restart you will got an `IDE error occured` message it is expected we will now configure the plugin

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-restart-error.png)

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-restart-error2.png)

- The plugin configuration is defined in a file on disk located at `${user.home}/.astra/config`. Fortunately you can do it directly in the IDE

- In the bottom left hand corner locate the panel `astra.explorer` and open it

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-1.png)

### ✅ 3. Edit Profiles

- In the drop down menu select `Edit Profiles` the configuration file is referred as a profile

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-2.png)

- You will be asked if you want to create the file, click `[CREATE]`

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-3.png)

- Also pick the first option in the radio button _Edit this file anyway_

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-4.png)

- The file open and the content should look like. Not that the value used for the `bearerToken` is the one starting by `AstraCS:....`. Save the file

```

[astraProfileFile.profiles]
default = "AstraCS:XXXX"
```

### ✅ 4. Reload Profiles

- Now on the drop down menu select `Reload Profiles`

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-5.png)

- Et voila you can now list databases on your Astra organization and for each you can see the different keyspaces

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-6.png)
