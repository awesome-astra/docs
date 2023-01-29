
<img src="../../../../img/tile-flask.png" align="left" width="180px"/>

*Flask - Web development, one drop at a time.*
Flask is a lightweight [WSGI](https://wsgi.readthedocs.io/) web application framework.
It is designed to make getting started quick and easy, with the ability
to scale up to complex applications.
It began as a simple wrapper around [Werkzeug](https://palletsprojects.com/p/werkzeug) and [Jinja](https://palletsprojects.com/p/jinja) and
has become one of the most popular Python web application frameworks.

To get more information regarding the framework visit the reference website [flask.palletsprojects.com](https://flask.palletsprojects.com).

## 1. Overview

This guide, and the accompanying sample code, highlight the practices and the patterns
to best integrate Flask with Astra DB to use the latter as backing storage.

Two important choices are made in the following:

- Astra DB is accessed with the Python driver;
- no Object Mappers are used, just plain simple CQL statements.

## 2. Flask and Astra DB

The goal is to provide access to one or more tables stored in Astra DB
to the Flask endpoint functions, so that the API can write data to them
and read from them. This should be done keeping in mind the best practices
for using the Cassandra drivers, and in as flexible and concise way as possible.

### Session

Virtually every endpoint needs access to the database. On the other hand,
the driver's `cassandra.cluster.Session` is a stateful, resource-intensive
object that should be created once and re-used throughout the life cycle of the
Python process.

For this reason (file [`storage/db_connect.py`](https://github.com/awesome-astra/sample-astra-flask-app/blob/main/storage/db_connect.py) in the sample app) there is
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
Flask application that runs indefinitely is a bit of a moot point, but still
illustrates the point).

### Endpoint dependencies

Next comes the task of making the session object available to the function
endpoints: these will need to retrieve rows and/or write them, after all.

Typically _all_ API endpoints need to access the database: in this case,
the easiest way is to use Flask's application-context
[`g` object](https://flask.palletsprojects.com/en/2.2.x/api/#flask.g) and the [`before_request` hook](https://flask.palletsprojects.com/en/2.2.x/api/#flask.Flask.before_request) to make sure each request
will find a reference to the session.
Once the pre-request hook is set up with
```python
@app.before_request
def get_db_session():
    g.session = get_session()
```
all endpoints will be able to read and use `g.session` as they need.
Remember that `get_session()` does not create a new Cassandra `Session` object
at each invocation!

```python
@app.route('/animal/<genus>')
def get_animals(genus):
    animals = retrieve_animals_by_genus(g.session, genus)
    return jsonify([animal.dict() for animal in animals])
```

### Prepared statements

It is a good practice to keep the code in the endpoint function short and
not to embed much logic into it, except for the handling of the request-response
cycle itself.

For this reason, each endpoint function in turn invokes a function in the
[`storage/db_io.py`](https://github.com/awesome-astra/sample-astra-flask-app/blob/main/storage/db_io.py) module, which is where the actual database operations
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
coming in (to the API) from the database. **This is exactly what Flask's
["streaming responses"](https://flask.palletsprojects.com/en/2.2.x/patterns/streaming/) make possible**.

The Cassandra driver handles pagination of large result sets transparently:
regardless of the grouping of rows into pages, at the Python-code level
all you see is a homogeneous iterable over all rows. This means that one can
simply make the [corresponding data-retrieval function](https://github.com/awesome-astra/sample-astra-flask-app/blob/main/storage/db_io.py#L68) a generator almost with
no changes in the code.

Things get slightly more tricky on the other side, that is, between the
endpoint function and the caller. Fortunately, Flask endpoint functions
may return a `(generator, headers)` pair and will construct, from this,
a "Chunked" response which will be sent to the caller piecewise,
as the generator gets consumed.
The client will still receive a full response (and will be able to start
processing it once it is there in full), but never throughout the live of
the request will there be "the full thing" on the API side.

But beware: in this case, the endpoint function will need to manually construct
"pieces of a syntactically valid JSON". In the sample app, this is achieved
by a [`format_streaming_response` function](https://github.com/awesome-astra/sample-astra-flask-app/blob/main//utils/streaming.py) which takes care
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

### Pydantic usage

The reference API uses Pydantic for validation and handling of request/response
data types (this is not strictly necessary, but very handy).
However, this requires some manual plumbing, as can be seen in the
code in two ways:

First, to validate/cast the POST request payload, a
`animal = Animal(**request.get_json())` is [wrapped in a try/except construct](https://github.com/awesome-astra/sample-astra-flask-app/blob/main/api.py#L42-L46),
in order to return a meaningful error (from Pydantic) and a status 422
("unprocessable entity") if anything is off.
**Note**: `request` is a Flask abstraction

Moreover, when returning responses, one must explicitly `jsonify` not directly
the Pydantic object, rather its `.dict()` representation.
So, for example, [`return jsonify(animal.dict())`](https://github.com/awesome-astra/sample-astra-flask-app/blob/main/api.py#L28).
**Note**: `jsonify` is a Flask primitive, whole `.dict()`
is a built-in method for Pydantic models.

## 3. Reference application

You can clone the [reference application](https://github.com/awesome-astra/sample-astra-flask-app#readme) coming with this page and
run it in minutes, provided you have an Astra DB instance (click
[here](https://awesome-astra.github.io/docs/pages/astra/create-instance/)
to create one).

The setup instructions are outlined below: for more details,
refer to the repo's [README](https://github.com/awesome-astra/sample-astra-flask-app#readme).

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
flask --app api run --reload
```

You can now issue requests to it. Look in the repo's README for example
requests, testing all provided endpoints, as `curl` commands (of course
you can use any tool you like, such as Postman, to achieve the same effect).

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/awesome-astra/sample-astra-flask-app/archive/refs/heads/main.zip)

