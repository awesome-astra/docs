---
title: "Celery"
description: "Celery is a (BSD-licensed) open source, simple and flexible distributed task queue for asynchronous processing of messages. With Celery one can define units of work called 'tasks' and dispatch them for execution, in a distributed way if desired. Celery is a Python package and as such is easily integrated in any Python project."
tags: "python, third party tools"
icon: "https://awesome-astra.github.io/docs/img/celery/celery.svg"
developer_title: "The Celery Collective"
developer_url: "https://docs.celeryq.dev/en/stable/index.html"
links:
- title: "Install Celery"
  url: "https://pypi.org/project/celery/"
- title: "Celery on Github"
  url: "https://github.com/celery/celery"
---

<div class="nosurface" markdown="1">

<img src="https://awesome-astra.github.io/docs/img/celery/celery_logo.png" height="60px" />
</div>

## A - Overview

Celery is a (BSD-licensed) open source, simple and flexible distributed task queue for asynchronous processing of messages.
With Celery one can define units of work called "tasks" and dispatch them for execution, in a distributed way if desired.
Celery is a Python package and as such is easily integrated in any Python project.

> Typical use cases might be: a queue of uploaded images to resize in the background, long-running tasks initiated by a Web application's API, a batch of email scheduled to be sent, ...

Celery is composed of two parts: on one side, one or more _clients_ define the tasks to be run and enqueue/schedule them for execution;
on the other side, one or more _workers_ pick up these tasks, execute them and optionally store the resulting values.
Communication between these two parts happens through a message bus (such as RabbitMQ) acting as broker, while the return value of a task is made available
back to the caller through a backend (de/serialization is transparently handled by the Celery infrastructure).

Celery supports several backends for storing and exposing task results.
Among the supported backends are Cassandra and (starting with `v5.2`) Astra DB.
In the following we assume familiarity with the `celeryconfig` configuration object for Celery and with the usage of Cassandra
as backend. See the Celery documentation for more details:

<div class="nosurface" markdown="1">

- ℹ️ [Celery documentation](https://docs.celeryq.dev/en/stable/index.html)
- ℹ️ [The `celeryconfig` object](https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html#configuration)
- ℹ️ [Cassandra/AstraDB backend configuration guide](https://docs.celeryq.dev/en/stable/userguide/configuration.html#cassandra-astradb-backend-settings) (which covers the instructions on this page as well)
- 📥 [Celery installation instructions](https://pypi.org/project/celery/)

</div>

## B - Prerequisites

<ul class="prerequisites">
  <li class="nosurface"><a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a>. In the following example, a keyspace called <code>celeryks</code> is created in the database.</li>
  <li class="nosurface"><a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Create an Astra Token</a> with the role "Database Administrator" (it is desirable to leave table creation to Celery). <em>You should have received your token while creating the database in the previous step.</em></li>
  <li class="nosurface"><a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your secure connect bundle ZIP</a>.
  <li>Install Celery with the Cassandra backend in your local Python environment, e.g. <code>pip install celery[cassandra]</code>. See <a href="https://docs.celeryq.dev/en/stable/userguide/configuration.html#cassandra-astradb-backend-settings">the backend-settings page</a> for additional info.</li>
</ul>

Keep the token information and the bundle file location ready: these will be soon provided in the Celery configuration.

## C - Installation and Setup

Here a minimal Celery setup that makes use of the Astra DB backend is described start-to-end.

A task will be defined and executed through Celery: afterwards, its return value will be retrieved on the client side.
For this example to work, a message bus is needed - here, in line with a [quickstart](https://docs.celeryq.dev/en/stable/getting-started/first-steps-with-celery.html#choosing-a-broker) on Celery's documentation, a dockerized RabbitMQ is used.

### Steps:

#### 1. Start a message broker

Make sure you have a RabbitMQ instance running in Docker with `docker run -d -p 5672:5672 rabbitmq` (it might take a while for the image to be downloaded and complete startup).

#### 2. Define a task

Create a `tasks.py` module with the definition of a task, to be later executed through Celery:

```python
from celery import Celery

app = Celery('tasks')
app.config_from_object('celeryconfig')

@app.task
def sortWords(text, capitalize):
    # Rearrange the text so that words are in alphabetical order.
    words = text.split(' ')
    sortedWords = sorted(words, key=str.upper)
    return ' '.join([
        w if not capitalize else w.upper()
        for w in sortedWords
    ])
```

#### 3. Configure Celery

Create a module `celeryconfig.py` in the same directory, providing (among other things) the broker and backend configuration:

```python
broker_url = 'pyamqp://guest@localhost//'

broker_connection_retry_on_startup = True

task_serializer = 'json'
result_serializer = 'json'
accept_content = ['json']
enable_utc = True

result_backend = 'cassandra://'
cassandra_keyspace = 'celeryks'                       # REPLACE_ME
cassandra_table = 'celery_tasks'                      # REPLACE_ME
cassandra_read_consistency = 'quorum'
cassandra_write_consistency = 'quorum'
cassandra_auth_provider = 'PlainTextAuthProvider'
cassandra_auth_kwargs = {
  'username': 'client-id-from-astra-token',           # REPLACE_ME
  'password': 'client-secret-from-astra-token',       # REPLACE_ME
}
cassandra_secure_bundle_path = '/path/to/secure-connect-database.zip'   # REPLACE_ME
```

In the above, take care of inserting your values for:

- the keyspace name you created earlier in Astra DB;
- the table name you want Celery to store results in (no need to create it beforehand);
- the Client ID and Client Secret generated in your Astra DB token earlier (resp. as username and password in `cassandra_auth_kwargs`);
- the path to the Secure Connect Bundle you downloaded earlier.

#### 4. Start the worker

Start a Celery worker with:

```bash
celery -A tasks worker --loglevel=INFO
```

#### 5. Run and check a task

In a different shell, open a Python REPL and type the following commands to run a couple of tasks and retrieve their result:

```python
from tasks import sortWords
sorted1 = sortWords.delay('storage yay my DB is powerful results Astra', False)
sorted1.ready()
# Returns:     True
# (as soon as the function completes, which here is almost immediately)

sorted1.get()
# Returns:     'Astra DB is my powerful results storage yay'
 
sorted2 = sortWords.delay('In the land of another wizards day', capitalize=True)
sorted2.get()
# Returns:     'ANOTHER DAY IN LAND OF THE WIZARDS'
```

#### 6. (optional) Look at the database

Check the corresponding data stored on Astra DB. Navigate to the CQL Console for the database you created and enter the following commands:

```
USE celeryks;               // <== enter your keyspace name here

DESCRIBE TABLES;            // the output, e.g. "celery_tasks", lists the tables

SELECT * FROM celery_tasks; // <== enter your table name here
```

<img src="https://awesome-astra.github.io/docs/img/celery/celery_cql_console.png" height="100px" />

## D - Additional configuration

Celery uses the DataStax Python driver for Cassandra; hence, the choice of connection parameters
is that for the generic driver-based usage of Cassandra in Python.

In particular, one may want to specify additional parameters through the `celeryconfig` such as
protocol level, load-balancing policy and so on. Refer to the
["Additional configuration"](https://docs.celeryq.dev/en/stable/userguide/configuration.html#additional-configuration)
section in the Celery documentation for a more comprehensive setup.

<div class="nosurface" markdown="1">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/) |
</div>
