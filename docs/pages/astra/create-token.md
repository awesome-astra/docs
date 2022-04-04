<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

!!! abstract "Reference Documentations and resources"

    <ol>
        <li><i class="fa fa-book" ></i>&nbsp;<a href="https://docs.datastax.com/en/astra/docs/manage-application-tokens.html"><b>Astra Docs</b> - The Astra token creation procedure</a>
        <li><i class="fa fa-youtube-play" ></i>&nbsp;<a href="https://www.youtube.com/watch?v=TUTCLsBuUd4"><b>Youtube Video</b> - Walk through token creation</a>
        <li><i class="fa fa-youtube-play" ></i>&nbsp;<a href="https://youtu.be/k5b5TiafAAM?list=PL2g2h-wyI4SpWK1G3UaxXhzZc6aUFXbvL&t=81"><b>Youtube Video</b> - More about token and roles in Astra</a>
    </ol>

## A - Overview

As stated in the [Create Account](create-account) page the security token are associated to one and only one organization and only one role.

```mermaid
  graph TD
    USER(User) -->|n...m|ORG(Organizations)
    ORG -->|0..n|DB(Dabatases)
    ORG -->|0..n|TOKEN(Tokens)
    ORG -->|0..n|STR(Streaming Tenants)
    TOKEN-->|1:1|ROLE(role)
    ROLE-->|1..n|PERMISSIONS(permissions)
```

There are some predefined roles within an organizations associated with some default permissions. The full list of permissions per roles is available in [Astra Documentation](https://docs.datastax.com/en/astra/docs/user-permissions.html)

<center>
<img src="../../../img/astra/roles-1.png" />
<br/><i>Figure 1: Default Roles</i>

<p>
<img src="../../../img/astra/roles-11.png" />
<br/><i>Figure 2: Permissions for a role here `Database Administrator`</i>
</p>
</center>

it is also possible to create a custom roles and associate fined grained permissions. (`Organizations Settings / Role Managennt`)

<center>
<img src="../../../img/astra/roles-2.png" />
<br/><i>Figure 3: Custom Roles screen</i>
</center>

## B - Prerequisites

**To create a new token:**

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
