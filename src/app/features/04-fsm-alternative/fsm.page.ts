import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JOB_TYPES, JobState, JobType } from '@/app/shared/domain/job.model';
import { FsmEvent, transitions, vmFrom } from './fsm/config';
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
  readonly types = JOB_TYPES;
  readonly FsmEvent = FsmEvent;

  readonly type = signal<JobType>(JobType.Standard);
  readonly state = signal<JobState>(JobState.Idle);

  readonly vm = computed(() => vmFrom(this.state(), this.type()));

  readonly allowed = computed<readonly FsmEvent[]>(() =>
    transitions.filter(t => t.from === this.state()).map(t => t.event)
  );

  can(e: FsmEvent): boolean {
    return this.allowed().includes(e);
  }

  onType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }

  dispatch(e: FsmEvent): void {
    if (!this.can(e)) return;
    const next = step(this.state(), e, transitions);
    this.state.set(next);
  }
}