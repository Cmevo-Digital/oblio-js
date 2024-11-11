Oblio JS Library by Cmevo Digital

# Install

```sh
yarn add oblio-js
```

# Usage

```ts
const oblioClient = new OblioApi("contact@cmevo.com","your-oblio-api-key-hash-here","RO123456");
oblioClient.createInvoice({...})
```

# How to publish a new version

1. Increase the package version
2. Publish

```sh
yarn publish
```

3. Fill in your credentials and that's it
