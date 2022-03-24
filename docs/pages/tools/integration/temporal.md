[🏠 Back to HOME](https://awesome-astra.github.io/docs/) | *Last Update {{ git_revision_date }}* 

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-logo-dark.svg?raw=true" height="100px" />

## Overview

Temporal.io is an open source microservice orchestration platform that assists in tracking workflows in your application development. It provides the user with a plug-and-play persistence layer that lets the user choose and configure their Temporal Server with their preferred backend. Currently, Temporal is compatible with Postgres, MySQL, CockroachDB and Apache CassandraⓇ as backend dependencies. 

- ℹ️ [Introduction to Temporal](https://docs.temporal.io/docs/temporal-explained/introduction)
- 📥 [Temporal Quick Install](https://docs.temporal.io/docs/clusters/quick-install/)

## - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)
- You should [Create and Astra Database](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-AstraDB-Instance)
- You should [Have an Astra Token](https://github.com/datastaxdevs/awesome-astra/wiki/Create-an-Astra-Token)
- You should [Download your Secure Bundle](https://github.com/datastaxdevs/awesome-astra/wiki/Download-the-secure-connect-bundle)

!!! note "Note"
     This runbook was written using Mac OS Monterey but it will also work with Windows. Any Windows-specific instructions will be noted as such.  

## Installation and Setup

### ✅ Step 1: Setup Astra

1. In your Astra database, create two new keyspaces called **"temporal"** and **"temporal_visibility".** You will be using both of these in the next steps.
2. Make sure to create an Astra token with **Admin Role**
3. Make sure you have downloaded your Secure Connect Bundle for your database. 
4. We recommend you create a central directory somewhere in your electronic filing system to keep track of all the files needed for this setup. For this example, we’re calling this main directory `/my-temporal`, the Secure Connect Bundle is `secure-connect-temporal`, and the CSV for token credentials is saved under `adminuser`

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-01-sample-directory.png?raw=true"  />


### ✅ Step 2: Temporal Pre-setup

#### For this step, you will set up a Temporal instance using Docker. 
??? info "Step 1: Set up the Docker Image"
    * Follow the [Quick Install](https://docs.temporal.io/docs/server/quick-install) instructions to setup Docker
    * Clone the [temporalio/docker-compose](https://github.com/temporalio/docker-compose) repository in your `/my-temporal` directory
    * Move the following files from your Secure Connect Bundle into the `dynamicconfig` folder in the `docker-compose` folder:
        * `ca.crt`
        * `cert`
        * `key`
    <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-02-dynamic-config.png?raw=true"  />
    <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-03-certs-dynamic-config.png?raw=true"  />
!!! info "Step 2: Using your local command line or terminal, change the directory to reflect the root of the project."
??? info "Step 3: Run Docker Compose"
     Run the docker-compose up command. Your output should look something like the following: 
    ```
    user@user % cd my-temporal 
    user@user my-temporal % git clone https://github.com/temporalio/docker-compose.git
    Cloning into 'docker-compose'...
    remote: Enumerating objects: 549, done.
    remote: Counting objects: 100% (473/473), done.
    remote: Compressing objects: 100% (201/201), done.
    remote: Total 549 (delta 431), reused 277 (delta 272), pack-reused 76
    Receiving objects: 100% (549/549), 83.01 KiB | 1.06 MiB/s, done.
    Resolving deltas: 100% (446/446), done.
    user@user my-temporal % cd  docker-compose
    user@user docker-compose % docker-compose up
    ```

    Once complete, you should view all the created containers in your Docker Destop. For this setup, we will be focusing on the container named `temporal`.

    <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-04-temporal-docker.png?raw=true" height="100px"  />

### ✅ Step 3: Temporal Schema Migration
#### Schema Migration
For this step, you will set up the keyspaces you created earlier in the Astra prerequisites (**temporal** and **temporal_visibility**). You will be using `temporal-cassandra-tool` which is part of the Temporal repo. 

!!! info "Step 1. Go into your Docker Desktop"
??? info "Step 2. SSH into the container"
    Click on `temporal` container and press the **CLI** button to access the content with SSH.
    <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-04-temporal-docker.png?raw=true"  />
??? info "Step 3. Initalize Keyspaces"
    * Run the following commands to initialize the keyspaces that we created through Astra. 
    * Note that there are two sets of commands, one for **temporal** keyspace and one for **temporal_visibility** keyspace. 
    * Each command takes about **15 minutes** to run. Be patient with this process. We recommend starting up two terminal windows, one for **temporal** keyspace and one for **temporal_visibility** keyspace. You run this in the background while you do other work in the meantime.
    ```
    // Host and port can be found at config.json file inside the Astra Secure Connect Bundle
    export CASSANDRA_HOST={host} //Dont include brackets
    export CASSANDRA_PORT=29042

    // Password can be found in Admin user CSV under "Token"
    export CASSANDRA_USER=token
    export CASSANDRA_PASSWORD={Astra Token}

    // temporal keyspace
    CASSANDRA_KEYSPACE=temporal temporal-cassandra-tool --ep $CASSANDRA_HOST --port $CASSANDRA_PORT --user $CASSANDRA_USER --password $CASSANDRA_PASSWORD --tls=true --tls-cert-file=/etc/temporal/config/dynamicconfig/cert --tls-key-file=/etc/temporal/config/dynamicconfig/key --tls-ca-file=/etc/temporal/config/dynamicconfig/ca.crt --tls-disable-host-verification=true  setup-schema -v 0.0

    CASSANDRA_KEYSPACE=temporal temporal-cassandra-tool --ep $CASSANDRA_HOST --port $CASSANDRA_PORT --user $CASSANDRA_USER --password $CASSANDRA_PASSWORD --tls=true --tls-cert-file=/etc/temporal/config/dynamicconfig/cert --tls-key-file=/etc/temporal/config/dynamicconfig/key --tls-ca-file=/etc/temporal/config/dynamicconfig/ca.crt --tls-disable-host-verification=true update -schema-dir schema/cassandra/temporal/versioned

    // temporal_visibility keyspace
    CASSANDRA_KEYSPACE=temporal_visibility temporal-cassandra-tool --ep $CASSANDRA_HOST --port $CASSANDRA_PORT --user $CASSANDRA_USER --password $CASSANDRA_PASSWORD --tls=true --tls-cert-file=/etc/temporal/config/dynamicconfig/cert --tls-key-file=/etc/temporal/config/dynamicconfig/key --tls-ca-file=/etc/temporal/config/dynamicconfig/ca.crt --tls-disable-host-verification=true  setup-schema -v 0.0

    CASSANDRA_KEYSPACE=temporal_visibility temporal-cassandra-tool --ep $CASSANDRA_HOST --port $CASSANDRA_PORT --user $CASSANDRA_USER --password $CASSANDRA_PASSWORD --tls=true --tls-cert-file=/etc/temporal/config/dynamicconfig/cert --tls-key-file=/etc/temporal/config/dynamicconfig/key --tls-ca-file=/etc/temporal/config/dynamicconfig/ca.crt --tls-disable-host-verification=true update -schema-dir schema/cassandra/visibility/versioned`
    ```

    Once the process is completed, you should see a message similar to this: 

    ```
    2022-03-02T22:23:27.618Z	INFO	Validating connection to cassandra cluster.	{"logging-call-at": "cqlclient.go:112"}
    2022-03-02T22:42:53.526Z	INFO	Connection validation succeeded.	{"logging-call-at": "cqlclient.go:118"}
    2022-03-02T22:42:53.526Z	INFO	Starting schema setup	{"config": {"SchemaFilePath":"","InitialVersion":"0.0","Overwrite":false,"DisableVersioning":false}, "logging-call-at": "setuptask.go:57"}
    2022-03-02T22:42:53.526Z	DEBUG	Setting up version tables	{"logging-call-at": "setuptask.go:67"}
    2022-03-02T22:42:54.120Z	DEBUG	Current database schema version 1.6 is greater than initial schema version 0.0. Skip version upgrade	{"logging-call-at": "setuptask.go:116"}
    2022-03-02T22:42:54.120Z	INFO	Schema setup complete	{"logging-call-at": "setuptask.go:131"}
    ```

    Great! Your schemas have been migrated with Astra DB. 
??? info "Step 4: Confirm in Astra"
    * You can double-check to make sure the correct tables have been created by querying your database in Astra DB’s CQL Console. 
    * Run `DESC tables;` in both your `temporal` and `temporal_visibility` keyspaces. You should see there are tables loaded in that were created by the schema migration with `temporal-cassandra-tool`.

    ```
    token@cqlsh> use temporal;
    token@cqlsh:temporal> desc tables;

    history_node        tasks             cluster_metadata_info
    cluster_membership  namespaces        cluster_metadata     
    schema_version      namespaces_by_id  schema_update_history
    executions          queue_metadata  
    queue               history_tree    

    token@cqlsh:temporal> use temporal_visibility;
    token@cqlsh:temporal_visibility> desc tables;

    open_executions  schema_update_history  schema_version  closed_executions

    ```
!!! info "Step 5: Shut down Temporal container"
    



#### Helm Charts Installation
In this section, you are going to be following steps to install Temporal using Helm Charts:
??? info "Step 1: Setup Kubernetes Cluster"
    Refer to the [Prerequisites](https://github.com/temporalio/helm-charts#prerequisites) section that gives you the steps in configuring your system to access a Kubernetes cluster, AWS CLI V2, kubectl, Helm v3, and so on. For this specific example, I used [Kind](https://kind.sigs.k8s.io/) to deploy my Kubernetes cluster.
!!! info "Step 2: Clone the [temporalio/helm-charts](https://github.com/temporalio/helm-charts) repository in your `/my-temporal` directory"
??? info "Step 3: Download Helm Chart Dependencies"
    Your output should look like this:
    ```
    % helm dependencies update
    Getting updates for unmanaged Helm repositories...
    ...Successfully got an update from the "https://helm.elastic.co" chart repository
    ...Successfully got an update from the "https://grafana.github.io/helm-charts" chart repository
    ...Successfully got an update from the "https://prometheus-community.github.io/helm-charts" chart repository
    ...Successfully got an update from the "https://charts.helm.sh/incubator" chart repository
    Hang tight while we grab the latest from your chart repositories...
    ...Successfully got an update from the "kong" chart repository
    ...Successfully got an update from the "datastax-examples-kong" chart repository
    ...Successfully got an update from the "bitnami" chart repository
    Update Complete. ⎈Happy Helming!⎈
    Saving 4 charts
    Downloading cassandra from repo https://charts.helm.sh/incubator
    Downloading prometheus from repo https://prometheus-community.github.io/helm-charts
    Downloading elasticsearch from repo https://helm.elastic.co
    Downloading grafana from repo https://grafana.github.io/helm-charts
    ```
??? info "Step 4: Deploy Kubernetes Cluster" 
    Create and deploy your Kubernetes cluster using the instructions here. Once deployed, the Kubernetes cluster should appear up and running in your Docker Desktop like this:

    <img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-06-kubernetes-docker.png?raw=true"  />



#### Secret Creation
In the Docker Image step, you noticed we used the following files from our Astra Secure Connect Bundle: `ca.crt`, `cert`, and `key`. These are all credentials that will tell Temporal that you are trying to connect with Astra and that you have the access to do so. With Secrets in Kubernetes, you are able to store sensitive information and mount it to your deployment.

??? info "How to Store Bundle info in Secrets" 
    1. Go to your `/helm-charts` file directory.
    2. Open the `templates` folder.
    3. Using your preferred text editor (we used VSCode) create an `astra-secret.yaml` file in this folder.
    4. Copy and paste the following code in your editor:
    ```
    apiVersion: v1
    kind: Secret
    metadata:
    name: astra-secret
    type: Opaque
    data:
    ca.crt: LS0tLS1CRUdJTiBDRV...
    cert: LS0tLS1CRUdJTiBDR....
    key: LS0tLS1CRUdJTiBSU...
    ```
    5. Navigate to your Secure Connect Bundle in your `/my-temporal` directory using your terminal
    6. Base64 Encode your `ca.crt`, `cert`, and `key` files then plug them back into the respective fields in your `astra-secret.yaml` file 
    **ex.** `ca.crt: LS0tLS1CRUdJTiBDRV...`
        * Base64 for Mac: `base64 --break 0 <file-name>`
        * Base64 for Windows: `certutil -encode input-file.txt encoded-output.txt`
        * Base64 for Linux: `base64 -w o <path-to-file>`
    7. Save your `astra-secret.yaml` file.


#### Mounting to Volume - Server Deployment
Once you have finished creating the Secrets, you are going to mount these to the Temporal Server Deployment file. 

??? info "How to Mount to Server Deployment"
    1. In your `templates` folder, find and open `server-deployment.yaml `
    2. Append the following under `volumeMounts:`
    ```
    volumeMounts:
            ….
            - name: astra-secret
                mountPath: /etc/temporal/secret
                readOnly: true
    ```
    3. Scroll down to `volumes` and append the following:
    ```
    volumes:
        …
        - name: astra-secret
            secret:
            secretName: astra-secret
            items:
                - key: cert
                path: cert
                - key: ca.crt
                path: ca.crt
                - key: key
                path: key
    ```
    4. (Note that the `volumeMount` name and `volume name` must be the same for `astra-secret`. 
    5. Save your `server-development.yaml` file.



### ✅ Step 4: Persistence Layer Configuration
Now that you’ve gotten this far, we’re going to configure the Persistence Layer of Temporal’s server. The persistence layer, also known as the Data Access layer, is paired with the Temporal Server to allow support for different back-end databases, Cassandra in this case. 

#### Values Configuration
??? info "Configure Persistence Layer"
    1. Go to the `helm-charts` directory.
    2. Go to the `values` folder.
    3. Edit the `values.cassandra.yaml` file using your preferred editor (ie. VSCode).
    4. While leaving the “consistency” section alone, update the `cassandra` and visibility sections with the code below. Make sure to change the `keyspace` name to `temporal_visibility` when updating under the `visibility` section:
    ```
    disableInitialHostLookup: true
            tls:
            enableHostVerification: false
            enabled: true
            certFile: "/etc/temporal/secret/cert"
            keyFile: "/etc/temporal/secret/key"
            caFile: "/etc/temporal/secret/ca.crt"
            //get host from config.json file in SCB
            hosts: <host> 
            port: 29042
            keyspace: temporal
            user: "token"
            password: <astra-token>
            existingSecret: ""
            replicationFactor: 3`
    ```
    5. Save your `values.cassandra.yaml` file.

#### Helm Install
??? info "Install and Deploy Temporal Server"
    1. In your **helm-charts** directory, run this command:
    ```
    helm install -f values/values.cassandra.yaml --set elasticsearch.enabled=false temporalastra . --timeout 900s
    ```
    You should see this message if it was successful:
    ```
    NAME: temporalastra
    LAST DEPLOYED: Thu Mar  3 15:34:39 2022
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    To verify that Temporal has started, run:
    kubectl --namespace=default get pods -l "app.kubernetes.io/instance=temporalastra"
    ```
    2. In a different tab, run `kubectl --namespace=default get pods -l "app.kubernetes.io/instance=temporalastra"`

    A successful deployment should look like this: 
    ```
    NAME                                                  READY   STATUS    RESTARTS   AGE
    temporalastra-admintools-5c5fb5f989-rhdrz           1/1     Running   0          14m
    temporalastra-frontend-7767bcdddb-kxqsn             1/1     Running   0          14m
    temporalastra-grafana-6bb965b6ff-5kdnq              1/1     Running   0          14m
    temporalastra-history-5b798b4965-4sv6q              1/1     Running   0          14m
    temporalastra-kube-state-metrics-84ff4fb4c8-lkjbr   1/1     Running   0          14m
    temporalastra-matching-65b79bd899-xt6cb             1/1     Running   0          14m
    temporalastra-web-7b6c8d64d7-xtqpb                  1/1     Running   0          14m
    temporalastra-worker-6dc9568895-h6hkq               1/1     Running   0          14m
    ```
    3. Allow a couple minutes for all `STATUS` to initialize and switch to Running. You can run the get pods statement from above to continuously check on the status as its initializing.




### ✅ Step 5: Test and Validate
You can test your connection and play with your Temporal cluster with these instructions.

1. Make sure to use tctl to create namespaces dedicated to certain workflows:
```
bash-5.0# tctl --namespace test namespace re
Namespace test successfully registered.
```
2. When using the sample apps, keep in mind that you want to modify the starter and worker code so that it points to this specific Temporal deployment. For example:
```
c, err := client.NewClient(client.Options{HostPort: "127.0.0.1:7233", Namespace: "test"})
```

Once you have this all running, you should be able to see your workflows reflect on both the Temporal UI and Astra UI.

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/temporal/img/temporal-06-test-validate.png?raw=true"  />


[🏠 Back to HOME](https://awesome-astra.github.io/docs/)