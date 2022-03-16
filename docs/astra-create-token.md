> The Astra token creation procedure is also described in the [reference documentation](https://docs.datastax.com/en/astra/docs/manage-application-tokens.html)

## A - Overview

Tokens are the way to authenticate against Astra with any given Apis or Drivers. They are created at organization level and as such can be used with multiple Databases.

When you create a token you will select a `Role` that code a set of permissions. There you can limit the usage of your token for a particular database.

<img src="../img/astra/role-users.png?raw=true" height="400px"/>

## B - Prerequisites

- You should have an [Astra account](http://astra.datastax.com/)

## C - Procedure

**✅ Step 1 : Open the Organization settings panel**

On the top left hand corner locate the panel `Current Organization` with your email address. Use the chevron down **&#8964;** to open the menu and pick `Organizations Settings`

<img src="../img/astra/astra-create-token-1.png?raw=true" />

**✅ Step 2: Open the token management page**

On the new page, select `Token Management` in the menu. Then use the `Select Roles` combo to select `Organization Administrator` role. This is the administrator of your tenant with all permissions.

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-create-token-2.png?raw=true" />

<details>
<summary>
**Tip**: you can reach the Token Management page directly from the ellipsis menu next to your database in the main Astra dashboard. Expand to see how
</summary>
<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-create-token-alt.gif?raw=true" />
</details>

**✅ Step 3: Save the token as a CSV.**

The values of `clientSecret` and `token` will not be shown to you later for security reasons. Do not share those values and never commit them on github.

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-create-token-3.png?raw=true" />

**👁️ Walkthrough**

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-create-token.gif?raw=true" />

You can use the clipboard icons close to each parameter to clip them and copy them elsewhere.

<img src="https://github.com/datastaxdevs/awesome-astra/blob/main/astra/img/astra-create-token-4.png?raw=true" />

## D - Extra Resources

- A video [explaining you the details of roles and privileges](https://youtu.be/k5b5TiafAAM?list=PL2g2h-wyI4SpWK1G3UaxXhzZc6aUFXbvL&t=81)
- A video [guiding you through the steps](https://www.youtube.com/watch?v=TUTCLsBuUd4) of creating a token.

  _Written by **Cedrick Lunven**, Last Update `2/10/2021`_
