<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

## A - Overview

ASTRA DB is the simplest way to run Cassandra with zero operations. **No credit card required** and $25.00 USD credit every month (_roughly 20M reads/writes, 80GB storage monthly_) which is sufficient to run small production workloads.

[https://astra.datastax.com](https://astra.dev/3B7HcYo) is the URL create an account and get started with the solution.

<a href="https://astra.datastax.com" class="md-button">
  <i class="fa fa-sign-in" ></i>&nbsp;Sign Up to Astra
</a>

## B - Sign Up

You can use your `Github`, `Google` accounts or register with an `email`.

### 1. Sign In with Github

???+ note "Click the `[Sign In with Github]` button"

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

??? note "4️⃣ Open the mail in your inbox and validate with the `Verify my email` link"

    <img src="../../../img/astra/astra-signup-5.png" />

    - Astra will show a validation message, select **Click Here to proceed**.

    <img src="../../../img/astra/astra-signup-6.png" />

    - Select **back to application**
    <img src="../../../img/astra/astra-signup-7.png" />

??? success "5️⃣ You are redirected to the homepage"

    <img src="../../../img/astra/astra-signup-8.png" />

## C - Account and Organization

### 1. Overview

When you create an account your personal **Organization** is created, **this is your tenant**:

- The name of the organization is your email address, _(1) in the picture below_
- The unique identifier (GUID) is present in the URL on the dashboard. _(2) in the picture below_

<img src="../../../img/astra/organization-1.png" />

### 2. Organization Objects

`Databases`, `Tenants` and `Security Tokens` objects are created within the organization, as shown on the Organization Dashboard.

```mermaid
  graph TD
    User(User) -->|n..m| ORG(Organization)
    ORG(Organization) --> User(User) 
    ORG(Organization) -->|0..n| DB(Databases)
    ORG(Organization) -->|0..n| ST(Streaming Tenants)
    ORG(Organization) -->|0..n| ROLE(Roles)
    ORG(Organization) -->|0..n| TOK(Security Tokens)
    TOK(Security Tokens) -->|1..1| ROLE
    DB(Databases) -->|1..n| KEY(Keyspaces)
    KEY(Keyspaces) -->|0..n| TABLE(Tables)
    ST(Streaming Tenants) -->|1..n| NAMESPACES(Namespaces)
    NAMESPACES(Namespaces) -->|0..n| TOPICS(Topics)
```

<img src="../../../img/astra/organization-3.png" />

### 3. Multiple Organizations

You can create multiple organizations through the **`Manage Organizations`** menu option and invite other users to join as well. It is useful when the same database could be accessed by multiple users with different emails.

<img src="../../../img/astra/organization-2.png" />

As a consequence a user can be part of multiple organizations; the personal organization created during registration, new user-defined organizations, and shared organizations.

```mermaid
  graph TD
    USER(User) -->|1..n| PORG(Personal Organization - registration)
    USER -->|0..n| CORG(Organizations he created)
    USER -->|0...n| IORG(Organizations he was invited to)
```
