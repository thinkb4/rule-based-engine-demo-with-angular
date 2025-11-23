import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { JOB_STATES, JOB_TYPES, JobState, JobType } from '@/app/shared/domain/job.model';
import { computeVmDecisionTable } from './decision-table.vm';
import { NgComponentOutlet } from '@angular/common';
import type { Type } from '@angular/core';
import type { JobStatePanel } from '@/app/shared/ui/job-state-panels';
import { selectPanelByRules } from './decision-table.panel';

@Component({
  standalone: true,
  selector: 'app-decision-table-page',
  imports: [NgComponentOutlet],
  templateUrl: './decision-table.page.html',
  styleUrls: ['./decision-table.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionTablePage {
  readonly types = JOB_TYPES;
  readonly states = JOB_STATES;

  readonly type = signal<JobType>(JobType.Standard);
  readonly state = signal<JobState>(JobState.Idle);

  readonly vm = computed(() => computeVmDecisionTable(this.type(), this.state()));
  readonly panelComponent = computed<Type<JobStatePanel>>(() => selectPanelByRules(this.type(), this.state()));

  onSelectType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }
  onSelectState(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobState;
    this.state.set(value);
  }
}