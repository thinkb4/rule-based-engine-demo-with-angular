import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JOB_STATES, JOB_TYPES, JobState, JobType } from '@/app/shared/domain/job.model';
import { computeVmBranching } from './branching.vm';

@Component({
  standalone: true,
  selector: 'app-branching-page',
  imports: [],
  templateUrl: './branching.page.html',
  styleUrls: ['./branching.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchingPage {
  readonly types = JOB_TYPES;
  readonly states = JOB_STATES;

  readonly type = signal<JobType>(JobType.Standard);
  readonly state = signal<JobState>(JobState.Idle);

  readonly vm = computed(() => computeVmBranching(this.type(), this.state()));

  onSelectType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }

  onSelectState(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobState;
    this.state.set(value);
  }
}