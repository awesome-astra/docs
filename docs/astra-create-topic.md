> [Reference documentation](https://docs.datastax.com/en/astra-streaming/docs/astream-quick-start.html)

## A - Overview

**`ASTRA STREAMING`** is the simplest way to use the Apache Pulsar messaging/streaming service with zero operations at all - just push the button and get your messages flowing.
No credit card required, $25.00 USD credit every month, and the strength and the features of Apache Pulsar managed for you in the cloud.

This page explains how to create a new tenant in Astra Streaming, a new namespace in the tenant (if desired) and a new topic in the namespace.
Also instructions are given to retrieve the connection parameters to later connect to the topic and start messaging from your application.

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/).
- Have a `tenant_name`, optionally a `namespace` (if not using "default"), and a `topic_name` ready to create the topic.

## C - Procedure

Make sure you are logged in to your [Astra account](http://astra.datastax.com/)
before proceeding.

**✅ Step 1: Create a tenant**

Go to your Astra console, locate the "Create Streaming" button on the left window and to the right of Streaming. Click on it.

Set up a new Tenant (remember Pulsar has a multi-tenant architecture): _you have to find a globally unique name for it_.
Pick the provider/region you like (_try to have it close to you for reduced latency_) and finally hit "Create Tenant".

You'll shortly see the dashboard for your newly-created Tenant.

**✅ Step 2: Create a namespace**

A `default` namespace is created for you with the tenant and you can use it if you want.
However, you may want to create a namespace to host your topic(s).

Go to the "Namespaces" tab of your Tenant dashboard and click on the "Create namespace"
button on the right. Choose a name and hit "Create": you should see it listed among the
available namespaces in a moment.

**✅ Step 3: Create a topic**

Head to the "Topics" tab and click the "Add Topic" button next to the namespace you want to use.

Choose a topic name and click "Save" after reviewing the topic settings (such as `persistent=yes, partitioned=no`)
according to your needs.

Your topic is now being created, which takes a couple of minutes max. It will then be ready to receive and
dispatch messages.

**👁️ Walkthrough for topic creation**

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-create-streaming-topic.gif?raw=true" />

**✅ Step 4: retrieve the Broker URL**

All is left is to make sure you have the connection parameters needed to reach the topic
programmatically. If you click the "Connect" tab you will see a list of "Tenant Details",
along with links to look at code examples in various languages.

There are several ways to connect to the topic: in particular, if you plan to use the
Pulsar drivers from your application, the important bits are the "Broker Service URL"
and the "Streaming Token" secret.

The "Broker Service URL" is shown right in the "Connect" tab and looks like
`pulsar+ssl://pulsar-[...].streaming.datastax.com:6651`. You can click on the
clipboard icon to copy it.

**✅ Step 5: Manage secrets and retrieve the Streaming Token**

You will also need a Token, a long secret string providing authentication info
when the driver will connect to the topic. **The token must be treated as a secret,
which means do not post it publicly and do not check it in to repositories.**

> _Note_: the Streaming Tokens are a completely separate thing from the Astra DB Tokens.

Get to the "Token Manager" by clicking on the link in the "Tenant Details" list:
there you will be able to create, copy and revoke streaming tokens for your tenant.

Note that a default token has already been created for you, so you don't need
to create a new token if you are OK with using that one. Click on the clipboard
icon to copy it.

> The token is a long random-looking string, such as `eyJhbGci [...] cpNpX_qN68Q`
> (about 500 chars long).

**👁️ Screenshot for the connection parameters**

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-streaming-secrets.png?raw=true" />

## D - Extra Resources

- [Apache Pulsar documentation](https://pulsar.apache.org/docs/en/standalone/)

[🏠 Back to home](https://github.com/datastaxdevs/awesome-astra/wiki)
