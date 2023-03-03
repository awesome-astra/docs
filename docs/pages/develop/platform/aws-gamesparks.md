---
title: "AWS GameSparks"
description: "Amazon GameSparks is a fully managed game backend service that makes it easier for you to build, optimize, and scale game backend features."
tags: "FaaS, serverless, AWS, Java, Python"
icon: "https://awesome-astra.github.io/docs/img/aws-lambda-functions/aws-lambda.svg"
developer_title: "AWS GameSparks"
developer_url: "https://aws.amazon.com/gamesparks/"
---
<div class="nosurface" markdown="1">
# AWS GameSparks
</div>

## Overview

In this tutorial, we will be creating a simple app that connects to [Astra Block](https://docs.datastax.com/en/astra-serverless/docs/block/overview.html) using AWS GameSparks, AWS Lambda, and Unity. 

<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/techstack.png" /><br/>

[AWS GameSparks](https://docs.aws.amazon.com/gamesparks/latest/dg/welcome.html) is a fully managed AWS service that provides a multi-service backend for game developers. GameSparks works together with [AWS Lambda](https://docs.aws.amazon.com/lambda/) which connects directly to our Astra DB Database and Astra Block.


## Prerequisites

<ul class="prerequisites">
    <li class="nosurface">You should have an <a href="https://astra.dev/3B7HcYo">Astra account</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-instance/">Create an Astra Database</a></li>
    <li class="nosurface"><a href="https://docs.datastax.com/en/astra-serverless/docs/block/quickstart.html#request-access">Request for access </a>to Astra Block.</li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/create-token/">Have an Astra Token</a></li>
    <li class="nosurface">You should <a href="https://awesome-astra.github.io/docs/pages/astra/download-scb/">Download your Secure Connect Bundle</a></li>
    <li class="nosurface">Have <a href="https://unity3d.com/get-unity/download">Unity Hub</a> installed.</li>
    <li class="nosurface">Have <a href="https://unity3d.com/unity/qa/lts-releases?version=2020.3">2020.3 Unity version</a> installed (This project uses 3.4.1).</li>
</ul>

## Step 1: AWS Lambda

1. This section of the tutorial will be referencing a majority of the [AWS Lambda](https://awesome-astra.github.io/docs/pages/develop/platform/aws-lambda-function/) tutorial with some minor adjustments. You can  choose one of the four options available: Python Driver, Python SDK, Java Driver, Java gRPC. This tutorial uses **Python Driver**. 

2. In Step 2 of the AWS Lambda integration tutorial, you are asked to create file `lambda_function.py` with the function source code. Use the following code for the `lambda_handler` function.
```python
def lambda_handler(event, context):

    num1 = event['num1']
    num2 = event['num2']
    row = session.execute("select * from krypton_dev.sorted_nfts where block_number_hour=" + str(num1) + " and block_number=" + str(num2) + " limit 1;").one()
    print(type(row[5]))
    return {
        "result": row[5]
    }

```
This queries the `sorted_nfts` table then returns the name of the NFT at the given `block_number` and `block_number_hour`.

3. Create the deployment package and AWS Lambda function as stated in the [tutorial](https://awesome-astra.github.io/docs/pages/develop/platform/aws-lambda-function/#2-create-a-function). 

4. Test the function by navigating to the **Test** tab. Scroll down to the **Event JSON** section and update the values with the following values:
```python
{
  "num1": "41447",
  "num2": "14920967"
}
```
5. Click the **Test** button and observe the output. It should have returned the NFT name `Banksy Culture`. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/01-test-function.png" /><br/>
