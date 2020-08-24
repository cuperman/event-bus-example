import * as cdk from '@aws-cdk/core';
import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as targets from '@aws-cdk/aws-events-targets';

export interface EventLoggerProps {
  readonly eventBus: events.IEventBus;
  readonly eventPattern: events.EventPattern;
}

export class EventLogger extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: EventLoggerProps) {
    super(scope, id);

    const eventLogHandler = new lambda.Function(this, 'EventLogHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromInline(`
          async function handler(event) {
            console.log('event received', event);
          }
          exports.handler = handler;
        `),
      handler: 'index.handler'
    });

    new events.Rule(this, 'EventLogRule', {
      eventBus: props.eventBus,
      eventPattern: props.eventPattern,
      targets: [new targets.LambdaFunction(eventLogHandler)]
    });
  }
}
