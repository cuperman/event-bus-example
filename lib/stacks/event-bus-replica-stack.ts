import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';

import * as constructs from '../constructs';

export interface EventBusReplicaStackProps extends cdk.StackProps {
  readonly eventBusName: string;
  readonly originAccount: string;
}

export class EventBusReplicaStack extends cdk.Stack {
  public eventBus: events.IEventBus;

  constructor(scope: cdk.Construct, id: string, props: EventBusReplicaStackProps) {
    super(scope, id, props);

    this.eventBus = new events.EventBus(this, 'EventBus', {
      eventBusName: props.eventBusName
    });

    // Log all events from this account and origin account
    new constructs.EventLogger(this, 'EventLogger', {
      eventBus: this.eventBus,
      eventPattern: {
        account: [cdk.Aws.ACCOUNT_ID, props.originAccount]
      }
    });

    // Allow this account to receive events from origin account
    new events.CfnEventBusPolicy(this, 'EventBusPolicy', {
      statementId: 'OriginCanPutEvents',
      principal: props.originAccount,
      action: 'events:PutEvents',
      eventBusName: this.eventBus.eventBusName
    });
  }
}
