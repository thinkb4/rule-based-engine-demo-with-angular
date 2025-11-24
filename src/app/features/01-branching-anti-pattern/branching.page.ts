import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JOB_STATES, JOB_TYPES, JobState, JobType } from '@/app/shared/domain/job.model';
import { computeVmBranching } from './vm/branching.vm';
import { NgComponentOutlet } from '@angular/common';
import type { Type } from '@angular/core';
import type { JobStatePanel } from '@/app/shared/ui/job-state-panels';
import { selectPanelBranching } from './panel/branching.panel';

/**
 * Branching anti-pattern page.
 * This exists to make the downsides of nested conditionals concrete and visible.
 */
@Component({
  standalone: true,
  selector: 'app-branching-page',
  imports: [NgComponentOutlet],
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
  readonly panelComponent = computed<Type<JobStatePanel>>(() => selectPanelBranching(this.type(), this.state()));

  onSelectType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }
  onSelectState(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobState;
    this.state.set(value);
  }
}