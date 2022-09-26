---
title: "IntelliJ"
description: "IntelliJ IDEA is an integrated development environment written in Java for developing computer software written in Java, Kotlin, Groovy, and other JVM-based languages. It is developed by JetBrains, and is available as an Apache 2 Licensed community edition, and in a proprietary commercial edition."
tags: "ide, ide plugins"
icon: "https://commons.wikimedia.org/wiki/File:IntelliJ_IDEA_Icon.svg"
developer_title: "JetBrains"
developer_url: "https://www.jetbrains.com/idea/"
links:
- title: "IntelliJ Idea Install"
  url: "https://www.jetbrains.com/idea/download/#section=mac"
- title: "IntelliJ IDEA Resources"
  url: "https://www.jetbrains.com/idea/resources/"
---

<div class="nosurface" markdown="1">
_Written by **Cedrick Lunven**, Last Update {{ git_revision_date }}_


- This content has been built using [Reference Documentation ](https://plugins.jetbrains.com/plugin/17013-datastax-astra-db-explorer)
</div>

## A - Overview

<img src="https://plugins.jetbrains.com/files/17013/screenshot_8180f398-3612-4990-9d5b-d1b3917c40fc" height="200px"/>

<img src="https://plugins.jetbrains.com/files/17013/screenshot_04795b62-5479-42c8-b97d-04f0d5459e19" height="200px"/>

IntelliJ IDEA is an integrated development environment written in Java for developing computer software written in Java, Kotlin, Groovy, and other JVM-based languages. It is developed by JetBrains, and is available as an Apache 2 Licensed community edition, and in a proprietary commercial edition.

## B - Prerequisites

<ul class="prerequisites">
  <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
  <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
  <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Have an Astra Token</a></li>
  <li class="nosurface">You should download either Community or Ultimate edition of IntelliJ from <a href="https://www.jetbrains.com/idea/download/?fromIDE=#section=mac">Download Page</a></li>
</ul>


## C - Installation Guide

### <span class="nosurface">✅ </span> 1. Download Plugin

> _[Astra DB Explorer Installation Page](https://github.com/datastax/astra-ide-plugin/wiki/Getting-Started)_

- Open the plugin panel and search for `astra`

```
File > Preferences > Plugins
```

- Click the `[INSTALL]` button

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin.png)

- Once the plugin is downloaded and installed you will be asked to restart

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img//plugin-restart-ide.png)

### <span class="nosurface">✅ </span> 2. Setup Plugin

- During the first restart you will got an `IDE error occured` message it is expected we will now configure the plugin

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-restart-error.png)

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-restart-error2.png)

- The plugin configuration is defined in a file on disk located at `${user.home}/.astra/config`. Fortunately you can do it directly in the IDE

- In the bottom left hand corner locate the panel `astra.explorer` and open it

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-1.png)

### <span class="nosurface">✅ </span> 3. Edit Profiles

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

### <span class="nosurface">✅ </span> 4. Reload Profiles

- Now on the drop down menu select `Reload Profiles`

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-5.png)

- Et voila! You can now list databases on your Astra organization and for each you can see the different keyspaces

![my-pic](https://github.com/datastaxdevs/awesome-astra/raw/main/intellij/img/plugin-setup-6.png)
