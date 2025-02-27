import { Targetable } from "./Targetable";

export interface Attacking {
  attack(): void;

  get activeTarget(): Targetable | undefined;
  set activeTarget(target: Targetable | undefined);

  get isAttacking(): boolean;
  get isInRange(): boolean;
}
