The DataStax Astra command-line interface (Astra CLI) is a set of commands used to create and manage Astra resources. The Astra CLI is available across Astra services and is designed to get you working quickly with Astra, with an emphasis on automation.

???+ info "Setup your Astra account "

    To use the Astra CLI you need to create a [DataStax Astra](https://astra.datastax.com) account. You also need to [create a token](/docs/pages/astra/create-token/) with the `Organization Administration` role.

## Installation

The current release of the Astra CLI is: ![Latest Release](https://img.shields.io/github/v/release/datastax/astra-cli)


- For information about the latest release, see the [release notes](https://github.com/datastax/astra-cli/releases). 
- To find your installed version and see if you need to update, run `astra --version`

The Astra CLI is available to install on **Windows**, **MacOS** and **Linux** environments.

### 1. Install on `MAC OS`

**✅ 1.1 Homebrew**

Homebrew is the easiest way to manage your CLI install. It provides convenient ways to install, update, and uninstall. If you don't have homebrew available on your system, install homebrew before continuing.

You can install the Astra CLI on MacOS by updating your brew repository information, and then running the install command:

```
brew install datastax/astra-cli/astra-cli
```

The Homebrew formula of Astra CLI installs a completion file named astra in the Homebrew-managed completions directory (default location is /usr/local/etc/bash_completion.d/). To enable completion, please follow Homebrew's instructions [here](https://docs.brew.sh/Shell-Completion).

**✅ 1.2 Manual Installation**

To install (or reinstall) the CLI use the following command in a terminal:

```
curl -Ls "https://dtsx.io/get-astra-cli" | bash
```

??? question "Where is Astra CLI installed on my machine ?"

    - The Astra CLI is installed in `~/.astra/cli`. This folder is deleted and recreated during installation.
    
    - Your configuration is saved in `~/.astrarc` file and will not be lost during reinstallation.

### 2. Install on `LINUX`

**✅ 2.1 Manual Installation**

To install (or reinstall) the CLI the following command in a terminal:

```
curl -Ls "https://dtsx.io/get-astra-cli" | bash
```

??? question "Where is Astra CLI installed on my machine ?"

    - The Astra CLI is installed in `~/.astra/cli`. This folder is deleted and recreated during installation.
    
    - Your configuration is saved in `~/.astrarc` file and will not be lost during reinstallations.

**✅ 2.2 Using sdkman**

_Installation with SDK MAN is not available yet but is high in the roadmap_

**✅ 2.3 Using a package Manager**

_Installation with package managers (yum, apt) is not available yet but is high in the roadmap_

### 3. Install on `WINDOWS`

- Download a Windows archive [astra-cli-${version}-windows.zip](https://github.com/datastax/astra-cli/releases/download/0.1/astra-cli-0.1-windows.zip)

- Unzip the archive in folder or your choice, for instance `C:/Programs/astra-cli`

- Add `C:/Programs/astra-cli/astra.exe` to your path using [this tutorial](https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/)

## Getting Started

### 1. Setup

Before issuing commands to initialize the configuration file `~/.astrarc`. To to so run the following command. You will be asked to provide your token (AstraCS:...). It will be saved and reused for your commands in the future.

```
astra setup
```

???+ abstract "🖥️ `astra setup` command output"

    ```
        _____            __                
       /  _  \   _______/  |_____________   
      /  /_\  \ /  ___/\   __\_  __ \__  \ 
    /    |    \\___ \  |  |  |  | \// __ \_
    \____|__  /____  > |__|  |__|  (____  /
             \/     \/                   \/

            ------------------------
            ---       SETUP      ---
            ------------------------

    🔑 Enter token (starting with AstraCS...):
    ```

You are all set! The configuration (mainly your token) is stored in the file `~/.astrarc`.

### 2. First commands

- Display the current version of the CLI, validating setup is complete.

```
astra --version
```

- Display your configuration list.

```bash
astra config list
```

???+ abstract "🖥️ Sample output" 

    ```
    +-----------------------------------------+
    | configuration                           |
    +-----------------------------------------+
    | default (cedrick.lunven@datastax.com)   |
    | cedrick.lunven@datastax.com             |
    +-----------------------------------------+
    ```

### 3. Get Help

The solution provides extensive documentation for any command. It also provides some bash autocompletion, use the `TAB` key twice to get a list of options.

**✅ 3a - Autocompletion**

```
astra <TAB> <TAB>
```

???+ abstract "🖥️ Sample output" 

    ```
    --no-color  config      db          help        role        setup       shell       user  
    ```

**✅ 3b - Documentation**

Groups of commands will get you the different commands avalable.

- Display main help

```
astra help
```

???+ abstract "🖥️ Sample output" 

    ```
    usage: astra <command> [ <args> ]

    Commands are:
        help     View help for any command
        setup    Initialize configuration file
        shell    Interactive mode (default if no command provided)
        config   Manage configuration file
        db       Manage databases
        role     Manage roles (RBAC)
        user     Manage users

    See 'astra help <command>' for more information on a specific command.
    ```

- Display help for a command group `astra db`

```
astra help db
```

???+ abstract "🖥️ Sample output" 

    ```
    NAME
            astra db - Manage databases

    SYNOPSIS
            astra db { cqlsh | create | create-keyspace | delete | dsbulk | get |
                    list } [--] [ --token <AUTH_TOKEN> ]
                    [ --config-file <CONFIG_FILE> ] [ --no-color ]
                    [ {-v | --verbose} ] [ {-conf | --config} <CONFIG_SECTION> ]
                    [ --log <LOG_FILE> ] [ {-o | --output} <FORMAT> ] [cmd-options]
                    <cmd-args>

            Where command-specific options [cmd-options] are:
                cqlsh: [ --debug ] [ {-f | --file} <FILE> ] [ {-k | --keyspace} <KEYSPACE> ]
                        [ --version ] [ {-e | --execute} <STATEMENT> ] [ --encoding <ENCODING> ]
                create: [ {-k | --keyspace} <KEYSPACE> ] [ --if-not-exist ] [ {-r | --region} <DB_REGION> ]
                create-keyspace: {-k | --keyspace} <KEYSPACE> [ --if-not-exist ]
                delete:
                dsbulk:
                get:
                list:

            Where command-specific arguments <cmd-args> are:
                cqlsh: <DB>
                create: <DB_NAME>
                create-keyspace: <DB>
                delete: <DB>
                dsbulk: [ <dsbulkArguments>... ]
                get: <DB>
                list:

            See 'astra help db <command>' for more information on a specific command.
    ```

- Display help for unitary command `astra db list`

For unitary commands, all options and details are provided. 

```
astra help db list
```

???+ abstract "🖥️ Sample output" 

    ```
    NAME
            astra db list - Display the list of Databases in an organization

    SYNOPSIS
            astra db list [ {-conf | --config} <CONFIG_SECTION> ]
                    [ --config-file <CONFIG_FILE> ] [ --log <LOG_FILE> ]
                    [ --no-color ] [ {-o | --output} <FORMAT> ]
                    [ --token <AUTH_TOKEN> ] [ {-v | --verbose} ]

    OPTIONS
            -conf <CONFIG_SECTION>, --config <CONFIG_SECTION>
                Section in configuration file (default = ~/.astrarc)

            --config-file <CONFIG_FILE>
                Configuration file (default = ~/.astrarc)

            --log <LOG_FILE>
                Logs will go in the file plus on console

            --no-color
                Remove all colors in output

            -o <FORMAT>, --output <FORMAT>
                Output format, valid values are: human,json,csv

            --token <AUTH_TOKEN>
                Key to use authenticate each call.

            -v, --verbose
                Verbose mode with log in console
    ```

## Astra DB

### 1. List databases

**✅ 1a - list**

To get the list of non terminated database in your oganization, use the command `list` in the group `db`.

```
astra db list
```

???+ abstract "🖥️ Sample output" 

    ```
    +---------------------+--------------------------------------+---------------------+----------------+
    | Name                | id                                   | Default Region      | Status         |
    +---------------------+--------------------------------------+---------------------+----------------+
    | mtg                 | dde308f5-a8b0-474d-afd6-81e5689e3e25 | eu-central-1        | ACTIVE         |
    | workshops           | 3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23 | eu-west-1           | ACTIVE         |
    | sdk_tests           | 06a9675a-ca62-4cd0-9b94-aefaf395922b | us-east-1           | ACTIVE         |
    | test                | 7677a789-bd57-455d-ab2c-a3bdfa35ba68 | eu-central-1        | ACTIVE         |
    | demo                | 071d7059-d55b-4cdb-90c6-41c26da1a029 | us-east-1           | ACTIVE         |
    | ac201               | 48c7178c-58cb-4657-b3d2-8a9e3cc89461 | us-east-1           | ACTIVE         |
    +---------------------+--------------------------------------+---------------------+----------------+
    ```

**✅ 1b - Get Help**

To get help on a command, always prefix with `astra help XXX`

```
astra help db list
```

???+ abstract "🖥️ Sample output" 

    ```
    NAME
            astra db list - Display the list of Databases in an organization

    SYNOPSIS
            astra db list [ {-conf | --config} <CONFIG_SECTION> ]
                    [ --config-file <CONFIG_FILE> ] [ --log <LOG_FILE> ]
                    [ --no-color ] [ {-o | --output} <FORMAT> ]
                    [ --token <AUTH_TOKEN> ] [ {-v | --verbose} ]

    OPTIONS
            -conf <CONFIG_SECTION>, --config <CONFIG_SECTION>
                Section in configuration file (default = ~/.astrarc)

            --config-file <CONFIG_FILE>
                Configuration file (default = ~/.astrarc)

            --log <LOG_FILE>
                Logs will go in the file plus on console

            --no-color
                Remove all colors in output

            -o <FORMAT>, --output <FORMAT>
                Output format, valid values are: human,json,csv

            --token <AUTH_TOKEN>
                Key to use authenticate each call.

            -v, --verbose
                Verbose mode with log in console
    ```            

**✅ 1c - Change output**

```
astra db list -o csv
```

??? abstract "🖥️ Sample output" 

    ```csv
    Name,id,Default Region,Status
    mtg,dde308f5-a8b0-474d-afd6-81e5689e3e25,eu-central-1,ACTIVE
    workshops,3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23,eu-west-1,ACTIVE
    sdk_tests,06a9675a-ca62-4cd0-9b94-aefaf395922b,us-east-1,ACTIVE
    test,7677a789-bd57-455d-ab2c-a3bdfa35ba68,eu-central-1,ACTIVE
    demo,071d7059-d55b-4cdb-90c6-41c26da1a029,us-east-1,ACTIVE
    ac201,48c7178c-58cb-4657-b3d2-8a9e3cc89461,us-east-1,ACTIVE
    ```

```
astra db list -o json
```

??? abstract "🖥️ Sample output" 

    ```json
      {
        "code" : 0,
        "message" : "astra db list -o json",
        "data" : [ {
          "Status" : "ACTIVE",
          "Default Region" : "eu-central-1",
          "id" : "dde308f5-a8b0-474d-afd6-81e5689e3e25",
          "Name" : "mtg"
        }, {
          "Status" : "ACTIVE",
          "Default Region" : "eu-west-1",
          "id" : "3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23",
          "Name" : "workshops"
        }, {
          "Status" : "ACTIVE",
          "Default Region" : "us-east-1",
          "id" : "06a9675a-ca62-4cd0-9b94-aefaf395922b",
          "Name" : "sdk_tests"
        }, {
          "Status" : "ACTIVE",
          "Default Region" : "eu-central-1",
          "id" : "7677a789-bd57-455d-ab2c-a3bdfa35ba68",
          "Name" : "test"
        }, {
          "Status" : "ACTIVE",
          "Default Region" : "us-east-1",
          "id" : "071d7059-d55b-4cdb-90c6-41c26da1a029",
          "Name" : "demo"
        }, {
          "Status" : "ACTIVE",
          "Default Region" : "us-east-1",
          "id" : "48c7178c-58cb-4657-b3d2-8a9e3cc89461",
          "Name" : "ac201"
        } ]
      }
    ```

### 2. Create database

**✅ 2a - Create Database** 

If not provided, the region will be the default free region and the keyspace will be the database name but you can change then with `-r` and `-k` respectivitely.

```
astra db create demo
```

**✅ 2b - Options ` --if-not-exist` and `--wait`** 

- The database name does not ensure unicity (the database id does). As such, if you issue the command multiple times you will end up with multiple instances. To change this behavior, you can use `--if-not-exist`

- Database creation is an asynchronous operation. In some situations, such as during your CI/CD, you likely will want the db to be `ACTIVE` before moving forward. The option `--wait` will trigger a blocking command until the db is ready

- On the free tier, after a period of inactivity, the database moves to a `HIBERNATED` state. The creation command, will resume the db when needed.

```
astra db create demo -k ks2 --if-not-exist --wait
```

**✅ 2c - Get help** 

To show help, enter following command: 

```
astra help db create
```

??? abstract "🖥️ Sample output" 

    ```
    NAME
            astra db create - Create a database with cli

    SYNOPSIS
            astra db create [ {-cf | --config-file} <CONFIG_FILE> ]
                    [ {-conf | --config} <CONFIG_SECTION> ]
                    [ {--if-not-exist | --if-not-exists} ]
                    [ {-k | --keyspace} <KEYSPACE> ] [ --no-color ]
                    [ {-o | --output} <FORMAT> ] [ {-r | --region} <DB_REGION> ]
                    [ --timeout <timeout> ] [ --token <AUTH_TOKEN> ]
                    [ {-v | --verbose} ] [ --wait ] [--] <DB>

    OPTIONS
            -cf <CONFIG_FILE>, --config-file <CONFIG_FILE>
                Configuration file (default = ~/.astrarc)

            -conf <CONFIG_SECTION>, --config <CONFIG_SECTION>
                Section in configuration file (default = ~/.astrarc)

            --if-not-exist, --if-not-exists
                will create a new DB only if none with same name

            -k <KEYSPACE>, --keyspace <KEYSPACE>
                Default keyspace created with the Db

            --no-color
                Remove all colors in output

            -o <FORMAT>, --output <FORMAT>
                Output format, valid values are: human,json,csv

            -r <DB_REGION>, --region <DB_REGION>
                Cloud provider region to provision

            --timeout <timeout>
                Provide a limit to the wait period in seconds, default is 300s.

            --token <AUTH_TOKEN>
                Key to use authenticate each call.

            -v, --verbose
                Verbose mode with log in console

            --wait
                Will wait until the database become ACTIVE

            --
                This option can be used to separate command-line options from the
                list of arguments (useful when arguments might be mistaken for
                command-line options)

            <DB>
                Database name (not unique)
    ```

### 3. Resume database

In the free tier, after 23H of inactivity your database will be hibernated. To wake up the db, you can use the `resume` command.

**✅ 2a - Resuming** 

- Assuming you have an hibernating database.

```
astra db list
```

```
+---------------------+--------------------------------------+---------------------+----------------+
| Name                | id                                   | Default Region      | Status         |
+---------------------+--------------------------------------+---------------------+----------------+
| hemidactylus        | 643c6bb8-2336-4649-97d5-39c33491f5c1 | eu-central-1        | HIBERNATED     |
+---------------------+--------------------------------------+---------------------+----------------+
```

- Trigger an explicit resuming with:

```
astra db resume hemidactylus
```

??? abstract "🖥️ Sample output" 

    ```
    +---------------------+--------------------------------------+---------------------+----------------+
    | Name                | id                                   | Default Region      | Status         |
    +---------------------+--------------------------------------+---------------------+----------------+
    | hemidactylus        | 643c6bb8-2336-4649-97d5-39c33491f5c1 | eu-central-1        | RESUMING       |
    +---------------------+--------------------------------------+---------------------+----------------+

    And after a few time
    +---------------------+--------------------------------------+---------------------+----------------+
    | Name                | id                                   | Default Region      | Status         |
    +---------------------+--------------------------------------+---------------------+----------------+
    | hemidactylus        | 643c6bb8-2336-4649-97d5-39c33491f5c1 | eu-central-1        | ACTIVE         |
    +---------------------+--------------------------------------+---------------------+----------------+
    ```

### 4. Get database details

**✅ 4a. To get general information or details on an entity use the command `get`.**

```
astra db get demo
```

In the output, you specially see the list of keyspaces available and the different regions.

???+ abstract "🖥️ Sample output" 

    ```
    +------------------------+-----------------------------------------+
    | Attribute              | Value                                   |
    +------------------------+-----------------------------------------+
    | Name                   | demo                                    |
    | id                     | 071d7059-d55b-4cdb-90c6-41c26da1a029    |
    | Status                 | ACTIVE                                  |
    | Default Cloud Provider | AWS                                     |
    | Default Region         | us-east-1                               |
    | Default Keyspace       | demo                                    |
    | Creation Time          | 2022-07-26T15:41:18Z                    |
    |                        |                                         |
    | Keyspaces              | [0] demo                                |
    |                        |                                         |
    | Regions                | [0] us-east-1                           |
    +------------------------+-----------------------------------------+
    ```

**✅ 4b. To get a special property, you can add the option `--key`. Multiple keys are available: `id`, `status`, `cloud`, `keyspace`, `keyspaces`, `region`, `regions`. Notice that the output is raw. This command is expected to be used in scripts**

```
astra db get demo --key id
```

???+ abstract "🖥️ Sample output" 

    ```
    dde308f5-a8b0-474d-afd6-81e5689e3e25
    ```

**✅ 4c. To get database status in a human readble for use `status` command**

```
astra db status demo
```

???+ abstract "🖥️ Sample output" 

    ```
    [ INFO ] - Database 'demo' has status 'ACTIVE'
    ```

### 5. Delete Database

**✅ 5a. To delete a db use the command `delete`.**

```
astra db delete demo2
```

### 6. Working with keyspaces

A keyspace is created when you create the database. The default CLI behaviour is to provide the same values for keyspace
and database names. You can also define your own keyspace name with the flag `-k`.

**✅ 6a - Create new keyspace** 

- To add a keyspace `ks2` to an existing database `demo` use the following. The option `--if-not-exist` is optional but could help you provide idempotent scripts.

```
astra db create-keyspace demo -k ks2 --if-not-exist
```

- If the database is not found you will get a warning message and a dedicated code returned. To see your new keyspace you can display your database details

```
astra db list-keyspaces demo
```

**✅ 6b - Get help** 

```
astra help db create-keyspace
```

### 7. Cqlsh

[Cqlsh](https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html) is a standalone shell to work with Apache Cassandra™. It is compliant with Astra but requires a few extra steps of configuration. The purpose of the CLI is to integrate with `cqlsh` and do the integration for you.

Astra CLI will **download**, **install**, **setup** and **wrap** `cqlsh` for you to interact with Astra.

**✅ 7a - Interactive mode** 

If no options are provided,  you enter `cqlsh` interactive mode

```
astra db cqlsh demo
```

??? abstract "🖥️ Sample output" 

    ```
    Cqlsh is starting please wait for connection establishment...
    Connected to cndb at 127.0.0.1:9042.
    [cqlsh 6.8.0 | Cassandra 4.0.0.6816 | CQL spec 3.4.5 | Native protocol v4]
    Use HELP for help.
    token@cqlsh>
    ```

**✅ 7b - Execute CQL** 

To execute CQL Statements with `cqlsh` use the flag `-e`.

```
astra db cqlsh demo -e "describe keyspaces;"
```

**✅ 7b - Execute CQL Files** 

To execute CQL Files with `cqlsh` use the flag `-f`. You could also use the CQL syntax SOURCE.

```
astra db cqlsh demo -f sample.cql
```

### 8. DSBulk Commands

**✅ 8a - Setup** 

[DSBulk](https://github.com/datastax/dsbulk) stands for DataStax Bulk Loader. It is a standalone program to load, unload, and count data in an efficient way with Apache Cassandra™. It is compliant with DataStax Astra DB.

Similar to `cqlsh` the CLI will **download**, **install**, **setup** and **wrap** the dsbulk command for you. All options are available. To give you an idea let's tak a simple example.

- Make sure we have a db `demo` with a keyspace `demo`

```
astra db create demo
```

- Looking at a dataset of cities in the world. [cities.csv](https://raw.githubusercontent.com/awesome-astra/docs/main/docs/assets/cities.csv). We can show here the first lines of the 
file.

```
id,name,state_id,state_code,state_name,country_id,country_code,country_name,latitude,longitude,wikiDataId
52,Ashkāsham,3901,BDS,Badakhshan,1,AF,Afghanistan,36.68333000,71.53333000,Q4805192
68,Fayzabad,3901,BDS,Badakhshan,1,AF,Afghanistan,37.11664000,70.58002000,Q156558
...
```

- Let's create a table to store those values. Connect to CQHSH

```
astra db cqlsh demo -k demo
```

- Create the table 

```sql
CREATE TABLE cities_by_country (
 country_name text,
 name       text,
 id         int,
 state_id   text,
 state_code text,
 state_name text,
 country_id text,
 country_code text,
 latitude double,
 longitude double,
 wikiDataId text,
 PRIMARY KEY ((country_name), name)
);

describe table cities_by_country;

quit
```

**✅ 8b - Load Data** 

```
astra db load demo \
  -url https://raw.githubusercontent.com/awesome-astra/docs/main/docs/assets/cities.csv \
  -k demo \
  -t cities_by_country \
  --schema.allowMissingFields true
```

The first time the line `DSBulk is starting please wait` can take a few seconds to appear. The reason is the CLI is downloading `dsbulk` if it was not downloaded before.

???+ abstract "🖥️ Sample output" 

    ```
    DSBulk is starting please wait ...
    Username and password provided but auth provider not specified, inferring PlainTextAuthProvider
    A cloud secure connect bundle was provided: ignoring all explicit contact points.
    A cloud secure connect bundle was provided and selected operation performs writes: changing default consistency level to LOCAL_QUORUM.
    Operation directory: /Users/cedricklunven/Downloads/logs/LOAD_20220823-182343-074618
    Setting executor.maxPerSecond not set when connecting to DataStax Astra: applying a limit of 9,000 ops/second based on the number of coordinators (3).
    If your Astra database has higher limits, please define executor.maxPerSecond explicitly.
      total | failed | rows/s |  p50ms |  p99ms | p999ms | batches
    148,266 |      0 |  8,361 | 663.86 | 767.56 | 817.89 |   30.91
    Operation LOAD_20220823-182343-074618 completed successfully in 17 seconds.
    Last processed positions can be found in positions.txt
    ```

**✅ 8c - Count** 

Check than the data has been imported with cqlsh SH

```
astra db cqlsh demo -e "select * from demo.cities_by_country LIMIT 20;"
```

??? abstract "🖥️ Sample output" 

    ```
    Cqlsh is starting please wait for connection establishment...

    country_name | name                | country_code | country_id | id   | latitude | longitude | state_code | state_id | state_name          | wikidataid
    --------------+---------------------+--------------+------------+------+----------+-----------+------------+----------+---------------------+------------
      Bangladesh |             Azimpur |           BD |         19 | 8454 |  23.7298 |   90.3854 |         13 |      771 |      Dhaka District |       null
      Bangladesh |           Badarganj |           BD |         19 | 8455 | 25.67419 |  89.05377 |         55 |      759 |    Rangpur District |       null
      Bangladesh |            Bagerhat |           BD |         19 | 8456 |     22.4 |     89.75 |         27 |      811 |     Khulna District |       null
      Bangladesh |           Bandarban |           BD |         19 | 8457 |       22 |  92.33333 |          B |      803 | Chittagong Division |       null
      Bangladesh |          Baniachang |           BD |         19 | 8458 | 24.51863 |  91.35787 |         60 |      767 |     Sylhet District |       null
      Bangladesh |             Barguna |           BD |         19 | 8459 | 22.13333 |  90.13333 |         06 |      818 |    Barisal District |       null
      Bangladesh |             Barisal |           BD |         19 | 8460 |     22.8 |      90.5 |         06 |      818 |    Barisal District |       null
      Bangladesh |                Bera |           BD |         19 | 8462 | 24.07821 |  89.63262 |         54 |      813 |   Rajshahi District |       null
      Bangladesh |       Bhairab Bāzār |           BD |         19 | 8463 |  24.0524 |   90.9764 |         13 |      771 |      Dhaka District |       null
      Bangladesh |           Bherāmāra |           BD |         19 | 8464 | 24.02452 |  88.99234 |         27 |      811 |     Khulna District |       null
      Bangladesh |               Bhola |           BD |         19 | 8465 | 22.36667 |  90.81667 |         06 |      818 |    Barisal District |       null
      Bangladesh |           Bhāndāria |           BD |         19 | 8466 | 22.48898 |  90.06273 |         06 |      818 |    Barisal District |       null
      Bangladesh | Bhātpāra Abhaynagar |           BD |         19 | 8467 | 23.01472 |  89.43936 |         27 |      811 |     Khulna District |       null
      Bangladesh |           Bibir Hat |           BD |         19 | 8468 | 22.68347 |  91.79058 |          B |      803 | Chittagong Division |       null
      Bangladesh |               Bogra |           BD |         19 | 8469 | 24.78333 |     89.35 |         54 |      813 |   Rajshahi District |       null
      Bangladesh |        Brahmanbaria |           BD |         19 | 8470 | 23.98333 |  91.16667 |          B |      803 | Chittagong Division |       null
      Bangladesh |         Burhānuddin |           BD |         19 | 8471 | 22.49518 |  90.72391 |         06 |      818 |    Barisal District |       null
      Bangladesh |            Bājitpur |           BD |         19 | 8472 | 24.21623 |  90.95002 |         13 |      771 |      Dhaka District |       null
      Bangladesh |            Chandpur |           BD |         19 | 8474 |    23.25 |  90.83333 |          B |      803 | Chittagong Division |       null
      Bangladesh |    Chapai Nababganj |           BD |         19 | 8475 | 24.68333 |     88.25 |         54 |      813 |   Rajshahi District |       null
    ```

- Count with ds bulkd

```
astra db count demo -k demo -t cities_by_country
```

???+ abstract "🖥️ Sample output"

    ```
    DSBulk is starting please wait ...
    [INFO ] - RUNNING: /Users/cedricklunven/.astra/dsbulk-1.9.1/bin/dsbulk count -k demo -t cities_by_country -u token -p AstraCS:gdZaqzmFZszaBTOlLgeecuPs:edd25600df1c01506f5388340f138f277cece2c93cb70f4b5fa386490daa5d44 -b /Users/cedricklunven/.astra/scb/scb_071d7059-d55b-4cdb-90c6-41c26da1a029_us-east-1.zip
    Username and password provided but auth provider not specified, inferring PlainTextAuthProvider
    A cloud secure connect bundle was provided: ignoring all explicit contact points.
    Operation directory: /Users/cedricklunven/Downloads/logs/COUNT_20220823-182833-197954
      total | failed | rows/s |  p50ms |  p99ms | p999ms
    134,574 |      0 | 43,307 | 315.71 | 457.18 | 457.18
    ```

**✅ 8d - Unload Data** 

```
astra db unload demo -k demo -t cities_by_country -url /tmp/unload
```

???+ abstract "🖥️ Sample output" 

    ```
    DSBulk is starting please wait ...
    Username and password provided but auth provider not specified, inferring PlainTextAuthProvider
    A cloud secure connect bundle was provided: ignoring all explicit contact points.
    Operation directory: /Users/cedricklunven/Downloads/logs/UNLOAD_20220823-183054-208353
      total | failed | rows/s |  p50ms |    p99ms |   p999ms
    134,574 |      0 | 14,103 | 927.51 | 1,853.88 | 1,853.88
    Operation UNLOAD_20220823-183054-208353 completed successfully in 9 seconds.
    ```

### 9. Download Secure bundle

**✅ 9a - Default values** 

Download the different secure bundles (one per region) with the pattern `scb_${dbid}-${dbregion}.zip` in a current folder.

```
mkdir db-demo
cd db-demo
astra db download-scb demo
ls
```

**✅ 9b - Download in target folder** 

Download the different secure bundles (one per region) with the pattern `scb_${dbid}-${dbregion}.zip` in the folder provided with option `-d` (`--output-director`).

```
astra db download-scb demo -d /tmp
```

**✅ 9c - Download in target folder** 

Provide the target filename with `-f` (`--output-file`). It will work only if you have a SINGLE REGION for your database (or you will have to use the flag `-d`)

```
astra db download-scb demo -f /tmp/demo.zip
```

### 10. Create `.env` file

To code your application against Astra a set of metadata could be handy like the database name, database region, url of the APIs.... 

This command will create a file `.env` with a set of variables that are relevant to be defined as environment variables

```
astra db create-dotenv -f /tmp/.env
```

???+ abstract "🖥️ Sample output" 

    ```
    ASTRA_DB_APPLICATION_TOKEN="AstraCS:QeUmROP..."
    ASTRA_DB_GRAPHQL_URL="https://a6b5cb4c-3267-4414-8bba-6706086a943a-us-east-1.apps.astra.datastax.com/api/graphql/order_management_data"
    ASTRA_DB_GRAPHQL_URL_ADMIN="https://a6b5cb4c-3267-4414-8bba-6706086a943a-us-east-1.apps.astra.datastax.com/api/graphql-admin"
    ASTRA_DB_GRAPHQL_URL_PLAYGROUND="https://a6b5cb4c-3267-4414-8bba-6706086a943a-us-east-1.apps.astra.datastax.com/api/playground"
    ASTRA_DB_GRAPHQL_URL_SCHEMA="https://a6b5cb4c-3267-4414-8bba-6706086a943a-us-east-1.apps.astra.datastax.com/api/graphql-schema"
    ASTRA_DB_ID="a6b5cb4c-3267-4414-8bba-6706086a943a"
    ASTRA_DB_KEYSPACE="order_management_data"
    ASTRA_DB_REGION="us-east-1"
    ASTRA_DB_REST_URL="https://a6b5cb4c-3267-4414-8bba-6706086a943a-us-east-1.apps.astra.datastax.com/api/rest"
    ASTRA_DB_REST_URL_SWAGGER="https://a6b5cb4c-3267-4414-8bba-6706086a943a-us-east-1.apps.astra.datastax.com/api/rest/swagger-ui/"
    ASTRA_DB_SECURE_BUNDLE_PATH="/Users/cedricklunven/.astra/scb/scb_a6b5cb4c-3267-4414-8bba-6706086a943a_us-east-1.zip"
    ASTRA_DB_SECURE_BUNDLE_URL="https://datastax-cluster-config-prod.s3.us-east-2.amazonaws.com/a6b5cb4c-3267-4414-8bba-6706086....X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA2AI....."
    ASTRA_ORG_ID="f9460f14-9879-...."
    ASTRA_ORG_NAME="ced..."
    ASTRA_ORG_TOKEN="AstraCS:QeUmROPLeNbd..."
    ```

11. List Regions

For database creation or regions management, the region name is expected. Depending on the cloud provider provider needed or even the Astra service the region name are not exactly the same.

With Astra CLI, one can list every available regions per service.

**List Serverless regions**

```
astra db list-regions-serverless -c aws
```

???+ abstract "🖥️ Sample output" 

    ```
    +----------------+---------------------+-------------------------------+
    | Cloud Provider | Region              | Full Name                     |
    +----------------+---------------------+-------------------------------+
    | aws            | ap-east-1           | Asia Pacific (Hong Kong)      |
    | aws            | ap-south-1          | Asia Pacific (Mumbai)         |
    | aws            | ap-southeast-1      | Asia Pacific (Singapore)      |
    | aws            | ap-southeast-2      | Asia Pacific (Sydney)         |
    | aws            | eu-central-1        | Europe (Frankfurt)            |
    | aws            | eu-west-1           | Europe (Ireland)              |
    | aws            | sa-east-1           | South America (Sao Paulo)     |
    | aws            | us-east-1           | US East (N. Virginia)         |
    | aws            | us-east-2           | US East (Ohio)                |
    | aws            | us-west-2           | US West (Oregon)              |
    +----------------+---------------------+-------------------------------+
    ```

- `-c` or `--cloud` allows to selectr a cloud provider, the 3 accepted values will be `aws`, `gcp` and `azure`
- `-f` or `--filter` allows to look for either a location of region (eg. `-f France`, -f `us`
- `-o` or `--output` to change output from table (human) to csv or json
- `-v` for verbose mode
- `-t` to provide token of organization if not default selected

**List Serverless regions**

```
astra db list-regions-classic
```

## Astra STREAMING

### 1. List tenants

**✅ 1a - list**

To get the list of tenants in your oganization, use the command `list` in the group `streaming`.

```
astra streaming list
```

???+ abstract "🖥️ Sample output" 

    ```
    +---------------------+-----------+----------------+----------------+
    | name                | cloud     | region         | Status         |
    +---------------------+-----------+----------------+----------------+
    | cedrick-20220910    | aws       | useast2        | active         |
    | trollsquad-2022     | aws       | useast2        | active         |
    +---------------------+-----------+----------------+----------------+
    ```

**✅ 1b - Change output as `csv` amd `json`**

```
astra streaming list -o csv
```

??? abstract "🖥️ Sample output" 

    ```csv
    name,cloud,region,Status
    cedrick-20220910,aws,useast2,active
    trollsquad-2022,aws,useast2,active
    ```

```
astra streaming list -o json
```

??? abstract "🖥️ Sample output" 

    ```json
    {
    "code" : 0,
    "message" : "astra streaming list -o json",
    "data" : [ {
        "cloud" : "aws",
        "Status" : "active",
        "name" : "cedrick-20220910",
        "region" : "useast2"
    }, {
        "cloud" : "aws",
        "Status" : "active",
        "name" : "trollsquad-2022",
        "region" : "useast2"
    } ]
    }
    ```

### 2. Create tenant

**✅ 2a - Check tenant existence with `exist`** 

The tenant name needs to be unique for the cluster (Cloud provider / region). It may be useful to check if the name is already in use by somebody else.

```
astra streaming exist new_tenant_from_cli
```

??? abstract "🖥️ Sample output" 

    ```bash
    [ INFO ] - Tenant 'new_tenant_from_cli' does not exist.
    ```

**✅ 2b - Create tenant** 

To create a tenant with default cloud (`aws`), default region (`useast2`), plan (`free`) and namespace (`default`):

```
astra streaming create new_tenant_from_cli
```

To view all supported options please use

```
astra help streaming create
```

### 3. Get tenant details

**✅ 3a - To get i nformation or details on an entity use the command `get`.**

```
astra streaming get trollsquad-2022
```

The pulsar token is not displayed in this view as it is too loong, but there are dedicated commands to display it.

???+ abstract "🖥️ Sample output" 

    ```
    +------------------+-------------------------------------------------------------+
    | Attribute        | Value                                                       |
    +------------------+-------------------------------------------------------------+
    | Name             | trollsquad-2022                                             |
    | Status           | active                                                      |
    | Cloud Provider   | aws                                                         |
    | Cloud region     | useast2                                                     |
    | Cluster Name     | pulsar-aws-useast2                                          |
    | Pulsar Version   | 2.10                                                        |
    | Jvm Version      | JDK11                                                       |
    | Plan             | payg                                                        |
    | WebServiceUrl    | https://pulsar-aws-useast2.api.streaming.datastax.com       |
    | BrokerServiceUrl | pulsar+ssl://pulsar-aws-useast2.streaming.datastax.com:6651 |
    | WebSocketUrl     | wss://pulsar-aws-useast2.streaming.datastax.com:8001/ws/v2  |
    +------------------+-------------------------------------------------------------+
    ```

**✅ 3b. To get a special property you can add the option `--key`. Multiple keys are available: `status`, `cloud`, `pulsar_token`. Notice that the output is raw. This command is expected to be used in scripts**

```
astra streaming get trollsquad-2022 --key cloud
```

???+ abstract "🖥️ Sample output" 

    ```
    aws
    ```

**✅ 3c. To get tenant pulsar-token please use ` pulsar-token` command**

```
astra streaming pulsar-token trollsquad-2022
```

???+ abstract "🖥️ Sample output" 

    ```
    eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NjI5NzcyNzksImlzcyI6ImRhdGFzdGF4Iiwic3ViIjoiY2xpZW50O2Y5NDYwZjE0LTk4NzktNGViZS04M2YyLTQ4ZDNmM2RjZTEzYztkSEp2Ykd4emNYVmhaQzB5TURJeTsxOTZlYjg0YTMzIiwidG9rZW5pZCI6IjE5NmViODRhMzMifQ.rjJYDG_nJu0YpgATfjeKeUUAqwJGyVlvzpA5iP-d5-bReQf1FPaDlGxo40ADHHn2kx2NOdgMsm-Ys4K...
    ```

**✅ 3d. To get tenant status in a human readble for use `status` command**

```
astra streaming status trollsquad-2022
```

???+ abstract "🖥️ Sample output" 

    ```
    [ INFO ] - Tenant 'trollsquad-2022' has status 'active'
    ```

### 4. Delete Tenant

**✅ 4a. To delete a tenant simply use the command `delete`**

```
astra streaming delete trollsquad
```

### 5. Pulsar-Shell

[Pulsar-Shell](https://pulsar.apache.org/ja/docs/next/administration-pulsar-shell/) is a standalone shell to work with Apache Pulsar. It is compliant with Astra but requires a few extra steps of configuration. The purpose of the CLI is to integrate with `pulsar-shell` and do the integration and setup for you.

Astra CLI will **download**, **install**, **setup** and **wrap** `pulsar-shell` for you to interact with Astra.

**✅ 5a - Interactive mode** 

If no options are provided,  you enter `pulsar-shell` interactive mode

```
astra streaming pulsar-shell trollsquad-2022
```

??? abstract "🖥️ Sample output" 

    ```
    /Users/cedricklunven/.astra/lunastreaming-shell-2.10.1.1/conf/client-aws-useast2-trollsquad-2022.conf
    Pulsar-shell is starting please wait for connection establishment...
    Using directory: /Users/cedricklunven/.pulsar-shell
    Welcome to Pulsar shell!
        Service URL: pulsar+ssl://pulsar-aws-useast2.streaming.datastax.com:6651
        Admin URL: https://pulsar-aws-useast2.api.streaming.datastax.com

    Type help to get started or try the autocompletion (TAB button).
    Type exit or quit to end the shell session.

    default(pulsar-aws-useast2.streaming.datastax.com)>
    ```

You can quit with exit.

**✅ 5b - Execute Pulsar Shell command** 

To execute command with `pushar-shell` use the flag `-e`.

```
astra streaming pulsar-shell trollsquad-2022 -e "admin namespaces list trollsquad-2022"
```

??? abstract "🖥️ Sample output" 

    ```
    /Users/cedricklunven/.astra/lunastreaming-shell-2.10.1.1/conf/client-aws-useast2-trollsquad-2022.conf
    Pulsar-shell is starting please wait for connection establishment...
    Using directory: /Users/cedricklunven/.pulsar-shell
    [1/1] Executing admin namespaces list trollsquad-2022
    [1/1] ✔ admin namespaces list trollsquad-2022
    ```

**✅ 5c - Execute Pulsar Shell files** 

To execute CQL Files with  `pushar-shell` use the flag `-e`.

```
astra streaming pulsar-shell trollsquad-2022 -f create_topics.txt
```

### 6. Pulsar-client and Admin

Pulsar client and admin are provided within pulsar-shell. This section simply provides some examples to write and read in a topic with a client.

**✅ 6a - Create a topic `demo`**.


- First start the pulsar-shell on 2 different terminals

```
astra streaming pulsar-shell trollsquad-2022
```

- Then on first terminal create a topic `demo` in the namespace `default`

```
admin topics create persistent://trollsquad-2022/default/demo
```

- You can now list the different topics in the namespace `default`

```
admin topics list trollsquad-2022/default
```

??? abstract "🖥️ Sample output" 

    ```
    persistent://trollsquad-2022/default/demo
    ```

- Start a consumer on this topic

```
client consume persistent://trollsquad-2022/default/demo -s astra_cli_tuto -n 0
```

??? abstract "🖥️ Sample output" 

    ```
    .. init ...
    83 - R:pulsar-aws-useast2.streaming.datastax.com/3.16.119.226:6651]] Connected to server
    2022-09-12T12:28:34,869+0200 [pulsar-client-io-1-1] INFO  org.apache.pulsar.client.impl.ClientCnx - [id: 0xc5ce3ec4, L:/192.168.82.1:53683 - R:pulsar-aws-useast2.streaming.datastax.com/3.16.119.226:6651] Connected through proxy to target broker at 192.168.7.141:6650
    2022-09-12T12:28:35,460+0200 [pulsar-client-io-1-1] INFO  org.apache.pulsar.client.impl.ConsumerImpl - [persistent://trollsquad-2022/default/demo][astra_cli_tuto] Subscribing to topic on cnx [id: 0xc5ce3ec4, L:/192.168.82.1:53683 - R:pulsar-aws-useast2.streaming.datastax.com/3.16.119.226:6651], consumerId 0
    2022-09-12T12:28:35,645+0200 [pulsar-client-io-1-1] INFO  org.apache.pulsar.client.impl.ConsumerImpl - [persistent://trollsquad-2022/default/demo][astra_cli_tuto] Subscribed to topic on pulsar-aws-useast2.streaming.datastax.com/3.16.119.226:6651 -- consumer: 0
    ```

- On the second terminal you can now start a producer

```
client produce persistent://trollsquad-2022/default/demo -m "hello,world" -n 20 
```

??? abstract "🖥️ Sample output" 

    ```
    2022-09-12T12:36:28,684+0200 [pulsar-client-io-14-1] INFO  org.apache.pulsar.client.impl.ClientCnx - [id: 0x682890b5, L:/192.168.1.106:53796 ! R:pulsar-aws-useast2.streaming.datastax.com/3.138.177.230:6651] Disconnected
    2022-09-12T12:36:30,756+0200 [main] INFO  org.apache.pulsar.client.cli.PulsarClientTool - 40 messages successfully produced


    And on the client side
    key:[null], properties:[], content:world
    ----- got message -----
    key:[null], properties:[], content:hello
    ```

### 7. List Regions

```
astra streaming list-regions
```

- `-c` or `--cloud` allows to selectr a cloud provider, the 3 accepted values will be `aws`, `gcp` and `azure`
- `-f` or `--filter` allows to look for either a location of region (eg. `-f France`, -f `us`
- `-o` or `--output` to change output from table (human) to csv or json
- `-v` for verbose mode
- `-t` to provide token of organization if not default selected


### 8. Create `.env` file

```
astra streaming create-dot-env <tenant> [-d <destination_folder>]
```

## User and Roles

### 1. List users

```
astra user list
```

??? abstract "🖥️ Sample output" 

    ```
    +--------------------------------------+-----------------------------+---------------------+
    | User Id                              | User Email                  | Status              |
    +--------------------------------------+-----------------------------+---------------------+
    | b665658a-ae6a-4f30-a740-2342a7fb469c | cedrick.lunven@datastax.com | active              |
    +--------------------------------------+-----------------------------+---------------------+
    ```

### 2. Invite User

```
astra user invite cedrick.lunven@gmail.com
```

Check the list of users and notice the new user invited.

```
astra user list
```

??? abstract "🖥️ Sample output" 

    ```
    +--------------------------------------+-----------------------------+---------------------+
    | User Id                              | User Email                  | Status              |
    +--------------------------------------+-----------------------------+---------------------+
    | 825bd3d3-82ae-404b-9aad-bbb4c53da315 | cedrick.lunven@gmail.com    | invited             |
    | b665658a-ae6a-4f30-a740-2342a7fb469c | cedrick.lunven@datastax.com | active              |
    +--------------------------------------+-----------------------------+---------------------+
    ```

### 3. Revoke User

```
astra user delete cedrick.lunven@gmail.com
```

??? abstract "🖥️ Sample output" 

    ```
    +--------------------------------------+-----------------------------+---------------------+
    | User Id                              | User Email                  | Status              |
    +--------------------------------------+-----------------------------+---------------------+
    | b665658a-ae6a-4f30-a740-2342a7fb469c | cedrick.lunven@datastax.com | active              |
    +--------------------------------------+-----------------------------+---------------------+
    ```

### 4. List roles

```
astra role list
```

### 6. Get role infos

```
astra role get "Database Administrator"
```

## Configuration

If you work with multiple organizations it could be useful to switch from one configuration to another, one token to another. The CLI provides a configuration management solution to handle this use case.

**✅ 1a - List available configuration**

```
astra config list
```

**✅ 1b - Create a new section**

```
astra config create dev --token <token_of_org_2>
```

**✅ 1c - Use your section config anywhere**

You can use any organization anytime with `--config <onfig_name>`.

```
astra user list --config dev
```

**✅ 1d - Select a section as defaul**

- Change the current org

```
astra config use dev
```

- See your new list 

 ```
 astra config list
 ```

**✅ 1e - Delete a section**

You can delete any organization. If you delete the selected organization you will have to pick a new one.

- Delete you config
```
astra config delete dev
```

- See the new list

```
astra config list
```
