{{ ossHeader }}

## Getting Started

This repository shows how to bundle the Momento nodejs sdk with the compression plugin inside an AWS lambda function.

Building with esbuild
```bash
npm i
npm run build
AWS_PROFILE=dev aws lambda update-function-code --function-name <function name> --zip-file fileb://function.zip
AWS_PROFILE=dev aws lambda invoke --function-name <function name> --log-type Tail result.json | jq -r .LogResult | base64 -d
```

Building with SAM
```bash
npm i
sam build
sam deploy
```

{{ ossFooter }}
