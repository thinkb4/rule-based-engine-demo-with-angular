import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FsmEvent, JobType, State, transitions, vmFrom } from './fsm/config';
import { step } from './fsm/engine';

@Component({
  standalone: true,
  selector: 'app-fsm-page',
  imports: [],
  templateUrl: './fsm.page.html',
  styleUrls: ['./fsm.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsmPage {
  readonly types: readonly JobType[] = ['standard', 'premium'] as const;
  readonly type = signal<JobType>('standard');

  readonly state = signal<State>('idle');
  readonly vm = computed(() => vmFrom(this.state(), this.type()));

  /** Allowed events from the current state (derived from the transition table). */
  readonly allowed = computed<readonly FsmEvent[]>(() =>
    transitions.filter(t => t.from === this.state()).map(t => t.event)
  );

  can(e: FsmEvent): boolean {
    return this.allowed().includes(e);
  }

  /** DOM change event from the <select>. */
  onType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }

  /** FSM event dispatch. If not allowed, it's a no-op (buttons are disabled anyway). */
  dispatch(e: FsmEvent): void {
    if (!this.can(e)) {
      return;
    }
    const next = step(this.state(), e, transitions);
    this.state.set(next);
  }
}