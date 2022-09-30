---
title: "Lagom"
description: "Lagom is an open source framework for building out Reactive microservices.  Lagom essentially wires-up your services, freeing you from having to spend time writing lots of "boiler-plate" code."
tags: "java, scala, framework"
icon: "https://awesome-astra.github.io/docs/img/tile-lagom.png"
developer_title: "Lightbend"
developer_url: "https://www.lagomframework.com"
links:
- title: "Lagom Documentation"
  url: "https://www.lagomframework.com/documentation"
---


### Working with Lagom

<div class="nosurface" markdown="1">
<img src="../../../../img/tile-lagom.png" align="left" height="180px"/>
</div>

Lagom is an open source framework for building out Reactive microservices.  Lagom essentially wires-up your services, freeing you from having to spend time writing lots of "boiler-plate" code.  To get more information regarding the framework visit its website @ [lagomframework.com](https://www.lagomframework.com/).

#### <span class="nosurface">📦.</span> Prerequisites [ASTRA DB]

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface">You should <a href="/docs/pages/astra/create-token/">Have an Astra Token</a></li>
</ul>

#### <span class="nosurface">📦.</span> Prerequisites [Development Environment]

- You should install the **Java Development Kit (JDK)**, of at least version 8: Use the reference documentation to install a **Java Development Kit**.

  - [Java 8](https://docs.oracle.com/javase/8/docs/technotes/guides/install/install_overview.html)
  - [Java 11](https://docs.oracle.com/en/java/javase/11/install/index.html)
  - [Java 17](https://docs.oracle.com/en/java/javase/17/install/index.html)

Validate your installation with:

```bash
java --version
```

- You should install **Apache Maven**: Use the [reference documentation](https://maven.apache.org/install.html) and validate your installation with:

```bash
mvn -version
```

### Building a sample Lagom project

Create a new Maven project in your IDE which uses the `maven-archetype-lagom-java` archetype.  You can also do this from the command line:

```bash
mvn archetype:generate -DarchetypeGroupId=com.lightbend.lagom \
  -DarchetypeArtifactId=maven-archetype-lagom-java -DarchetypeVersion=1.2.0
```

This will create a sample Lagom project with two services: Hello and Stream.  The project can be built and run with this command:

```bash
mvn lagom:runAll
```

Note that by default, Lagom will start using _embedded Cassandra_ as its data store, running on `localhost:4000`.  Port 4000 was chosen (instead of 9042) so as not to collide with another instance of Cassandra running locally.

### Using with Apache Cassandra

To get Lagom to connect to Cassandra (for local development) there are two places which need changes: Maven's `pom.xml` and the services' `application.conf` files.

Inside the `pom.xml` file, locate the `lagom-maven-plugin` and make the following adjustments:
```xml
<plugin>
    <groupId>com.lightbend.lagom</groupId>
    <artifactId>lagom-maven-plugin</artifactId>
    <version>${lagom.version}</version>
        <configuration>
            <unmanagedServices>
                <cas_native>localhost:9042</cas_native>
            </unmanagedServices>                    
            <cassandraEnabled>false</cassandraEnabled>
        </configuration>
</plugin>
```

That these settings perform two functions:
- Disables Lagom's embedded Cassandra, causing it not to start.
- Informs Lagom designate Cassandra as an "unmanaged" service, and provides it with the contact point for the cluster/instance.

If your local Cassandra does not use SSL or authentication, then you are finished.  But if your local Cassandra does have security enabled, you'll want to make these changes to _each_ of your services' `application.conf` files:
```
your-service.cassandra {
    authentication {
        username = "yourUserName"
        password = "yourPassword"
    }
    ssl {
        truststore.path = "/Users/youruser/cassandra/truststore.jks"
        truststore.password = "yourTrustStorePassword"
        keystore.path = "/Users/youruser/cassandra/keystore.jks"
        keystore.password = "yourKeyStorePassword"
    }
    keyspace = your_service
}

cassandra-journal {
    keyspace = ${your-service.cassandra.keyspace}
    authentication = ${your-service.cassandra.authentication}
    ssl = ${your-service.cassandra.ssl}
}

cassandra-snapshot-store {
    keyspace = ${your-service.cassandra.keyspace}
    authentication = ${your-service.cassandra.authentication}
    ssl = ${your-service.cassandra.ssl}
}

lagom.persistence.read-side.cassandra {
    keyspace = ${your-service.cassandra.keyspace}
    authentication = ${your-service.cassandra.authentication}
    ssl = ${your-service.cassandra.ssl}
}
```

These settings will allow Lagom to connect to your local Cassandra with authentication and client-to-node SSL.  If you're only using auth, simply remove the config lines containing `ssl`.

### Using with DataStax Astra DB

For connecting to DataStax Astra DB, it is similar.  You will need to set both authentication _and_ SSL to connect with Astra DB, as well as a few additional properties.

The `pom.xml` is largely the same, except that you'll need to add your Astra host name here.  Note that in "production mode," you should not need to modify this file.  But if you're connecting to an Astra DB cluster in "development mode," you'll still need to disable embedded Cassandra and designate the Cassandra service as "unmanaged" with a contact point:
```xml
<configuration>
    <unmanagedServices>
        <cas_native>https://ASTRA_DB_ID-ASTRA_DB_REGION.db.astra.datastax.com:29042</cas_native>
    </unmanagedServices>                    
    <cassandraEnabled>false</cassandraEnabled>
</configuration>
```

The `application.conf` service files will require similar modifications:
```
stream.cassandra {
    contact-points = ["ASTRA_DB_ID-ASTRA_DB_REGION.db.astra.datastax.com:29042"]
    authentication {
        username = "token"
        password = "AstraCS:yourAstraT0ken"
    }
    ssl {
        truststore.path = "/Users/youruser/astradb/trustStore.jks"
        truststore.password = "yourTrustStorePassword"
        keystore.path = "/Users/youruser/stackoverflow/identity.jks"
        keystore.password = "Tte3jRy07ocEf6Z8h"
    }
    session-provider = akka.persistence.cassandra.ConfigSessionProvider
    keyspace = "stream"
}

cassandra-journal {
    contact-points = ${stream.cassandra.contact-points}
    keyspace = ${stream.cassandra.keyspace}
    authentication = ${stream.cassandra.authentication}
    ssl = ${stream.cassandra.ssl}
    session-provider = ${stream.cassandra.session-provider}
    keyspace-autocreate = false
    tables-autocreate = true
}

cassandra-snapshot-store {
    contact-points = ${stream.cassandra.contact-points}
    keyspace = ${stream.cassandra.keyspace}
    authentication = ${stream.cassandra.authentication}
    ssl = ${stream.cassandra.ssl}
    session-provider = ${stream.cassandra.session-provider}
    keyspace-autocreate = false
    tables-autocreate = true
}

lagom.persistence.read-side.cassandra {
    contact-points = ${stream.cassandra.contact-points}
    keyspace = ${stream.cassandra.keyspace}
    authentication = ${stream.cassandra.authentication}
    ssl = ${stream.cassandra.ssl}
    session-provider = ${stream.cassandra.session-provider}
    keyspace-autocreate = false
    tables-autocreate = true
}
```

Note the options for `keyspace-autocreate` and `tables-autocreate` are shown set here.  By default, these are both set to `true`.  However, Astra DB only permits keyspace creation to happen via the Astra Dashboard.  This means that:

- Keyspaces must be created before connecting a Lagom microservice to Astra DB.
- Lagom's attempts to create keyspaces will fail (due to a permissions error).
- Table creation should function appropriately, assuming the required keyspaces already exist.

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/) 
</div>
