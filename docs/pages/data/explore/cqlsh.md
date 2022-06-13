<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="https://docs.datastax.com/en/astra/docs/connecting-to-databases-using-standalone-cqlsh.html"><b>📖  Astra Docs</b> - Reference documentation</a>
<li><a href="https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html"><b>📖  Cql Tool Docs</b> - Reference Documentation</a>
</ol>
</details>

## A - Overview

[CqlSH](https://cassandra.apache.org/doc/latest/cassandra/tools/cqlsh.html) is a command-line interface for interacting with Cassandra using CQL (the Cassandra Query Language). It is shipped with every Cassandra package, and can be found in the bin/ directory alongside the cassandra executable. cqlsh is implemented with the Python native protocol driver, and connects to the single specified node.

You can setup the software by providing options in the command line and/OR provide the settings in a file called `cqlshrc` located in `~/.cassandra`

```
> cqlsh --help
Usage: cqlsh [options] [host [port]]

CQL Shell

Options:
  --version             show program's version number and exit
  -h, --help            show this help message and exit
  -C, --color           Always use color output
  --no-color            Never use color output
  --browser=BROWSER     The browser to use to display CQL help, where BROWSER
                        can be:
                        - one of the supported browsers in
                        https://docs.python.org/2/library/webbrowser.html.
                        - browser path followed by %s, example: /usr/bin
                        /google-chrome-stable %s
  --ssl                 Use SSL
  -u USERNAME, --username=USERNAME
                        Authenticate as user.
  -p PASSWORD, --password=PASSWORD
                        Authenticate using password.
  -k KEYSPACE, --keyspace=KEYSPACE
                        Authenticate to the given keyspace.
  -b SECURE_CONNECT_BUNDLE, --secure-connect-bundle=SECURE_CONNECT_BUNDLE
                        Connect using secure connect bundle. If this option is
                        specified host, port settings are ignored
  -f FILE, --file=FILE  Execute commands from FILE, then exit
  --debug               Show additional debugging information
  --coverage            Collect coverage data
  --encoding=ENCODING   Specify a non-default encoding for output. (Default:
                        utf-8)
  --cqlshrc=CQLSHRC     Specify an alternative cqlshrc file location.
  --cqlversion=CQLVERSION
                        Specify a particular CQL version, by default the
                        highest version supported by the server will be used.
                        Examples: "3.0.3", "3.1.0"
  --protocol-version=PROTOCOL_VERSION
                        Specify a specific protocol version; otherwise the
                        client will default and downgrade as necessary.
                        Mutually exclusive with --dse-protocol-version.
  -e EXECUTE, --execute=EXECUTE
                        Execute the statement and quit.
  --connect-timeout=CONNECT_TIMEOUT
                        Specify the connection timeout in seconds (default: 5
                        seconds).
  --request-timeout=REQUEST_TIMEOUT
                        Specify the default request timeout in seconds
                        (default: 10 seconds).
  --consistency-level=CONSISTENCY_LEVEL
                        Specify the initial consistency level.
  --serial-consistency-level=SERIAL_CONSISTENCY_LEVEL
                        Specify the initial serial consistency level.
  -t, --tty             Force tty mode (command prompt).
  --no-file-io          Disable cqlsh commands that perform file I/O.
  --disable-history     Disable saving of history

Connects to 127.0.0.1:9042 by default. These defaults can be changed by
setting $CQLSH_HOST and/or $CQLSH_PORT. When a host (and optional port number)
are given on the command line, they take precedence over any defaults.
```

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)
- You should [Have an Astra Token](/docs/pages/astra/create-token/)
- You should download the [Cqlsh Version for Astra DB](https://downloads.datastax.com/#cqlsh)
- You should NOT use a WINDOWS machine, as of today `cqlsh` is not supported on Windows

## C - Installation

**✅ Step 1: Download and extract the archive**

- To download the archive you can go on the [download page](https://downloads.datastax.com/#cqlsh), check the box and download the file:

<img src="../../../../img/cqlsh/cqlsh-download.png" />

- You can also use the command line:

```
wget https://downloads.datastax.com/enterprise/cqlsh-astra.tar.gz \
          && tar xvzf cqlsh-astra.tar.gz \
          && rm -f cqlsh-astra.tar.gz
```

- The archive should look like:

<img src="../../../../img/cqlsh/cqlsh-archive.png" />

**✅ Step 2: Start `cqlsh` providing parameters in the command line:**

- From the directory where you extracted the CQLSH tarball, run the `cqlsh` script from the command line:

```bash
$ cd /cqlsh-astra/bin

$ ./cqlsh -u ${CLIENT_ID} -p ${CLIENT_SECRET} -b ${PATH_TO_SECURE_BUNBLE.zip}
```

- `-u` (username) - Client ID as provided in the token generation page
- `-p` (password) - Client secret as provided in the token generation page
- `-b` (bundle) - location of the secure connect bundle that you downloaded for your database.

**✅ Step 3: Start `Cqlsh` providing parameters in `cqlshrc`**

Configure the cqlshrc file If you do not want to pass the secure connect bundle on the command line every time, set up the location in your `cqlshrc` file in `~/.cassandra`

```
[authentication]
username = ${CLIENT_ID}
password = ${CLIENT_SECRET}

[connection]
secure_connect_bundle = ${PATH_TO_SECURE_BUNBLE.zip}
```

## D - Tips and tricks

- If is a good idea to add `cqlsh` in your path to be able to use from everywhere

- If you want to work with multiple DB use some alias with the parameters

```
alias cqlsh_db1='cqlsh -u user -p password -b secure-connect-db1.zip'
alias cqlsh_db2='cqlsh --cqlshrc_db2'
```
