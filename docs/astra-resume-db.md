## A - Overview

In the free tier _(serverless)_, after `23h`, your database will be **hibernated** and the status will change to **StandBy**.

From there it needs to be resumed or **the first request will fail**. This first request will also replace the database in `Active` mode after a few seconds.

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/exit-hibernation-1.png?raw=true" />

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)

## C - Procedure

The idea here is to trigger an harmless request to access to the health TAB to change the status of the Database.

**✅ Step 1: Trigger a request**

- Access the database by clicking its name in the menu on the left

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/exit-hibernation-2.png?raw=true" />

- Select Table Health check

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/exit-hibernation-3.png?raw=true" />

- Wait for a minute for the database to exit hibernation

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/exit-hibernation-4.png?raw=true" />

## D - Extra Resources

[🏠 Back to home](https://github.com/datastaxdevs/awesome-astra/wiki)
