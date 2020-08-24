# Event demo

A demo of replicating events across multiple accounts.

Reference: https://docs.aws.amazon.com/eventbridge/latest/userguide/eventbridge-cross-account-event-delivery.html

## Deployment

Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run cdk -- deploy` deploy this stack to your default AWS account/region
- `npm run cdk -- diff` compare deployed stack with current state
- `npm run cdk -- synth` emits the synthesized CloudFormation template

Deploying the stacks

```bash
npm run cdk -- synth
npm run cdk -- list

npm run cdk -- --profile origin-account deploy EventBusOrigin
npm run cdk -- --profile replica-account deploy EventBusReplica-622230865285-us-east-1
```

## Test

Send test events

```bash
events put-events --profile origin-account --entries file://event.json
```
