# Calculate zScore

## About the data
The data provided came in csv format, because is static information I converted it to JSON and transformed it to a hashed object to be able to access the information on an efficient way

On the provided data and for this excersice there is no `L = 0`. So skipped the implementation on the `calculateZ` function.

There is data for infants (0-36 months) and for children of 2-20 years. In the case of the weight the values are the same for the interval 24-36 months so I decided to merged this 2 datasets.

## About the agemos
```
Age is listed at the half month point for the entire month; for example, 1.5 months represents 1.0-1.99 months or 1.0 month up to but not including 2.0 months of age.
```

after read this I decided to ask for `months` instead of `agemos` because `agemos` is a value that can be easily calculated and verified.


## How to run the project

### Requirements

- `sam cli` https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

- Docker

### Start the project 

- Go into zcore folder and just run
```sh
sam build && sam local start-api
```

- After get a successful response on the terminal: 
```sh
Building codeuri: /Users/gustavo/Desktop/develo/zscore runtime: nodejs14.x metadata: {} architecture: x86_64 functions: ['calculateZScore']
Running NodejsNpmBuilder:NpmPack
Running NodejsNpmBuilder:CopyNpmrc
Running NodejsNpmBuilder:CopySource
Running NodejsNpmBuilder:NpmInstall
Running NodejsNpmBuilder:CleanUpNpmrc

Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Invoke Function: sam local invoke
[*] Test Function in the Cloud: sam sync --stack-name {stack-name} --watch
[*] Deploy: sam deploy --guided

Mounting calculateZScore at http://127.0.0.1:3000/calculate-z-score [GET]
You can now browse to the above endpoints to invoke your functions. You do not need to restart/reload SAM CLI while working on your functions, changes will be reflected instantly/automatically. You only need to restart SAM CLI if you update your AWS SAM template
2022-09-24 18:46:03  * Running on http://127.0.0.1:3000/ (Press CTRL+C to quit)
```

 you can use your prefered way to call the api.

```
curl --request GET \
  --url 'http://127.0.0.1:3000/calculate-z-score?attribute=weight&months=9&weight=9.7&sex=1'
```

### Query Params

- attributes: ['bmi', 'headc', 'length', 'weight', 'height']
- bmi
- headc
- weight
- height
- length
