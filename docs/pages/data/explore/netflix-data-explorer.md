---
title: "Netflix Data Explorer"
description: "The Netflix Data Explorer is a web-based tool that will help you navigate and edit your data."
tags: "cql, data management, ide"
icon: "https://awesome-astra.github.io/docs/img/netflix-data-explorer/netflix_oss.png"
developer_title: "Netflix"
developer_url: "https://github.com/Netflix/nf-data-explorer"
links:
- title: "Data Explorer Blog"
  url: "https://netflixtechblog.com/exploring-data-netflix-9d87e20072e3"
- title: "Data Explorer for Astra"
  url: "https://github.com/DataStax-Examples/nf-data-explorer"
---

<div class="nosurface" markdown="1">
<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="https://netflixtechblog.com/exploring-data-netflix-9d87e20072e3"><b>📖 Netlix Blog</b> - Introduction of the tool by Netflix</a>
<li><a href="https://github.com/Netflix/nf-data-explorer"><i class="fa fa-github"></i><b>Github Repository</b> - Core project </a>
<li><a href="https://github.com/DataStax-Examples/nf-data-explorer"><b>Github Repository</b> - Fork for Astra </a>
</ol>
</details>
</div>

## Overview

The Data Explorer by netflix is a web-based tools that will help you navigate and edit your data. It supports both **Cassandra** and **Dynomite** but here we will focus on **Astra**. There a few killer features

#### Multi Cluster Access

Multi-cluster access provides easy access to all of the clusters in your environment. The cluster selector in the top nav allows you to switch to any of your discovered clusters quickly.

<img src="https://awesome-astra.github.io/docs/img/netflix-data-explorer/cluster_selector.png" />
<br /><br />

#### Explore your data

The Explore view provides a simple way to explore your data quickly. You can query by partition and clustering keys, insert and edit records, and easily export the results or download them as CQL statements.

<img src="https://awesome-astra.github.io/docs/img/netflix-data-explorer/explore_view.png" />
<br /><br />

#### Schema Designer

Creating a new Keyspace and Table by hand can be error-prone

Our schema designer UI streamlines creating a new Table with improved validation and enforcement of best practices.

<img src="https://awesome-astra.github.io/docs/img/netflix-data-explorer/schema_designer.gif" />
<br /><br />

#### Query IDE

The Query Mode provides a powerful IDE-like experience for writing free-form CQL queries.

<img src="https://awesome-astra.github.io/docs/img/netflix-data-explorer/query_ide.gif" />

## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
</ul>

## Procedure

### <span class="nosurface">1</span> Run Locally

> **Prerequisites:** You need `node`, `npm` and `yarn`

- Install Yarn on MAC

```bash
brew install yarn
```

- Clone the repository

```bash
git clone https://github.com/DataStax-Examples/nf-data-explorer.git
cd nf-data-explorer
```

- Install the dependencies (_expect a 2min build it will download quite some packages_)

```
yarn && yarn build
```

- Start the applications

```
yarn start
```

- Import your secure connect bundle

> Steps to download your secure connect bundle are found in the Prequisites section

[![Open in IDE](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/DataStax-Examples/nf-data-explorer)

### <span class="nosurface">2</span> Execute with Gitpod

- Click the button

[![Open in IDE](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/DataStax-Examples/nf-data-explorer)

- Open the application

<img src="https://awesome-astra.github.io/docs/img/netflix-data-explorer/import-bundle.png" />

- Import your bundle

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>
