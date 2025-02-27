import { LevelEventSubscriber } from "../subscribers/LevelEventSubscriber";

export class LevelEventChannel {
  private eventSubscriberMap: Map<string, Array<LevelEventSubscriber>>;
  constructor() {
    this.eventSubscriberMap = new Map<string, Array<LevelEventSubscriber>>();
  }

  subscribe(event: string, subscriber: LevelEventSubscriber): void {
    if (!this.eventSubscriberMap.has(event)) {
      this.eventSubscriberMap.set(event, new Array<LevelEventSubscriber>());
    }
    this.eventSubscriberMap.get(event)!.push(subscriber);
  }

  unsubscribe(event: string, subscriber: LevelEventSubscriber): void {
    if (!this.eventSubscriberMap.has(event)) return;
    this.eventSubscriberMap.set(
      event,
      this.eventSubscriberMap.get(event)!.filter((s) => s !== subscriber)
    );
  }

  publish(event: string): void {
    if (!this.eventSubscriberMap.has(event)) return;
    this.eventSubscriberMap.get(event)?.forEach((sub) => sub.notify(event));
  }
}
