<details>
<summary><b> 📖 Reference Documentations and resources</b></summary>
<ol>
<li><a href="https://docs.datastax.com/en/astra/docs/manage/upload/astra-data-loader.html"><b>📖  Data Loader</b> - Astra Reference documentation</a>
<li><a href="https://www.youtube.com/watch?v=xg3SPqKpP7Q&list=PL2g2h-wyI4SpWK1G3UaxXhzZc6aUFXbvL&index=5"><b>🎥 Youtube Video</b> - Walk through data loader usage</a>
</ol>
</details>

### A - Overview

Astra DB conveniently has its own data loader built in to the user interface. Use this DataStax Astra DB Data Loader to load your own data into your database or try one of our sample datasets.

### B - Prerequisites

- You should have an [Astra account](https://astra.dev/3B7HcYo)
- You should [Create an Astra Database](/docs/pages/astra/create-instance/)

### C - Procedure

**✅ Step 1 : From your Astra DB Dashboard, select Load Data for the database where you want to load data.**

![](https://docs.datastax.com/en/astra/docs/_images/dataloader-dashboard.png)

The Astra DB Data Loader launches.

![](https://docs.datastax.com/en/astra/docs/_images/dataloader-createscreen.png)

**✅ Step 2 : Load your data using one of the options:**

#### Upload your dataset

Drag and drop your own `.csv` file into the Astra DB Data Loader.

> :warning: `CSV` files must be less than `40 MB`. You will see a status bar to show how much data has uploaded. Ensure the column names in your .csv do not include spaces. Underscores are accepted. For example, `ShoeSize`, `ShirtColor`, `Shoe_Size`, and `Shirt_Color` are accepted column names.

#### Load example dataset

Select one of the two examples given to use as a sample dataset.

#### Load DynamoDB from S3

- First, export your DynamoDB data to S3 as described here. Then in AWS console, grant read access to the following ARN: `arn:aws:iam::445559476293:role/astra-loader` Your bucket policy should use:

```json
{
  "Statement": [
    {
      "Action": ["s3:ListBucket", "s3:GetBucketLocation"],
      "Principal": { "AWS": "arn:aws:iam::445559476293:role/astra-loader" },
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME"
    },
    {
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::445559476293:role/astra-loader" },
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```

This bucket policy allows Astra DB automation to pull data from your identified shared S3 bucket, and load the data into Astra DB. You can remove the permission after the data load finishes.

In the Option 3 prompts, enter your S3 Bucket name, and enter the Key value. To find the Key, navigate in AWS console to the S3 subdirectory that contains your exported DynamoDB data. Look for the Key on its Properties tab. Here’s a sample screen with the Key shown near the lower-left corner:

![](https://docs.datastax.com/en/astra/docs/_images/dataloader-s3-dynamodb-key.png)

S3 Properties with Key value for exported DynamoDB data file.
Once you configure your option, select Next.

#### Import Procedure

- Give your table for this dataset a name. Your dataset will be included in the Data Preview and Types.

![](https://docs.datastax.com/en/astra/docs/_images/dataloader-config.png)

- Select the data type for each column.

> :information: The Astra DB Data Loader automatically selects data types for your dataset. If needed, you can change this to your own selection.

- Select your partition key and clustering column for your data.

![](https://docs.datastax.com/en/astra/docs/_images/dataloader-keyscluster.png)

- Select Next.

- Select your database from the dropdown menu.

- Select your keyspace from the available keyspaces.

![](https://docs.datastax.com/en/astra/docs/_images/dataloader-loadtotarget.png)

- Select Next.

You will see a confirmation that your data is being imported. Within a few minutes, your dataset will begin uploading to your database.

You will receive an email when the job has started and when the dataset has been loaded.
