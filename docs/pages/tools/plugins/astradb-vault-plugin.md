*Last Update {{ git_revision_date }}* 

<img src="../../../../img/vault/vaultlogo.png" height="50px"  />

## Overview
DataStax Astra DB Plugin for HashiCorp Vault is an open-source project that adds robust token lifecycle management features for Astra DB. Due to the nature of the Astra DB object hierarchy, by default, API tokens are not associated with specific users and currently the tokens do not have metadata descriptions.

For more details, see the full [Astra DB Plugin for HashiCorp Vault documentation](https://github.com/datastax/vault-plugin-secrets-datastax-astra/blob/main/docs/index.md) in the plugin’s open-source GitHub repo.

Without the plugin, it’s easy to lose track of:

- Who created tokens
- The purpose of each token
- Which tokens are being used actively

Consequently, there’s no audit trail of who has downloaded and used tokens, and there’s no tracking regarding who may have manually shared tokens with others.

Astra DB Plugin for HashiCorp Vault solves these security management issues. To ensure that your token ownership and usage are well understood, the plugin gives you the ability to associate metadata with tokens—such as the user who created each token, and what it is being used for. The plugin also logs who has accessed the tokens.

## What is Hashi Vault? 

[HashiCorp Vault](https://www.hashicorp.com/products/vault) is a widely-used solution across the tech industry. It’s an identity-based secrets and encryption management system. HashiCorp Vault from HashiCorp provides key-value encryption services that are gated by authentication and authorization methods. Access to tokens, secrets, and other sensitive data are securely stored, managed, and tightly controlled. Audit trails are provided. HashiCorp Vault is also extensible via a variety of interfaces, allowing plugins (including Astra DB Plugin for HashiCorp Vault) to contribute to this ecosystem.

## What's next?
See the full [Astra DB Plugin for HashiCorp Vault documentation](https://github.com/datastax/vault-plugin-secrets-datastax-astra/blob/main/docs/index.md) in the plugin’s open-source GitHub repo.