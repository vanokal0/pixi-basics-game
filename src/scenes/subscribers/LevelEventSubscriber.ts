export interface LevelEventSubscriber {
  notify(event: string): void;
}
