import * as events from '@aws-cdk/aws-events';

export interface EventBusTargetProps {
  readonly account: string;
  readonly region: string;
  readonly eventBusName: string;
}

export class EventBusTarget implements events.IRuleTarget {
  public readonly account: string;
  public readonly region: string;
  public readonly eventBusName: string;

  constructor(props: EventBusTargetProps) {
    this.account = props.account;
    this.region = props.region;
    this.eventBusName = props.eventBusName;
  }

  /**
   * Returns a RuleTarget that can be used to trigger this Lambda as a
   * result from an EventBridge event.
   */
  bind(rule: events.IRule, id?: string): events.RuleTargetConfig {
    return {
      id: '',
      arn: `arn:aws:events:${this.region}:${this.account}:event-bus/${this.eventBusName}`
    };
  }
}
