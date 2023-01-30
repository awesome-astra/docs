
<img src="../../../../img/tile-django.png" align="left" width="180px"/>

*Django web framework. Ridiculously fast, fully loaded, reassuringly secure, exceedingly scalable, incredibly versatile.* 

With Django, you can take web applications from concept to launch in a matter of hours.
Django takes care of much of the hassle of web development, so you can focus on writing
your app without needing to reinvent the wheel. It’s free and open source.

For more information, visit Django's website
at [djangoproject.com/](https://www.djangoproject.com/).

## Overview

This guide describes how you can use Astra DB for your Django applications
in a manner that is as idiomatic as possible within the Django way of doing things.
The practices outlined here, in most cases, even make it possible to migrate
an existing Django application to using Astra DB with minimal changes.

!!! important "RDBMS-based applications and Astra DB"

    For more complex applications that fully leverage the capabilities of
    a relational database, such as foreign keys, adjustments of the data
    model would be needed according to the fundamental approach to data modeling
    in Astra DB (i.e. in Cassandra).

In this page we adopt and suggest usage of the
[`django-cassandra-engine`](https://r4fek.github.io/django-cassandra-engine/)
Python package, which essentially provides Django object models on a Cassandra
backend. Notice, however, that the package is not as feature-rich as its RDBMS counterpart,
which in certain cases might require you to do a bit more of manual plumbing.


### Reference application

This page comes with a fully-working sample application as a companion repository,
ready to be cloned and launched provided you go through its setup steps. All you
need is an Astra DB instance and a corresponding database token. Refer to the README
on the repository for more details or click the button below to get a copy of the application:

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://github.com/awesome-astra/sample-astra-django-website/archive/refs/heads/main.zip)

The reference application ("partyfinder") is a very simple vanilla Django website
to browse, create and delete "parties" happening in given cities at specific dates.
Additionally, to illustrate the use of advanced Cassandra-specific features (namely, LWTs),
a sort of "count-me-in" feature is also implemented to keep a consistent count of
who will be attending a given party.

## Astra DB usage in Django

With the Cassandra package for Django, you can switch between databases
mostly in a seamless way: development still follows the "object-mapper"
philosophy of defining **models** for the entities in the database and,
so to speak, let the django engine figure the rest out by itself.

A difference is that, instead of the native `django.db.models.Model`, you have to
subclass `django_cassandra_engine.models.DjangoCassandraModel`; correspondingly,
to comply with the underlying CQL data types available for columns, the fields in
a model are drawn from the `cassandra.cqlengine.columns` package. Moreover,
when creating a model for Cassandra, special syntax make it possible to specify
which part of the primary key is in the clustering columns. The following example
comes from [the reference application](https://github.com/awesome-astra/sample-astra-django-website/blob/main/parties/partyfinder/models.py):

```python
import uuid

from django.utils import timezone

from cassandra.cqlengine import columns
from django_cassandra_engine.models import DjangoCassandraModel

# A model for this app
class Party(DjangoCassandraModel):
    city = columns.Text(
        primary_key=True,
    )
    id = columns.UUID(
        primary_key=True,
        clustering_order='asc', # (allowed: 'asc' , 'desc', lowercase)
        default=uuid.uuid4,
    )
    name = columns.Text()
    people = columns.Integer(default=0)
    date = columns.DateTime(default=timezone.now)

    class Meta:
        get_pk_field='id'
```

### Pitfalls of using Models

With object mappers, and the available Cassandra models, you can handle most
of an application's needs. Still, a **word of caution** about usage of models
is in order.

Models, if used casually, may **encourage the wrong read pattern** on a Cassandra table:
models implement methods such as `.all()`, which in general map to the dreaded "allow filtering"
clause in terms of queries to Cassandra, and are generally to be avoided in production.
Another example is that the model's `.filter(...)` method might be given filtering conditions
that _do not map_ to the sensible query patterns the table is designed for, thereby hidering performance
or resulting in query timeouts. In short: _do not let the model fool you, you still have to play by Cassandra's rules._

!!! warning "Inadvertently querying a table the wrong way"

    The table for `Party` objects above ends up having `PRIMARY KEY (( city ), id)`.
    This means that to get a given party one should do something like"

    ```python
    parties = Party.objects.filter(city=city, id=id)
    ```

    It is worth noting that if you omit the city, **the following line would raise no error**:

    ```python
    parties = Party.objects.filter(id=id)
    ```

    and (assuming global uniqueness of the IDs) would even appear to work as fine,
    but the underlying CQL query would be a performance killer on a production application.

There is another reason to be wary of models: some of the advanced techniques to use
Cassandra simply don't fit into the models philosophy.
For these, you need to access the underlying `Session` object and
directly run CQL code on it. Luckily, there is a way to do so, and it is exemplified
in the sample application (keep reading to see how to do it).

### Implications of Cassandra data models

The proper road to a successful Cassandra (or Astra DB)-backed application starts
from designing the right data model. But it is also possible to migrate existing
Django applications: in most cases, as observed above, a one-to-one reformulation
of the models would do the trick.

However, the no-relations, no-joins, no-foreign-keys nature of the NoSQL database
at hand means that if the existing application makes use of these things, a bit of
work is warranted to go back to data-modeling-related issues.

In other words, if models in your pre-existing, relational-based application
contain RDBMS-related specifications such as:

```python
from django.db import models
from whatever import AnotherModel

class MyEntity(models.Model):
    fkField = models.ForeignKey(AnotherModel, on_delete=models.CASCADE)
    # etc, etc ...
```

you have to consider more structural changes, such as moving the burden of joins
or cascading deletes to the application itself or - even better - rethink
your tables (and models) in a way that works without these costly operations.

### Beyond models

In some cases the best approach is to bypass the "model layer" altogether
and directly execute CQL code on your Session object, taking care of manually
handling the results in case of "read" queries.

!!! important "For example, the Session is needed to use Batches, LWTs and work with TTL."

In the application example we have a feature that allows users to
increment/decrement a `people` field for a party. However, we don't want
these operations to succeed if the number seen by users on their browsers
does not match the stored value anymore (think race conditions and concurrent
access to the application: we certainly don't want risking this counter to
go below zero!).

A possible (if perhaps not optimal, performance-wise) solution to this problem
is offered by using Lightweight Transactions. Essentially we want to run the
CQL equivalent of
_"update column `people` of that row, but only if the current value is so-and-so. Report back whether the update succeeded."_
This is achieved, in the appropriate view function, by [the following code](https://github.com/awesome-astra/sample-astra-django-website/blob/main/parties/partyfinder/views.py#L121-L130), which retrieves the database session and runs "raw CQL" on it:

```python
from django.db import connection

# ... ...

def change_party_people(request, city, id, prev_value, delta):
    delta_num = int(delta)
    cursor = connection.cursor()
    change_applied = cursor.execute(
        'UPDATE party SET people = %s WHERE city=%s AND id=%s IF people = %s',
        (
            delta_num + prev_value,
            city,
            uuid.UUID(id),  # must respect Cassandra type system
            prev_value,
        ),
    ).one()['[applied]']
    if not change_applied:
        lwt_message = '?LWT_FAILED=1'
    else:
        lwt_message = ''
    # etc, etc ...
```

### Configuration and DB access in Django

Now let's look at how to configure a Django application
to use Astra DB and how the access parameters and secrets are
passed to it.


#### settings.py

The general project-level settings are given in [`settings.py`](https://github.com/awesome-astra/sample-astra-django-website/blob/main/parties/parties/settings.py). In that file, you should
first add the `"django_cassandra_engine"` item to the `INSTALLED_APPS` _so that it comes first in the list_.

Second, you should replace the definition of the storage engine (sqlite3 by default on newly-created applications).
That is, replace the following

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

with something like

```python
DATABASES = {
    'default': {
        'ENGINE': 'django_cassandra_engine',
        'NAME': KEYSPACE_NAME
        'OPTIONS': {
            'connection': {
                'auth_provider': PlainTextAuthProvider(
                    AUTH_USERNAME,
                    AUTH_PASSWORD,
                ),
                'cloud': {
                    'secure_connect_bundle': SECURE_BUNDLE_PATH,
                },
            }
        }
    }
}
```

Note that you should add the line `from cassandra.auth import PlainTextAuthProvider` earlier in the file.

In the above database connection settings, there are four variables that should be set in a secure and portable manner
(e.g. through use of a `.env` file as shown in the application example, or otherwise): they are

- `KEYSPACE_NAME`, the name of the keyspace in your Astra DB instance. Note that you _don't have to create the tables yourself_. Tables are created based on model definitions when you issue Django's `sync_cassandra` command before running the application the first time (see instructions on the [sample application's readme](https://github.com/awesome-astra/sample-astra-django-website#sync-with-the-database));
- `AUTH_USERNAME` and `AUTH_PASSWORD`: these may be either the "clientID/clientSecret" pair from your [database token](https://awesome-astra.github.io/docs/pages/astra/create-token/), or alternatively the literal `"token"` and the token string starting with `AstraCS:...`.
- `SECURE_BUNDLE_PATH`, the full path to the [Secure connect bundle](https://awesome-astra.github.io/docs/pages/astra/download-scb/) for your database. This can be downloaded manually or, as described in the application's readme, through use of [Astra CLI](https://awesome-astra.github.io/docs/pages/astra/astra-cli/) along with the rest of the above setup.

Third, you may consider adding the line `CASSANDRA_FALLBACK_ORDER_BY_PYTHON = True`. This means that, when a model's `order_by()` directive cannot be mapped to CQL according to the table's clustering, the model can fall back to in-code sorting. Although this may be non-optimal in general (especially for large result sets), it can still be a safe and useful choice if you know that the amount of data involved is small.

### Dependencies and Cassandra drivers

Two dependencies are needed for a Django application backed by Astra DB:

- `Django`
- `django-cassandra-engine`

(the other package in the sample app's
[`requirements.txt`](https://github.com/awesome-astra/sample-astra-django-website/blob/main/requirements.txt)
serves the purpose of injecting connection secrets in Django
`settings.py` as outlined in previous section.)

It should be noted that current versions of the Cassandra engine for Django
automatically installs ScyllaDB's version of the Cassandra drivers, i.e.
package `scylla-driver`. These are a drop-in replacement for the package
by DataStax (`cassandra-driver`), meaning that:

1. both are imported with statements such as `from cassandra.cluster import Cluster` and the like;
2. it is unwise to install both at once as that would introduce namespace collisions.

If you prefer to work with the driver package by DataStax, the application would work just fine indeed:
to do so, one can simply uninstall the drivers by Scylla (`pip uninstall scylla-driver`), and then install
the desired drivers (`pip install cassandra-driver`). Not even a line of code should then be changed.

_Note: at the time of writing (January 2023), the differences between the two drivers are little and mostly confined to additional support for Scylla-specific database architecture. As such, there would be no implications on the functionality, nor the performance, of applications based on Astra DB._

### Caveats and Troubleshooting

_In this section we collect a handy list of warnings and things to keep in mind
when using Astra DB with Django, whether by migration or when designing
an app from scratch._

* In Cassandra models, there is no `max_length` parameter for text fields,
corresponding to the absence of such a property for the CQL `TEXT` data type.

* Likewise, you should not add the `editable=False` parameter for
primary-key columns when defining models.

* For a model class subclassing `DjangoCassandraModel` with a _multi-column
primary key_ (regardless of the partition/clustering distinction) one must provide
a `get_pk_field` attribute through a `Meta` class: in this way the Django engine
would be able to resolve queries such as `<Model class>.objects.get(pk=...)`.
You can see an example of this in the model quoted earlier. Failure to comply with
this requirement would make the application fail to start with an informative error.
_If you are using the model in a sensible way (from a Cassandra perspective), you can pay little attention to this since you should not, as a matter of fact, be triggering such a query anywhere in your code, implicitly or explicitly._

* The `django-cassandra-engine` package does support most of the features of its native,
RDBMS counterpart; however, in some cases, a little more manual plumbing might be
in order. In particular, the native models support fields of type [`FileField`](https://docs.djangoproject.com/en/4.1/ref/models/fields/#django.db.models.FileField), which pairs with the
[_form field_ of the same name](https://docs.djangoproject.com/en/4.1/ref/forms/fields/#filefield) 
and handles upload of files by storing the actual file content on disk and a path to it on DB.
The Cassandra engine has no such facility, requiring you to manually handle what happens
once the endpoint has received file uploads via a form POST (you can still use the _form_ field, though).
A similar consideration holds for the more specific `ImageField` model field.

* Once the application is ready and the DB has been synchronized with it
(using `./manage.py sync_cassandra` or equivalent command), you will still see
warnings about a number of "unapplied migrations". You can ignore these warnings
(incidentally, the `migrate` command is not even supported by the Cassandra engine,
being supplanted by `sync_cassandra`).

* If you change the model and try to run the application, or forget to run the
`sync_cassandra` management operation altogether, changes are you will see the
application crash with no messages or with just a unhelpful
`Segmentation fault (core dumped)` message. In this case, please make sure that
(1) your database is not in "Hibernated" state, (2) you have launched a sync
operation after all changes to any model.

* If you use a model's `filter(...)` method but with a filtering
condition (a `WHERE` clause) that is not a good match to the structure
of your database table, the application will most likely function,
but possibly exhibit bad performance. It is your responsibility to make sure
that usage of models does not sweep violations of data modeling best
practices under the rug.

* As remarked above, if you request objects to be sorted in a way that is
not compliant with the structure of your table, you can still enable a fallback
behaviour whereby the rows are sorted post-retrieval in Python code (you do
this through `CASSANDRA_FALLBACK_ORDER_BY_PYTHON` in `settings.py`,
but you should do this only if there are few rows involved).
Don't be alarmed if you _still_ see something like the following in the application
logs (the warning would be a true exception if you hadn't enabled the fallback):

```
UserWarning: .order_by() with column "-date" failed!
Falling back to ordering in python.
Exception was:
Can't order on 'date', can only order on (clustered) primary keys
```



## References

- Django homepage, [djangoproject.com](https://www.djangoproject.com/);
- `django-cassandra-engine` documentation, [r4fek.github.io/django-cassandra-engine](https://r4fek.github.io/django-cassandra-engine/);
- The sample application referenced throughout this page, ["partyfinder"](https://github.com/awesome-astra/sample-astra-django-website);
- Another Django application using Cassandra from DataStax' Sample App Gallery: [a simple standard blog engine](https://github.com/DataStax-Examples/django-cassandra-blog).
