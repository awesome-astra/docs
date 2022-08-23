!!! warning "Astra Cli is not released yet. It is in active developement "

Astra CLI provides a command line interface in a terminal to operate Datastax Astra. The goal is to offer access to any feature without accessing the user interface.

## Getting Started

### 1. Installation

**📘 1a Prequisites**

On your machine you will need the following components

- A bash shell ([Bourne Again SHell](https://www.gnu.org/software/bash/))
- The folowing commands `untar`, `unzip`, `curl`
- A Java JRE or JDK version 8+ installed

You will also need an Astra token. As such, make sure you completed those 2 steps before

- Create an [Astra account](http://astra.datastax.com/)
- Generate an [Astra Token](/docs/pages/astra/create-token/)

**✅ 1b Installation**

To install or reinstall the CLI use the following command. Previous installations will be cleaned but configuration will NOT be lost. The cli is installed in `~/.astra/cli` folder whereas your configuration is saved in `~/.astrarc` file. 

```
curl -Ls "https://dtsx.io/get-astra-cli" | bash
```

You can notice that the installation script also check the pre-requisites. It will download expected archive and update your bash profile to have `astra` in your path.

???+ abstract "🖥️ Installation script output"

    ```
       █████╗ ███████╗████████╗██████╗  █████╗     ███████╗██╗  ██╗███████╗██╗     ██╗
      ██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗    ██╔════╝██║  ██║██╔════╝██║     ██║  
      ███████║███████╗   ██║   ██████╔╝███████║    ███████╗███████║█████╗  ██║     ██║ 
      ██╔══██║╚════██║   ██║   ██╔══██╗██╔══██║    ╚════██║██╔══██║██╔══╝  ██║     ██║
      ██║  ██║███████║   ██║   ██║  ██║██║  ██║    ███████║██║  ██║███████╗███████╗███████╗
      ╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝    ╚══════╝╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝
    
    Installing Astra Cli 0.1.alpha3, please wait...      

    Checking prerequisites:
    [OK] - Ready to install.
    [OK] - unzip command is available
    [OK] - zip command is available
    [OK] - curl command is available

    Preparing directories:
    [OK] - Created /Users/cedricklunven/.astra/tmp
    [OK] - Created /Users/cedricklunven/.astra/cli
    [OK] - Created /Users/cedricklunven/.astra/scb

    Downloading archive:
    ######################################################################## 100.0%
    [OK] - File downloaded
    [OK] - Integrity of the archive checked

    Extracting and installation:
    [OK] - Extraction is successful
    [OK] - File moved to /Users/cedricklunven/.astra/cli
    [OK] - Installation cleaned up
    [OK] - Installation Successful

    Open A NEW TERMINAL and run: astra setup

    You can close this window.
    ```

### 2. Setup

!!! info "After installing, make sure to open a new terminal to have `astra` in the `PATH`."

**✅ 2a - Run Setup**

Before issuing commands to init to initialize the configuration file `~/.astrarc`. To to so run the following command. You will be asked to provide your token (AstraCS:...). It will be saved and reuse for your commands.

```
astra setup
```

???+ abstract "🖥️ `astra setup` command output"

    ```
    +-------------------------------+
    +-     Astra CLI SETUP         -+
    +-------------------------------+

    Welcome to Astra Cli. We will guide you to start.

    [Astra Setup]
    To use the cli you need to:
    • Create an Astra account on : https://astra.datastax.com
    • Create an Authentication token following: https://dtsx.io/create-astra-token

    [Cli Setup]
    You will be asked to enter your token, it will be saved locally in ~/.astrarc

    • Enter your token (starting with AstraCS) : 
     AstraCS:lorem_ipsum
    ```

- Copy paste the value of your token and press enter.

???+ abstract "🖥️ `astra setup` command output"

    ```
    [What's NEXT ?]
    You are all set.(configuration is stored in ~/.astrarc) You can now:
      • Use any command, 'astra help' will get you the list
      • Try with 'astra db list'
      • Enter interactive mode using 'astra'

    Happy Coding !
    ```

**✅ 2b - Setup validation**

You are all set. The configuration (mainly your token) is stored in file `~/.astrarc`.

- Display current version of the cli, validating setup is complete.

```
astra --version
```

???+ abstract "🖥️ Sample output" 

    `0.1.alpha3`

You created a default configuration pointing to your organization. If you want to work with multiple organizations look at `Config Management` chapter below.

- After setup you have 1 configuration automaticall set as default. You can have more than one configuration is you work with multiple organizations for instance. To know more about multi-organizations configuration check chapter `5.1`.

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

The solution provides extensive documentation for any command. It also provides som bash autocompletion, use the `TAB` key twice to get a list of propositions.

**✅ 3a - Autocompletion**

```
astra <TAB> <TAB>
```

???+ abstract "🖥️ Sample output" 

    ```
    --no-color  config      db          help        role        setup       shell       user  
    ```

**✅ 3b - Documentation**

Groups of command will get you the different command avalable.

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

- Display help for command group `astra db`

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

For unitary commands all options details are provided. 

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

## Databases

### 1. List Databases

**✅ 1a - list**

```
astra db list
```

??? abstract "🖥️ Sample output" 

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

```
astra help db list
```

??? abstract "🖥️ Sample output" 

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

    ```
    Name,id,Default Region,Status
    mtg,dde308f5-a8b0-474d-afd6-81e5689e3e25,eu-central-1,ACTIVE
    workshops,3ed83de7-d97f-4fb6-bf9f-82e9f7eafa23,eu-west-1,ACTIVE
    sdk_tests,06a9675a-ca62-4cd0-9b94-aefaf395922b,us-east-1,ACTIVE
    test,7677a789-bd57-455d-ab2c-a3bdfa35ba68,eu-central-1,ACTIVE
    demo,071d7059-d55b-4cdb-90c6-41c26da1a029,us-east-1,ACTIVE
    ac201,48c7178c-58cb-4657-b3d2-8a9e3cc89461,us-east-1,ACTIVE
    ```

### 2. Create Database

**✅ 2a - Create Database** 

If not provided the region will be the default free region and the keyspace will be the database name but you can change then with `-r` and `-k` respectivitely.

```
astra db create demo
```

**✅ 2b - If not Exists** 

Database name does not ensure unicity (database id does) as such if you issue the command multiple times you will end up with multiple instances. To change this behaviour you can use `--if-not-exist`

```
astra db create demo -k demo --if-not-exist
```

**✅ 2c - Get help** 

Better doc the cli itself.

```
astra help db create
```

### 3. Get DB infos

```
astra db get demo
```

??? abstract "🖥️ Sample output" 

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
    | Keyspaces              | [0] ks2                                 |
    |                        | [1] demo                                |
    |                        |                                         |
    | Regions                | [0] us-east-1                           |
    |                        |                                         |
    +------------------------+-----------------------------------------+
    ```

Noticed the Status:

```
astra db get demo | grep Status
```

### 4. Create a keyspace

To add a keyspace `ks` to a database `demo` use the following. The database nust exists. The option `--if-not-exist` is also available

```
astra db create-keyspace demo -k ks1
```

If the database is not found you will get a warning message and dedicated code returned.

```
astra help db create-keyspace
```

### 5. Cqlsh

Astra Cli will install, setup and wrap `cqlsh` for you to interact with Astra. Provide the database you want to work with and get the full power of cqlsh.

**✅ 5a - Interactive mode** 

If no option provide you enter interactive mode

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


**✅ 5b - Execute CQL** 

```
astra db cqlsh demo -e "describe keyspaces;"
```

**✅ 5b - Execute CQL Files** 

We create a sample file for you here

```
astra db cqlsh demo -f "/tmp"
```

### 6. DSBulk

Assuming we have a csv looking like:

```
id,name,state_id,state_code,state_name,country_id,country_code,country_name,latitude,longitude,wikiDataId
52,Ashkāsham,3901,BDS,Badakhshan,1,AF,Afghanistan,36.68333000,71.53333000,Q4805192
68,Fayzabad,3901,BDS,Badakhshan,1,AF,Afghanistan,37.11664000,70.58002000,Q156558
...
```


## 4. User and Roles

### 4.1 List users

### 4.2 Invite User

### 4.3 Revoke User

### 4.4 List roles

## 5. Advanced

### 5.1 Config Management

If you work with multiple organizations it could be useful to switch from configuration to another, one token to another. The Cli provides a configuration management solution to handle this use case.

**✅ 5.1.a - List available configuration**

```
astra config list
```

**✅ 5.1.b - Create a new section `dev`**

```
astra config create dev --token <token_of_org_2>
```

**✅ 5.1.c - Select a section `dev` to work with**

- Change the current org

```
astra config default dev
```

- See your new list 

 ```
 astra config list
 ```

**✅ 5.1.d - Delete a section `dev`**

You can delete any organization. If you delete the selected organization you will have to pick a new one.

- Delete you config
```
astra config delete dev
```

- See the new list

```
astra config list
```








