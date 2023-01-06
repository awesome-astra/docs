<img src="../../../img/tile-quarkus.png" align="left" width="180px"/>

*Quarkus - Supersonic Subatomic Java*
is a modern Kubernetes-native Java framework tailored for GraalVM and HotSpot to create applications for a modern, cloud-native world. 

The goal is to make Java the leading platform in Kubernetes and serverless environments while offering developers a framework to address a wider range of distributed application architectures.

Wth its reactive nature, it complements Apache Cassandra and together they are a great fit for responsive microservices.

## 1. Overview

[quarkus.io](https://quarkus.io/) is the central repoistory for everything Quarkus related.

The [Cassandra Quarkus extension](https://github.com/datastax/cassandra-quarkus) renders cassandra a first class citizen on the platform.

You can [use the Cassandra client guide for Quarkus] (https://quarkus.io/guides/cassandra) to get started on using Quarkus and Astra together.

##2. Create a Data Model

Create a Data model for the simple application using the following CQL statement in the Astra console.

```cql
CREATE TABLE k1.Fruit ( name text PRIMARY KEY, description text);
```

where `k1` is the keyspace.

##3. Try it out!

Start by cloning the repo.

```
git clone https://github.com/datastaxdevs/Cassandra-Quarkus-Demo
```

Version check.

Check the Java version with the following command.

```
java -version
openjdk version "11.0.14" 2022-01-18
OpenJDK Runtime Environment GraalVM CE 22.0.0.2 (build 11.0.14+9-jvmci-22.0-b05)
OpenJDK 64-Bit Server VM GraalVM CE 22.0.0.2 (build 11.0.14+9-jvmci-22.0-b05, mixed mode, sharing)
```

Setup Astra credentials.

Include the credentials from the Astra console in the file `src/main/resources/application.properties` as shown below by downloading and including the path of the [security connect bundle](https://docs.datastax.com/en/astra-serverless/docs/connect/secure-connect-bundle.html) and the username and secret for the database.

```
-#quarkus.cassandra.cloud.secure-connect-bundle=/path/to/secure-connect-bundle.zip
+quarkus.cassandra.cloud.secure-connect-bundle=k1.zip
 
 # Authentication
 # See https://docs.datastax.com/en/developer/java-driver/latest/manual/core/authentication/
-#quarkus.cassandra.auth.username=<your username>
-#quarkus.cassandra.auth.password=<your password>
+quarkus.cassandra.auth.username=user
+quarkus.cassandra.auth.password=secret
```

Package the app as below.

```
mvn clean package
```

and run the application as below.

```
java -jar target/cassandra-quarkus-quickstart-1.0.1-runner.jar
```

Check if the REST endpoints are accessible as below.

```
curl http://localhost:8080/fruits
```

As we've no data (yet), we should get an empty list.

Let's add an entry as indicated in the example.

```
curl --header "Content-Type: application/json" \
  --request POST \          
  --data '{"name":"apple","description":"red and tasty"}' \
  http://localhost:8080/fruits
```

Let's check via the `curl` command as below

```
curl http://localhost:8080/fruits
```

and also in the Astra CQL console.


```cql
select * from k1.Fruit;

 name  | description
-------+---------------
 apple | red and tasty

(1 rows)
```

##4. Next Steps and Conclusions

You can check out the object mapper details, metrics and health reports from the app as outlined in the [user guide](https://quarkus.io/guides/cassandra).

You could even package it as a native app and realize the full power of the Quarkus platform.


##5. More Resources!

- [A complete Todo Application with Quarkus](https://github.com/datastaxdevs/quarkus-astra-intro-demo)
- [Workshop outlining a step-by-step approach to run the application] (https://github.com/datastaxdevs/workshop-intro-quarkus-cassandra)
- [Recording of the workshop](https://www.youtube.com/watch?v=iz9MGczDA_U)

<div class="nosurface" markdown="1">
[🏠 Back to home](https://awesome-astra.github.io/docs/)

</div>
