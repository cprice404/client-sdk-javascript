{{ ossHeader }}

# Momento Node.js SDK - AWS Lambda Advanced (`zstd`) Compression Example

## What's this example all about?

Enabling compression in the Momento SDK can result in significant reductions in bandwidth consumption and costs, if your cache values are, for example, large text strings (such as JSON objects). The default Momento compression extensions library (`@gomomento/sdk-nodejs-compression`) uses the `zlib` library, which is built-in to the Node.js standard library, so it doesn't require any special packaging considerations when running in a lambda environment.

For advanced use cases, the `@gomomento/sdk-nodejs-compression-zstd` library offers support for compression via `zstd`, which can offer some amount of performance benefits for especially large payloads (100kb or more). However, this extension relies on a native binary that must match the architecture of your target deployment environment, so it requires some special packaging considerations.

Unless you are certain that the extra performance is important, we recommend that you stick with the simpler `@gomomento/sdk-nodejs-compression` package. For advanced use cases, this directory contains an example of how to deploy the `@gomomento/sdk-nodejs-compression-zstd` dependency in your lambda.

**NOTE: this binary will increase the size of your deployed lambda by approximately 1MB.**

## Packaging Notes

### `package.json`: Specifying the dependency for the target platform

The key to successfully packaging your lambda when using `@gomomento/sdk-nodejs-compression-zstd` is to make sure that you
package the appropriate native `zstd` binary for your target environment. This example project targets a Linux, x64 Lambda
runtime, but assumes that you may be building / deploying the code from MacOS or another non-linux platform.

The `zstd` binaries are installed into the `node_modules` directory by `npm`. By default, `npm` will only install the appropriate
binary for the platform that you are running the build from. To ensure that the correct binary for the target platform is
also installed, you need to explicitly reference it in the `package.json` file. In this example, this is done via
the following line in the `dependencies` section of our `package.json`:

```json
"@mongodb-js/zstd-linux-x64-gnu": "^1.2.0",
```

If you were targeting a different platform, you could specify the appropriate dependency for your target platform here instead of
the `linux-x64-gnu` version.

### `esbuild.ts`: Special handling for `.node` files

This project uses `esbuild` to create the final files that we will deploy to the lambda. `npm` installs the native binaries
into the `node_modules` with a file extension of `.node`, and by default, `esbuild` will not include these files in the
build output. Therefore we need to configure `esbuild` to include these files.

For example code on how to achieve this, see the `esbuild.ts` file. If you are using another build system besides esbuild,
you will need to take similar steps to ensure that the `.node` files are included and accessible in your final lambda package.

## Building the Example

**NOTE: the `--force` flag is necessary on the `npm install` command if you are building from a different platform than
the lambda target platform. Otherwise `npm` will error out and indicate that your platform and arch are not suitable
for the `zstd-linux-x64-gnu` dependency that is listed in the `package.json` file.**

To build and deploy the lambda directly via `esbuild`

TODO everything below this line needs updates

npm run build && sam build && AWS_PROFILE=dev sam deploy --stack-name zstd-stack --resolve-s3 --capabilities CAPABILITY_IAM --parameter-overrides MomentoApiKey=xxxx




, and deploy via the `aws` cli:

```bash
npm install --force
npm run build
aws lambda update-function-code --function-name <function name> --zip-file fileb://function.zip
aws lambda invoke --function-name <function name> --log-type Tail result.json | jq -r .LogResult | base64 -d
```

To build and deploy the lambda via AWS `sam`:

```bash
npm install --force
sam build
sam deploy
```


    Metadata:
      SkipBuild: True
      BuildMethod: esbuild
      BuildProperties:
        UseNpmCi: true
        Minify: false
        Target: "es2020"
        Sourcemap: true
        Loader:
          - ".node=copy"
        EntryPoints:
          - src/index.ts


{{ ossFooter }}
