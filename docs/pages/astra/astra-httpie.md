We've created a tool to let you make Stargate calls from the command line.

The quick start is in [this repository](https://github.com/DataStax-Academy/httpie-katapod).

If you want to use it on your own system, follow these steps:

## Install the python library and httpie

```
pip3 install httpie-astra
```

## Setup your Astra account

To use the Astra CLI you need to create a [DataStax Astra](https://astra.datastax.com) account. You also need to [create a token](../../../pages/astra/create-token/) with the `Organization Administration` role.

## Install Astra CLI
To get everything working, you need to have the [Astra CLi](astra-cli.md) installed and setup.

## Initialize your setup
We need to initialize the configuration file at `~/.astrarc`. To to so run the following command. You will be asked to provide your token (AstraCS:...). It will be saved and reused for your commands in the future.

```
astra setup
```

## Create your environment files
In order to use httpie, you need to initialize a configuration file.

As an example, for the example in the Katapod example, you could use "stargate" as the database and "workshop" for the keyspace - but you can use any combination you like for general exploration.

```
astra db create <database>
astra db create-dotenv -k <keyspace> <database>
echo "[stargate]" >> ~/.astrarc
cat .env >> ~/.astrarc
```

From here, you can call any Stargate API endpoint.  Check the [example repository](https://github.com/DataStax-Academy/httpie-katapod) to see how this works.

## Configuration file.

You can create a configuration file in ~/.config/httpie/config.json.  Adding this configuration file allows you to use a shorter command to call the endpoints.

*~/.config/httpie/config.json*
```
{
    "default_options": [
      "--auth-type=astra",
      "--auth=stargate:"
    ]
}
```

This means that instead of using this command:

```
http --auth-type astra -a stargate: :/rest/v1/keyspaces
```

You can use this command:

```
http :/rest/v1/keyspaces
```

## Example REST calls

*Create a table*
```
http POST :/rest/v2/schemas/keyspaces/workshop/tables json:='{
  "name": "cavemen",
  "ifNotExists": false,
  "columnDefinitions": [
    {
      "name": "firstname",
      "typeDefinition": "text",
      "static": false
    },
    {
      "name": "lastname",
      "typeDefinition": "text",
      "static": false
    },
        {
	      "name": "occupation",
	      "typeDefinition": "text"
	    }
  ],
  "primaryKey": {
    "partitionKey": [
      "lastname"
    ],
    "clusteringKey": [
      "firstname"
    ]
  }
}'
```

*List tables in your keyspace*
```
http :/rest/v2/schemas/keyspaces/workshop/tables
```

*Add a row*
```
http POST :/rest/v2/keyspaces/workshop/cavemen json:='
{
            "firstname" : "Fred",
            "lastname": "Flintstone"
}'
```

*Update a row*
```
http PUT :/rest/v2/keyspaces/workshop/cavemen/Flintstone/Fred json:='
{ "occupation": "Quarry Screamer"}'
```

*Delete a row*
```
http DELETE :/rest/v2/keyspaces/workshop/cavemen/Flintstone/Fred
```

For more examples, check out the [katapod](https://github.com/DataStax-Academy/httpie-katapod) exercises.
