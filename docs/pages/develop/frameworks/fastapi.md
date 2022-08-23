
<img src="../../../../img/tile-fastapi.png" align="left" width="180px"/>

*FastAPI framework, high performance, easy to learn, fast to code, ready for production.*
FastAPI is a modern, fast web framework for building APIs
with Python 3.6+ based on standard Python type hints.
FastAPI strives to minimize boilerplate and maximize performance.

To get more information regarding the framework visit the reference website [fastapi.tiangolo.com](https://fastapi.tiangolo.com/).

## 1. Overview

This guide, and the accompanying sample code, highlight the practices and the patterns
to best integrate FastAPI with Astra DB to use the latter as backing storage.

Two important choices are made in the following:

- Astra DB is accessed with the Python driver;
- no Object Mappers are used, just plain simple CQL statements.

## 2. FastAPI and Astra DB

The goal is to provide access to one or more tables stored in Astra DB
to the FastAPI endpoint functions, so that the API can write data to them
and read from them. This should be done keeping in mind the best practices
for using the Cassandra drivers, and in as flexible and concise way as possible.

### Session

Virtually every endpoint needs access to the database. On the other hand,
the driver's `cassandra.cluster.Session` is a stateful, resource-intensive
object that should be created once and re-used throughout the life cycle of the
Python process.

For this reason (file [`storage/db_connect.py`](https://github.com/awesome-astra/sample-astra-fastapi-app/blob/main/storage/db_connect.py) in the sample app) there is
a `get_session()` function that keeps a globally-cached session object and
returns it any time it is called, in a singleton fashion. On its first
invocation, of course, the session is created in the idiomatic way, looking
for the necessary connection parameters from a `.env` file. This file contains
secrets, so it should _never_ be checked in to version control.

> _Note_. If the application runs on regular Cassandra (as opposed to Astra DB),
> this is the only part of the code that would change: the parameters for
> instantiating the `Cluster` and the `Session` would differ slightly.

Since it is a good practice to explicitly free resources once we're done,
in this module there's also a shutdown hook that takes care of cleanup
by closing the session and shutting down the `Cluster` object. (which for a
FastAPI application that runs indefinitely is a bit of a moot point, but still
illustrates the point).

### Endpoint dependencies

Next comes the task of making the session object available to the function
endpoints: these will need to retrieve rows and/or write them, after all.

Taking advantage of FastAPI's advanced dependency injection facilities,
one can add a `Depends` parameter to the [endpoint functions](https://github.com/awesome-astra/sample-astra-fastapi-app/blob/594784cbcc7c459cd2a65eb60be7d706606c94df/api.py#L36), which will
be automatically resolved when the function gets executed. This makes the
session available to the function:

```python
@app.get('/animal/{genus}')
async def get_animals(genus, session=Depends(g_get_session)):
    # etc, etc ...
```

The argument of `Depends` is a function itself, more precisely an async
generator, which must `yield` the session object. For this reason
there is a thin [wrapper function](https://github.com/awesome-astra/sample-astra-fastapi-app/blob/594784cbcc7c459cd2a65eb60be7d706606c94df/utils/db_dependency.py) that, in practice, promotes the ordinary
function `get_session` to a generator with the desired signature:

```python
async def g_get_session():
    yield get_session()
```

At this point, FastAPI takes care of the wiring. What is still missing
is the business logic itself, i.e. what happens within the endpoint functions.

### Prepared statements

It is a good practice to keep the code in the endpoint function short and
not to embed much logic into it, except for the handling of the request-response
cycle itself.

For this reason, each endpoint function in turn invokes a function in the
[`storage/db_io.py`](https://github.com/awesome-astra/sample-astra-fastapi-app/blob/594784cbcc7c459cd2a65eb60be7d706606c94df/storage/db_io.py) module, which is where the actual database operations
are executed.

In this module another important observation is in order: since it is expected
that the API endpoints will be called many times, the corrsponding CQL
statements are made into "prepared statements" once and then re-used over
and over.

To achieve that, the `db_io.py` module holds a cache of prepared statements,
one per different type of database query. This cache (`prepared_cache`)
is filled on the first
invocation of each endpoint, but after that there is a sizable gain in
performance and reduction of overhead for all subsequent calls.

### Streaming a large response from DB

In some cases, an API endpoint may return a large response (such as a GET
returning a long list of items). It might be unwieldy, and suboptimal, to
retrieve the full list at API level and then prepare a whole response string
to return to the caller.

Ideally, one would like to start sending out the response as the data keeps
coming in (to the API) from the database. **This is exactly what `StreamingResponse`
makes possible**.

The Cassandra driver handles pagination of large result sets transparently:
regardless of the grouping of rows into pages, at the Python-code level
all you see is a homogeneous iterable over all rows. This means that one can
simply make the [corresponding data-retrieval function](https://github.com/awesome-astra/sample-astra-fastapi-app/blob/594784cbcc7c459cd2a65eb60be7d706606c94df/storage/db_io.py#L68) a generator almost with
no changes in the code.

Things get slightly more tricky on the other side, that is, between the
endpoint function and the caller. Fortunately, FastAPI offers the
`StreamingResponse` construct that makes it possible to "consume" a generator
and return its components as a "Chunked" type of response.
The client will still receive a full response (and will be able to start
processing it once it is there in full), but never throughout the live of
the request will there be "the full thing" on the API side.

But beware: in this case, the endpoint function will need to manually construct
"pieces of a syntactically valid JSON". In the sample app, this is achieved
by a [`format_streaming_response` function](https://github.com/awesome-astra/sample-astra-fastapi-app/blob/594784cbcc7c459cd2a65eb60be7d706606c94df/utils/streaming.py) which takes care
of the opening/closing square brackets for a list and of the correct placement
of the commas. In practice, this function makes a generator over homogeneous
items into a generator returning something like (row-by-row; note the commas):

```
1.     [
2.     {"a": 1, "b": 100}
3.     ,{"a": 2, "b": 200}
4.     ,{"a": 3, "b": 300}
5.     ,{"a": 4, "b": 400}
6.     ]
```

## 3. Reference application

You can clone the [reference application](https://github.com/awesome-astra/sample-astra-fastapi-app#readme) coming with this page and
run it in minutes, provided you have an Astra DB instance (click
[here](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
to create one).

The setup instructions are outlined below: for more details,
refer to the repo's [README](https://github.com/awesome-astra/sample-astra-fastapi-app#readme).

### Setup

An Astra DB instance, with corresponding Token and Secure connect bundle, are
required to run this app: make sure you have them at your disposal.

Once you cloned the repository, create the `.env` file with the required secrets
and (preferrably in a Python virtual environment) install all dependencies
with `pip install -r requirements.txt`.

In order to populate the database (table creation and insertion of sample rows),
you should run once the script `python storage/db_initialize.py`. You are now
ready to run the API.

### Run sample app

Running the API is as simple as
```bash
uvicorn api:app
```

You can now issue requests to it. Look in the repo's README for example
requests, testing all provided endpoints, as `curl` commands (of course
you can use any tool you like, such as Postman, to achieve the same effect).

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/awesome-astra/sample-astra-fastapi-app/archive/refs/heads/main.zip)

