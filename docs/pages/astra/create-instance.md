<details>
<summary><b> 📖 Reference Documentation and resources</b></summary>
<ol>
<li><a href="https://docs.datastax.com/en/astra/docs/creating-your-astra-database.html"><b>📖  Astra Docs</b> - The Astra database creation procedure</a>
<li><a href="https://www.youtube.com/watch?v=hzZ3nVrsEpM&list=PL2g2h-wyI4SpWK1G3UaxXhzZc6aUFXbvL&index=2"><b>🎥 Youtube Video</b> - Walk through instance creation</a>
</ol>
</details>

## A - Overview

**`ASTRA DB`** is the simplest way to run Cassandra with zero operations - just push the button and get your cluster. No credit card required and $25.00 USD credit every month (_roughly 20M reads/writes, 80GB storage monthly_) which is sufficient to run small production workloads.

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/). If you don't have one yet, keep reading and we'll show you how to create it.

## C - Procedure

**✅ Step 1:Click the `sign-in` button to login or register.**

You can use your `Github`, `Google` accounts or register with an `email`. Make sure to chose a password with a minimum of 8 characters, containing upper and lowercase letters, and at least one number and special character.

> If you already have an Astra account, you can skip this step. Locate and click the "Create Database" button on the left-side navigation bar
> of your Astra UI, and read the next step.

<img src="../../../img/astra/astra-login.png" />

**✅ Step 2: Complete the creation form**

_As you create a new account, you will be prompted to create a database; you will see the same form if you simply
hit the "Create database" button in your existing Astra account._

<img src="../../../img/astra/astra-create-db-1.png" />

- **ℹ️ Fields Description**

| Field              | Description                                                                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **database name**  | It does not need to be unique, is not used to initialize a connection, and is only a label (Between 2 and 50 characters). It is recommended to have a database for each of your applications. The free tier is limited to 5 databases. |
| **keyspace**       | It is a logical grouping of your tables (Between 2 and 48 characters). Please use lower case and `snake_case`.                                                                                                                  |
| **Cloud Provider** | Use the one you like. Click a cloud provider logo, pick an Area in the list and finally pick a region. We recommend choosing a region that is closest to you to reduce latency. In free tier, there is very little difference.                      |

- ℹ️ `Create Database` button becomes enabled only when all fields are filled in properly. Please use only lower case and no spaces for a keyspace name.

- ℹ️ You will see your new database `pending` in the Dashboard. The status will change to `Active` when the database is ready, which will only take 2-3 minutes. You will also receive an email when it is ready.

<img src="../../../img/astra/astra-create-db-pending.png" />

**👁️ Walkthrough**

<img src="../../../img/astra/astra-create-db.gif" />
