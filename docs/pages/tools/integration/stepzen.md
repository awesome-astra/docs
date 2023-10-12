---
title: "StepZen"
description: "StepZen helps developers build GraphQL faster, deploy in seconds, and run on StepZen. It simplifies how you access the data you need, and with zero infrastructure to build or manage, you can focus on crafting modern data-driven experiences."
tags: "javascript, graphql, third party tools"
icon: "https://awesome-astra.github.io/docs/img/stepzen/stepzen.svg"
developer_title: "StepZen"
developer_url: "https://stepzen.com/"
links:
- title: "Intro to StepZen"
  url: "https://stepzen.com/about"
- title: "StepZen Quick Install"
  url: "https://stepzen.com/getting-started?details=nosql"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/stepzen/stepzen_logo.png" style="height: 180px;" />
</div>

## Overview

StepZen helps developers build GraphQL faster, deploy in seconds, and run on StepZen. It simplifies how you access the data you need, and with zero infrastructure to build or manage, you can focus on crafting modern data-driven experiences. 

<div class="nosurface" markdown="1">
- ℹ️ [Introduction to StepZen](https://stepzen.com/about)
- 📥 [StepZen Quick Install](https://stepzen.com/getting-started?details=nosql)
</div>

## Prerequisites

<ul class="prerequisites">
   <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
   <li>You should create a <a href="https://login.stepzen.com/login?state=hKFo2SAzTkRHaXRiME5VVjVwd1RBOVZtTy1YdGF1b1pRa2dLeaFupWxvZ2luo3RpZNkgVS1RYUNkdkRpWENJNXViU0VnalBLWkFjYkc5QUV0QzSjY2lk2SA3UG9mU2I3NnBXNFRZdEg2T01jNFEwQWZ2bW96N20xUg&client=7PofSb76pW4TYtH6OMc4Q0Afvmoz7m1R&protocol=oauth2&scope=openid%20profile%20email&response_type=code&redirect_uri=https%3A%2F%2Fstepzen.com%2Fapi%2Fauth%2Fcallback&screen_hint=signUp&utm_source=unknown&utm_medium=website&utm_content=.grid.hero-header.text-center.button-row.mt-1.button.large.color3&nonce=Mpfl5vlBh3RdOelIO9OrUSP32XamxapUUDZNwUJm8-Y&code_challenge=VKd4KVAJGB1Mu62fbCkqWMQ_iv3QttZD0VrdRFRSUL4&code_challenge_method=S256">StepZen account</a></li>
   <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
   <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
   <li>You should retrieve your **Database ID** and **Region** from your Astra DB dashboard</li>
</ul>



## Installation and Setup
After logging into your StepZen account and have all of your credentials ready, you can navigate to [this page](https://stepzen.com/getting-started?details=nosql) or follow the steps below to setup StepZen.

1. First, install the StepZen CLI 
```
npm install -g stepzen
```

2. Log in with your StepZen account
```
stepzen login -a YOUR_ACCOUNT
```

3. Enter your **Admin Key** when prompted
```
YOUR_ADMIN_KEY
```
**Note:** For steps #2 and #3, if it does not autopopulate, you can find this information in your StepZen account under "My Stepzen".
    
4. Import a DataStax Astra DB GraphQL API from your terminal
```
stepzen import graphql
```
5. When prompted, enter your GraphQL API details:

| What is the GraphQL endpoint URL?           | `https://<ASTRA_DB_ID>-<ASTRA_DB_REGION>.apps.astra.datastax.com/api/graphql/<KEYSPACE_NAME>` |
|------------------------------------------|-------------------------------------------------------------------------------------------------------|
| **Prefix to add to all generated type names (leave blank for none)**                | *Optional. Adviced to use when you're importing multiple data sources.*                       |
| **Add an HTTP header, e.g. Header-Name: header value (leave blank for none)** | `X-Cassandra-Token: <APPLICATION_TOKEN>`                                              |


Once successful, you should see the following output:
```
Generating schemas...... done
Successfully imported schema graphql from StepZen
```
6. Type `stepzen start` in your terminal

StepZen introspects your DataStax Astra DB GraphQL API and builds your endpoint. 

You should receive something similar to this output:
```
File changed: /your/path/.DS_Store
Deploying api/coy-aardwolf to StepZen... done in 4.8s

Your API url is  https://<YOUR_ACCOUNT>.stepzen.net/api/<YOUR_ENDPOINT_NAME>/__graphql

You can test your hosted API with cURL:

curl https://<YOUR_ACCOUNT>.stepzen.net/api/<YOUR_ENDPOINT_NAME>/__graphql \
   --header "Authorization: Apikey $(stepzen whoami --apikey)" \
   --header "Content-Type: application/json" \
   --data '{"query": "your graphql query"}'

or explore it with GraphiQL at  http://localhost:5001/api/<YOUR_ENDPOINT_NAME>

Watching ~/your/path/here for GraphQL changes...
```

## Test and Validate
1. To quickly validate that the previous steps went smoothly, navigate to your local host to view the StepZen UI. <br /> `http://localhost:5001/api/<YOUR_ENDPOINT_NAME>`
2. Using the **Explorer** you can visualize what tables are in your keyspace, and by selecting each box, you are building your GraphQL query which shows up in the middle console. 
<img src="https://awesome-astra.github.io/docs/img/stepzen/stepzen_ui.png" height="100px" />

...and you're done! You can now use StepZen to build your GraphQL queries with ease to use with your applications. 
