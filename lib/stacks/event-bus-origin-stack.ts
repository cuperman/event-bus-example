import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';

import * as constructs from '../constructs';

export interface EventBusEnvironment {
  readonly account: string;
  readonly region: string;
}

export interface EventBusOriginStackProps extends cdk.StackProps {
  readonly eventBusName: string;
  readonly replicaEnvironments: EventBusEnvironment[];
}

export class EventBusOriginStack extends cdk.Stack {
  public eventBus: events.IEventBus;

  constructor(scope: cdk.Construct, id: string, props: EventBusOriginStackProps) {
    super(scope, id, props);

    this.eventBus = new events.EventBus(this, 'EventBus', {
      eventBusName: props.eventBusName
    });

    new constructs.EventLogger(this, 'EventLogger', {
      eventBus: this.eventBus,
      eventPattern: {
        account: [cdk.Aws.ACCOUNT_ID]
      }
    });

    // Send events to replica environments
    props.replicaEnvironments.forEach((env) => {
      new events.Rule(this, `ReplicateEvents-${env.account}-${env.region}`, {
        eventBus: this.eventBus,
        // all events
        eventPattern: {
          account: [cdk.Aws.ACCOUNT_ID]
        },
        targets: [
          new constructs.EventBusTarget({
            account: env.account,
            region: env.region,
            eventBusName: this.eventBus.eventBusName
          })
        ]
      });
    });
  }
}
