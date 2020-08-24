#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EventBusOriginStack, EventBusEnvironment } from '../lib/stacks/event-bus-origin-stack';
import { EventBusReplicaStack } from '../lib/stacks/event-bus-replica-stack';

const app = new cdk.App();

const eventBusName = 'MyBus';

const originEnvironment: EventBusEnvironment = {
  account: '123456789012',
  region: 'us-east-1'
};

const replicaEnvironments: EventBusEnvironment[] = [
  {
    account: '987654321098',
    region: 'us-east-1'
  }
];

new EventBusOriginStack(app, 'EventBusOrigin', {
  env: originEnvironment,
  eventBusName: eventBusName,
  replicaEnvironments: replicaEnvironments
});

replicaEnvironments.forEach((replicaEnvironment) => {
  const { account, region } = replicaEnvironment;
  new EventBusReplicaStack(app, `EventBusReplica-${account}-${region}`, {
    env: replicaEnvironment,
    eventBusName: eventBusName,
    originAccount: originEnvironment.account
  });
});
