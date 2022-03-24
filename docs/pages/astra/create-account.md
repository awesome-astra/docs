## A - Overview

ASTRA DB is the simplest way to run Cassandra with zero operations at all. **No credit card required**, $25.00 USD credit every month, (_roughly 20M reads/writes, 80GB storage monthly_) - sufficient to run small production workloads.

[http://astra.datastax.com](http://astra.datastax.com/) is the URL to access to create an account and use the solution.

![](https://dabuttonfactory.com/button.png?t=Go+to+Astra&f=Open+Sans-Bold&ts=18&tc=fff&hp=40&vp=18&c=11&bgt=gradient&bgc=4052b5&ebgc=073763)

## B - Sign Up

You can use your `Github`, `Google` accounts or register with an `email`.

### 1. Sign In with Github

??? note "Click the `[Sign In with Github]` button"

    <img src="../../../img/astra/astra-signin-github-0.png" />

??? note "1️⃣ Click `Continue` on the OAuth claims delegation"

    The OAuth2 delegation screen from github is asking for permissions.

    <img src="../../../img/astra/astra-signin-github-1.png" />

??? success "2️⃣ You are redirected to the homepage"

    <img src="../../../img/astra/astra-signup-8.png" />

### 2. Sign In with Google

??? note "1️⃣ Click the `[Sign In with Google]` button"

    <img src="../../../img/astra/astra-signin-google-0.png" />

??? success "2️⃣ You are redirected to the homepage"

    <img src="../../../img/astra/astra-signup-8.png" />

### 3. Sign Up

??? note "1️⃣ Click the `Sign up` on the bottom of the page"

    <img src="../../../img/astra/astra-signup-1.png" />

??? note "2️⃣ Provide your information and validate the captcha"

    <img src="../../../img/astra/astra-signup-2.png" />

??? note "3️⃣ Accept terms and policies"

    <img src="../../../img/astra/astra-signup-3.png" />

    Astra is now looking for you to validate your email adress

    <img src="../../../img/astra/astra-signup-4.png" />

??? note "4️⃣ Open the mail in your inbox and validate with `Verify my email` link"

    <img src="../../../img/astra/astra-signup-5.png" />

    - Astra will show a validation message, select **Click Here to proceed**.

    <img src="../../../img/astra/astra-signup-6.png" />

    - Select **back to application**
    <img src="../../../img/astra/astra-signup-7.png" />

??? success "5️⃣ You are redirected to the homepage"

    <img src="../../../img/astra/astra-signup-8.png" />

## C - Users and Organizations

### Personal Organizations (tenant)

When you create an account your personal **Organization** is created, **this is your tenant**:

- The name of the organization is your email address, _(1) in the picture below_
- The unique identifier (GUID) is present in the URL on the dashboard. _(2) in the picture below_

<img src="../../../img/astra/organization-1.png" />

### Create Organizations

You can create multiple organizations accessing the menu **`Managing Organizations`** and invite other users to join. It is usefule when the same database could be access by multiple users with different emails.

<img src="../../../img/astra/organization-2.png" />

As a consequence a user can be part of multiple organizations, his personal, the one he created and the one he got invited to.

```mermaid
  graph TD
    USER(User) -->|own one| PORG(Personal Organization - registration)
    USER -->|own many| CORG(Organizations he created)
    USER -->|is member of many| IORG(Organizations he was invited to)
```

### Organizations and Databases

Within one organization will live `Databases`, `Tenants` and `Security Tokens` as shown on the Organization Dashboard.

<img src="../../../img/astra/organization-3.png" />
