<details>
<summary><b> 📖 Reference Documentation and resources</b></summary>
<ol>
<li><a href="- [Reference documentation](https://docs.datastax.com/en/astra-streaming/docs/astream-quick-start.html)
"><b>📖  Astra Docs</b> - Reference documentation</a>
<li><a href="https://www.youtube.com/watch?v=MCj58S56Z2U&list=PL2g2h-wyI4SpWK1G3UaxXhzZc6aUFXbvL&index=14"><b>🎥 Youtube Video</b> - Astra Streaming demo</a>
<li><a href="https://pulsar.apache.org/docs/en/standalone/"><b>🎥 Pulsar Documentation</b> - Getting Starter</a>
</ol>
</details>

- [Apache Pulsar documentation]()

## A - Overview

**`ASTRA STREAMING`** is the simplest way to use the Apache Pulsar messaging/streaming service with zero operations - just push the button and get your messages flowing.
No credit card required, $25.00 USD credit every month, and all of thethe strength and features of Apache Pulsar managed for you in the cloud.

This page explains how to create a new tenant in Astra Streaming, a new namespace in the tenant (if desired) and a new topic in the namespace.
Also instructions are given to retrieve the connection parameters to later connect to the topic and start messaging from your application.

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/).
- Have a `tenant_name`, optionally a `namespace` (if not using "default"), and a `topic_name` ready to create the topic.

## C - Procedure

Make sure you are logged in to your [Astra account](http://astra.datastax.com/)
before proceeding.

**✅ Step 1: Create a tenant**

Go to your Astra console, click the "Create Stream" button next to the Streaming section.

Set up a new Tenant (remember Pulsar has a multi-tenant architecture): _you have to find a globally unique name for it_.
Pick the provider and region (_try to have it close to you for reduced latency_) and finally hit "Create Tenant".

You'll shortly see the dashboard for your newly-created Tenant.

**✅ Step 2: Create a namespace**

A `default` namespace is created for you with the tenant and you can use it as is.
However, you may want to create a separate namespace to host your topic(s).

Go to the "Namespaces" tab of your Tenant dashboard and click on the "Create namespace"
button on the right. Choose a name and hit "Create". You should see it listed among the
available namespaces in a moment.

**✅ Step 3: Create a topic**

Switch to the "Topics" tab and click the "Add Topic" button next to the namespace that you want to use.

Choose a topic name, review and/or modify the topic settings (such as `persistent=yes, partitioned=no`), and click "Save".

It takes no more than a couple of minutes to create your new topic. It will then be ready to receive and
dispatch messages.

**👁️ Walkthrough for topic creation**

<img src="/img/astra/astra-create-streaming-topic.gif" />

**✅ Step 4: retrieve the Broker URL**

All that is left is to make sure you have the connection parameters needed to reach the topic
programmatically. If you click the "Connect" tab you will see a list of "Tenant Details",
along with links to look at code examples in various languages.

There are several ways to connect to the topic. If you plan to use the
Pulsar drivers from your application, the important bits are the "Broker Service URL"
and the "Streaming Token" secret.

The "Broker Service URL" is shown right in the "Connect" tab and looks like
`pulsar+ssl://pulsar-[...].streaming.datastax.com:6651`. You can click on the
clipboard icon to copy it.

**✅ Step 5: Manage secrets and retrieve the Streaming Token**

You will also need a Token, a long secret string providing authentication info
when the driver will connect to the topic. **The token must be treated as a secret,
which means do not post it publicly and do not check it in to version control.**

> _Note_: Streaming Tokens are completely separate from Astra DB Tokens.

Navigate to the "Token Manager" by clicking on the link in the "Tenant Details" list:
there you will be able to create, copy and revoke streaming tokens for your tenant.

Note that a default token has already been created for you, so you don't necessarily need
to create a new token. Click on the clipboard
icon to copy it.

> The token is a long random-looking string, such as `eyJhbGci [...] cpNpX_qN68Q`
> (about 500 chars long).

**👁️ Screenshot for the connection parameters**

<img src="/img/astra/astra-streaming-secrets.png" />
