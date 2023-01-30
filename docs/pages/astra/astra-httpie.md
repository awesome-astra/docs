We've created a tool to let you make Stargate calls from the command line.

The quick start is in [this repository](https://github.com/DataStax-Academy/httpie-katapod).

If you want to use it on your own system, follow these steps:

## Install the python library and httpie

```
pip install httpie-astra
```

## Setup your Astra account

To use the Astra CLI you need to create a [DataStax Astra](https://astra.datastax.com) account. You also need to [create a token](../../../pages/astra/create-token/) with the `Organization Administration` role.

## Install Astra CLI
To install (or reinstall) the CLI use the following command in a terminal:

```
curl -Ls "https://dtsx.io/get-astra-cli" | bash
```

## Initialize your setup
Before issuing commands to initialize the configuration file `~/.astrarc`. To to so run the following command. You will be asked to provide your token (AstraCS:...). It will be saved and reused for your commands in the future.

```
astra setup
```

## Create your environment files
In order to use httpie, you need to initialize a configuration file.

```
astra db create
astra db create-dotenv -k keyspace database
echo "[default]" > ~/.astrarc
cat .env >> ~/.astrarc
```

From here, you can call any Stargate API endpoint.  Check the [example repository](https://github.com/DataStax-Academy/httpie-katapod) to see how this works.

