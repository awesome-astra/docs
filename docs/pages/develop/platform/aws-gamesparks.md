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

!!! warning "Notice"
    This page is still under construction. Please be patient with our team and contact us for any questions. Thank you!

## Overview

In this tutorial, we will be creating a simple app that connects to [Astra Block](https://docs.datastax.com/en/astra-serverless/docs/block/overview.html) using AWS GameSparks, AWS Lambda, and Unity. 

<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/0-tech-stack.png" /><br/>

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

This section of the tutorial will be referencing a majority of the [AWS Lambda](https://awesome-astra.github.io/docs/pages/develop/platform/aws-lambda-function/) tutorial with some minor adjustments. 

1. First, choose one of the four options available: Python Driver, Python SDK, Java Driver, Java gRPC. This tutorial uses **Python Driver**. 

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

## Step 2: AWS GameSparks
This section of the tutorial will focus on setting up AWS GameSparks as a backend and connect it to the AWS Lambda function that you just created.

### Create a game backend
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/02-aws-gamesparks.png" /><br/>

1. Firstly, open the [Amazon GameSparks Console](https://console.aws.amazon.com/gamesparks/home) and click on *Create game* to create a game and start developing your game backend:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/03-gamesparks-create-game.png" /><br/>

2. Set a name for your Game and click *Create* 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/04-create-game.png" /><br/>
You have now created your **AWS GameSparks backend** ready to be configured to your game and AWS Lambda. <br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/05-game-created.png" /><br/>

### Deployment
Prior to any major development, we are first going to deploy a fresh new snapshot of the game backend. A snapshot allows you to store data representing a certain point of progress in a game. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/06-dev.png" /><br/>

1. From the *Dev* page, click **Deploy as new snapshot**. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/07-deploy-snapshot.png" /><br/>

2. Here, you can enter an optional description and click *Save* to continue. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/08-snapshot-save.png" /><br/>

3. In a few minutes, you should see that the snapshot and game backend has now been deployed. **Note:** Everytime a new feature is added to the game, a new snapshot will also have to be deployed. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/09-snapshot-created.png" /><br/>
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/10-snapshot-deployed.png" /><br/>

### Give your GameSparks backend permission to access Lambda
Now that the game backend is deployed, we must give it permission to access the AWS Lambda function that we set up previously in **Step 1**. This will allow the two entities to communicate with each other, send/receive requests to the game backend, and more. Firstly, we will have to grant permissions by creating an **IAM Policy**. 

#### Create Policy
1. Go to the [IAM Create policy](https://us-east-1.console.aws.amazon.com/iam/home?region=us-east-1#/policies$new?step=edit) page and click *Import managed policy*. This will allow you import a role with specific permissions to Lambda. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/11-create-policy.png" /><br/>

2. Filter the policies by searching for *LambdaRole* in the search bar. Choose **AWSLambdaRole**. Then select *Import*.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/12-lambda-role.png" /><br/>

3. **AWSLambdaRole** policy will allow you to invoke **any** Lambda function that we deploy. However, you also have the option to specify a specific function that you would like to invoke. Do this by going to the JSON tab, and navigating to where it says `"Resource"`. Replace the `"*"` with the [ARN](https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) from your Lambda Function to invoke a specific function. For this tutorial, you can leave it as `"*"`. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/13-json-policy.png" /><br/>

4. Choose **Next:Tags** then **Next:Review**. 

5. In *Review*, give your policy a name such as `AllowLambdaInvokeAll` and finish by choosing **Create Policy**. 

#### Attach policy
Next, we are going to the attach the policy we just created to our GameSparks backend IAM role.

1. Go back to your [Amazon GameSparks Console](https://us-east-1.console.aws.amazon.com/gamesparks/home?region=us-east-1#/games), select your game, and go to the *Dev* section in your navigation bar. Under *Dev*, go to *Configuration* and choose **"View in IAM console"**.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/14-attach-policy.png" /><br/>

2. The IAM console opens to the IAM role for your Dev stage. On the *Permissions* tab, choose *Add permissions* and *Attach policies*:
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/15-attach-policy2.png" /><br/>

3. Filter for the policy name you created, select it, and press *Add permissions*. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/16-add-permission.png" /><br/>

4. Great! You have now given your AWS GameSparks backend permission to call to your AWS Lambda Function. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/17-policy-added.png" /><br/>

## Connecting your GameSparks backend to Lambda

???+ info "How This Works?" 
    To invoke Lambda functions from Amazon GameSparks you need to create a ***Message*** inside the game backend. There are **3 types of messages**: ***Events***, ***Requests***, and ***Notifications***.
    Once created, you can call a Lambda function from there. Learn more [here](https://docs.aws.amazon.com/gamesparks/latest/dg/lambda.html).

For this example, we will be using ***Request*** so that our front end client (Unity) can **get data** from our Amazon GameSparks backend. This request will internally call the Lambda function we previously set up and return a response. 

### Create GetSortedNFT request

1. Return to your GameSparks backend, and select **Cloud code** from the navigation bar. Once you are there, select **Create Message**. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/18-cloud-code.png" /><br/>

2. Select *Request* and give it a name. For this example, we will name it *GetSortedNFT* based on our Lambda function. Then click, **Create**
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/19-create-request.png" /><br/>

3. Here, you will configure the Request fields. Recall the AWS Lambda function that we created. There were 2 input fields that were needed to retrieve a response:
```python
{
  "num1": "41447",
  "num2": "14920967"
}
```
You will configure a Request field for each input value needed in the Lambda function and a Response field. We will call these fields `input1` and `input2`. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/20-config-request.png" /><br/>
Make sure to also take note of the *Shape* so that it matches the type of your Response field.

4. Update the **Request handle** code with the following:
```
GameSparks().Logging().Debug("In lambdaAstraDBTest request handler");

const response = GameSparks().Lambda("lambdaAstraDBTest").Invoke(
    {
        "num1": message.input1,
        "num2": message.input2
    }
);

GameSparks().Logging().Debug("Result from Lambda is:");
GameSparks().Logging().Debug(JSON.stringify(response.Payload));

return GameSparks().Messaging().Response({"result": JSON.stringify(response.Payload.result)});
```
Then click **Save**.
5. Test your Request in the Cloud Console by clicking **Test**. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/21-test-request.png" /><br/>

6. Make sure your Player is connected and that you deploy a new snapshot by clicking the banner. You should always deploy a new snapshot between changes.

7. Once Step 6 is done, select *Populate example* which will allow you to give input to the *Request Body*. Here, you can populate values `input1` and `input2` with the same values you gave when you set up your AWS Lambda function. `input1` being the `block_number_hour` and `input2` being the `block_number` from your `sorted_nfts` table.
***Remember to use valid **block_number_hour** and **block_number** values.***

```python
{
	"input1": 41447,
	"input2": 14920967
}
```
8. Finally, click *Send message* to send this request to the backend. You should see in the *Log inspector* your request being sent and received. <br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/22-send-message.png" /><br/>
9. Congrats! You have now sent a request and received a response using AWS GameSparks and AWS Lambda. 

## Connecting Unity to GameSparks backend
Now you are ready to connect your backend to our Unity front end. First, download the **[Unity sample project](https://github.com/awesome-astra/astra-block-gamesparks-demo)** we have prepared from our Awesome Astra repo. 

!!! note "Note"
    The sample project already includes the **Amazon GameSparks SDK** installed, or you can follow the instructions [here](https://docs.aws.amazon.com/gamesparks/latest/dg/get-started_client-unity.html).

### Setting Up
1. Open the project with **Unity Hub**
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/23-unity.png" /><br/>

2. On the *Project* tab go to *Assets* -> *Amazon* -> *GameSparks* and choose the ***Connection.asset***
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/24-connection-asset.png" /><br/>

3. In the Insepctor tab on the right, you will see the Amazon GameSparks connection settings. As you can see currently, *Game Key* is blank. You will obtain this from your *GameSparks Console* -> *Dev* -> *Dev stage configuration* -> Under *Key*
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/27-game-key-dev.png" /><br/>

4. Copy this value and paste it into *Game Key* back in Unity.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/25-game-key.png" /><br/>

Great! Setup is now complete! 

### Running the game
1. To run the game, go back to your *Project* tab -> *Assets* -> *Scenes* -> Select the *AstraBlockGameSparksDemo* Scene. This is the scene that we are going to play.
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/28-play-scene.png" /><br/>

2. Click the "Play" button at the top of the screen. You should see a notification saying the scripts are rendering. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/26-play-unity.png" /><br/>

3. Once that is complete, you can type directly into the input box where it says *Enter Block Number...*. Once you click submit, you should see the *Block Number* populate, and shortly after, the *NFT Title* will return the name of the NFT at that given block number. 
<br/><img src="https://awesome-astra.github.io/docs/img/aws-gamesparks/29-demo-gameplay.png" /><br/>

4. Try submitting different Block Numbers to see the different results you get back for your NFTs!

## Finish
Congratulations! You have completed the ***Astra Block with AWS GameSparks, AWS Lambda, and Unity*** tutorial! This is only the beginning as you can connect your AWS Lambda to any table given within Astra Block, query for different values, etc. 

<span class="nosurface">
[🏠 Back to HOME](https://awesome-astra.github.io/docs/)
</span>