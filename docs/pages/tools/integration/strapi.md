---
title: "Strapi"
description: "Strapi is an open-source headless CMS that gives developers the freedom to choose their favorite tools and frameworks and allows editors to manage and distribute their content using their application’s admin panel."
tags: "javascript, nodejs, doc api, third party tools"
icon: "https://awesome-astra.github.io/docs/img/strapi/logo-strapi.png"
developer_title: "Strapi"
developer_url: "https://Strapi.io/"
links:
- title: "Intro to Strapi"
  url: "https://strapi.io/about-us"
- title: "Strapi Quick Start"
  url: "https://docs.strapi.io/"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/strapi/logo-strapi.png" height="100px" />
</div>

## Overview

Strapi is an open-source headless CMS that gives developers the freedom to choose their favorite tools and frameworks and allows editors to manage and distribute their content using their application’s admin panel. Based on a plugin system, its admin panel and API are extensible. Every part is customizable to match any use case. Strapi also has a built-in user system to manage what the administrators and end users can access.

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to Strapi](https://strapi.io/about-us)
- 📥 [Strapi Quick Install](https://docs.strapi.io/)
</div>

## Prerequisites

<ul class="prerequisites">
   <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
   <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
   <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
   <li>You should retrieve your **Database ID** and **Region** from your Astra DB dashboard</li>
   <li>Install <a href="https://nodejs.org/en/">node (14.17.3 version)</a>.</li>
</ul>

## Installation and Setup
Follow the steps below to setup Strapi locally.

1. First, install Strapi locally: 
```
npx create-strapi-app my-project
```
You can view your Strapi project as it is hosted locally at http://localhost:1337/admin.

2. Install the Strapi hook:
```
npm i strapi-hook-astra
```

3. Activate the hook by adding the following to `./config/hook.js` of the sample Strapi Project:
```
module.exports = {
    settings: {
        astra: {
            enabled: true,
            token: 'REPLACE_ME',
            databaseId: 'REPLACE_ME',
            databaseRegion: 'REPLACE_ME',
            keyspace: 'REPLACE_ME',
            collection: 'REPLACE_ME'
        },
    }
};
```
**Where:**
* `token`: Generate a token from Astra DB.
* `databaseId`: Enter your Astra DB database ID from your database URL.
* `databaseRegion`: Enter your Astra DB database region
* `keyspace`: Enter your Astra DB keyspace name.
* `collection`: Enter your Astra DB collection name.

## Test and Validate

1. Create a document:
```
strapi.services.astra.create(document);
```
|Parameter|Type|Explanation|Values|
|:---|:---|:---|:---|
|document|json|Create a document|var dataString = '{ "name": "John", "last_name": "Doe" }'|

2. Get document by ID:
```
strapi.services.astra.getById(documentId);
```
|Parameter|Type|Explanation|Values|
|:---|:---|:---|:---|
|documentId|string|Get document by documentId|var documentId = "your_document_id"|

3. Get document by path:
```
strapi.services.astra.getByPath();
```

4. Search a collection:
```
strapi.services.astra.searchCollection(query,pagesize);
```
|Parameter|Type|Explanation|Values|
|:---|:---|:---|:---|
|query|string|Search collection via query|var query = {"name": { "$eq": "John" }}|
|pagesize|int|Number of documents to fetch|int page_size = 3|


For more, see the [Strapi documentation](https://strapi.io/documentation/developer-docs/latest/getting-started/introduction.html).
