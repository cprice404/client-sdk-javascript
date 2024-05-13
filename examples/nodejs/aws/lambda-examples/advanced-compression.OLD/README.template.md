{{ ossHeader }}

# Momento Node.js SDK - AWS Lambda Advanced (`zstd`) Compression Example

## What's this example all about?

Enabling compression in the Momento SDK can result in significant reductions in bandwidth consumption and costs, if your cache values are, for example, large text strings (such as JSON objects). The default Momento compression extensions library (`@gomomento/sdk-nodejs-compression`) uses the `zlib` library, which is built-in to the Node.js standard library, so it doesn't require any special packaging considerations when running in a lambda environment.

For advanced use cases, the `@gomomento/sdk-nodejs-compression-zstd` library offers support for compression via `zstd`, which can offer some amount of performance benefits for especially large payloads (100kb or more). However, this extension relies on a native binary that must match the architecture of your target deployment environment, so it requires some special packaging considerations.

Unless you are certain that the extra performance is important, we recommend that you stick with the simpler `@gomomento/sdk-nodejs-compression` package. For advanced use cases, this directory contains an example of how to deploy the `@gomomento/sdk-nodejs-compression-zstd` dependency in your lambda.

The key element to note in this example project is the code in the esbuild.ts file that provides special handling for the `.node` directory. This `.node` directory is where the `npm` build will place the native `zstd` binary, and it must be included in the lambda deployment package.

NOTE: this binary will increase the size of your deployed lambda by approximately 1MB.

```typescript
// If a ".node" file is imported within a module in the "node-file" namespace, put
// it in the "file" namespace where esbuild's default loading behavior will handle
// it. It is already an absolute path since we resolved it to one above.
build.onResolve({ filter: /\.node$/, namespace: 'node-file' }, args => ({
    path: args.path,
    namespace: 'file',
}))

// Tell esbuild's default loading behavior to use the "file" loader for
// these ".node" files.
let opts = build.initialOptions
opts.loader = opts.loader || {}
opts.loader['.node'] = 'file'
```

## Building the Example

To build and deploy the lambda directly via `esbuild`, and deploy via the `aws` cli:

```bash
npm i
npm run build
aws lambda update-function-code --function-name <function name> --zip-file fileb://function.zip
aws lambda invoke --function-name <function name> --log-type Tail result.json | jq -r .LogResult | base64 -d
```

To build and deploy the lambda via AWS `sam`:

```bash
npm i
sam build
sam deploy
```

{{ ossFooter }}
