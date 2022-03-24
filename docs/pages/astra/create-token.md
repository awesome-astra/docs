<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

!!! abstract "Reference Documentations and resources"

    <ol>
        <li><i class="fa fa-book" ></i>&nbsp;<a href="https://docs.datastax.com/en/astra/docs/manage-application-tokens.html"><b>Astra Docs</b> - The Astra token creation procedure</a>
        <li><i class="fa fa-youtube-play" ></i>&nbsp;<a href="https://www.youtube.com/watch?v=TUTCLsBuUd4"><b>Youtube Video</b> - Walk through token creation</a>
        <li><i class="fa fa-youtube-play" ></i>&nbsp;<a href="https://youtu.be/k5b5TiafAAM?list=PL2g2h-wyI4SpWK1G3UaxXhzZc6aUFXbvL&t=81"><b>Youtube Video</b> - More about token and roles in Astra</a>
    </ol>

## A - Overview

Tokens are the way to authenticate against Astra with any given Apis or Drivers. They are created at organization level and as such can be used with multiple Databases.

When you create a token you will select a `Role` that code a set of permissions. There you can limit the usage of your token for a particular database.

<img src="../../../img/astra/role-users.png" height="400px"/>

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)

## C - Procedure

??? note "1️⃣ Open the Organization settings panel"

    On the top left hand corner locate the panel `Current Organization` with your email address. Use the chevron down **&#8964;** to open the menu and pick `Organizations Settings`

    <img src="../../../img/astra/astra-create-token-1.png" />

??? note "2️⃣ Open the token management page"

    On the new page, select `Token Management` in the menu. Then use the `Select Roles` combo to select `Organization Administrator` role. This is the administrator of your tenant with all permissions.

    <img src="../../../img/astra/astra-create-token-2.png" />

    ??? tip "The same page can be accessed from the dashboard"

        You can reach the Token Management page directly from the ellipsis menu next to your database in the main Astra dashboard. Expand to see how

        <img src="../../../img/astra/astra-create-token-alt.gif" />

??? note "3️⃣ Save the token as a CSV."

    The values of `clientSecret` and `token` will not be shown to you later for security reasons. Do not share those values and never commit them on github.

    <img src="../../../img/astra/astra-create-token-3.png" />

???+ note "4️⃣ Walkthough."

    <img src="../../../img/astra/astra-create-token.gif" />

??? tip "Copy values in the clipboard"

    You can use the clipboard icons close to each parameter to clip them and copy them elsewhere.

    <img src="../../../img/astra/astra-create-token-4.png" />
