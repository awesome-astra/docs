??? abstract "Setup Datastax `Astra DB`"

    - [x] **Create your DataStax Astra account**: 
    
    <a href="https://astra.dev/3B7HcYo" class=md-button>Sign Up</a>

    - [x] **Create an Astra Token**
    
    An astra token acts as your credentials, it holds the different permissions. The scope of a token is the whole organization (tenant) but permissions can be edited to limit usage to a single database.

    To create a token, please follow [this guide](https://awesome-astra.github.io/docs/pages/astra/create-token/#c-procedure)

    The Token is in fact three separate strings: a `Client ID`, a `Client Secret` and the `token` proper. You will need some of these strings to access the database, depending on the type of access you plan. Although the Client ID, strictly speaking, is not a secret, you should regard this whole object as a secret and make sure not to share it inadvertently (e.g. committing it to a Git repository) as it grants access to your databases.

    ```json
    {
      "ClientId": "ROkiiDZdvPOvHRSgoZtyAapp",
      "ClientSecret": "fakedfaked",
      "Token":"AstraCS:fake"
    }
    ```

    It is handy to have your token declare as an environment variable (_replace with proper value_):

    ```
    export ASTRA_TOKEN="AstraCS:replace_me"
    ```

    - [x] **Create a Database and a keyspace**

    With your account you can run multiple databases, a Databases is an Apache Cassandra cluster. It can live in one or multiple regions (dc). In each Database you can have multiple keyspaces. In the page we will use the database name `db_demo` and the keyspace `keyspace_demo`.
    
    You can create the DB using the user interface and [here is a tutorial](https://awesome-astra.github.io/docs/pages/astra/create-instance/#c-procedure). You can also use Astra command line interface. To install and setup the CLI run the following:

    ```
    curl -Ls "https://dtsx.io/get-astra-cli" | bash
    source ~/.astra/cli/astra-init.sh
    astra setup --token ${ASTRA_TOKEN}
    ```

    To create DB and keyspace with the CLI:

    ```
    astra db create db_demo -k keyspace_demo --if-not-exists
    ```

    - [x] **Download the Secure Connect Bundle for current database**

    A _Secure Connect Bundle_ contains the certificates and endpoints informations to open a [mTLS connection](https://www.cloudflare.com/learning/access-management/what-is-mutual-tls/). Often mentionned as `scb` its scope is a database AND a region. If your database is deployed on multiple regions you will have to download the bundle for each one and initiate the connection accordingly. Instructions to [download Secure Connect Bundle are here](/docs/pages/astra/download-scb/)

    <img src="https://github.com/awesome-astra/docs/blob/main/docs/img/drivers/drivers-connectivity.png?raw=true" />

     You can download the secure connect bundle from the user interface and [here is a tutorial](https://awesome-astra.github.io/docs/pages/astra/download-scb/). You can also use Astra command line interface.

     ```
     astra db download-scb db_demo -f /tmp/secure-connect-bundle-db-demo.zip
     ```
    