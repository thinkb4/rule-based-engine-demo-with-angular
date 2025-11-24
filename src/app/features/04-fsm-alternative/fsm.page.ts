import { ChangeDetectionStrategy, Component, computed, signal, Type } from '@angular/core';
import { JOB_TYPES, JobState, JobType } from '@/app/shared/domain/job.model';
import { FsmEvent, transitions, vmFrom } from './fsm/config';
import { step } from './fsm/engine';
import { NgComponentOutlet } from '@angular/common';
import { panelForState, JobStatePanel } from '@/app/shared/ui/job-state-panels';

/**
 * FSM demo: explicit states/events and a pure mapping to the VM.
 * The panel is selected directly from the current state via a simple map.
 *
 * @see https://en.wikipedia.org/wiki/Finite-state_machine
 */
@Component({
  standalone: true,
  selector: 'app-fsm-page',
  imports: [NgComponentOutlet],
  templateUrl: './fsm.page.html',
  styleUrls: ['./fsm.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsmPage {
  /** Visible enums for the template. */
  readonly types = JOB_TYPES;
  readonly FsmEvent = FsmEvent;

  /** The FSM state and selected type. */
  readonly type = signal<JobType>(JobType.Standard);
  readonly state = signal<JobState>(JobState.Idle);

  /** VM is a pure function of (state, type). */
  readonly vm = computed(() => vmFrom(this.state(), this.type()));

  /**
   * Allowed events from the current state (derived from the transition table).
   * We use this to enable/disable the four buttons.
   */
  readonly allowed = computed<readonly FsmEvent[]>(() =>
    transitions.filter(t => t.from === this.state()).map(t => t.event)
  );

  /** Quick guard used by the template to disable illegal transitions. */
  can(e: FsmEvent): boolean { return this.allowed().includes(e); }

  /** Panel is a direct map of state -> presentational component. */
  readonly panelComponent = computed<Type<JobStatePanel>>(
    () => panelForState(this.state())
  );

  /** DOM change event from the <select>. */
  onType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }

  /** Dispatch an event to the FSM; illegal transitions are a no-op here. */
  dispatch(e: FsmEvent): void {
    if (!this.can(e)) return;
    const next = step(this.state(), e, transitions);
    this.state.set(next);
  }
}