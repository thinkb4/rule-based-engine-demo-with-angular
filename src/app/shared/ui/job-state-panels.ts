import { Type } from '@angular/core';
import { JobState } from '@/app/shared/domain/job.model';

// Import concrete, standalone presentational components
import { IdlePanelComponent } from '@/app/components/job-state-panels/idle-panel.component';
import { RunningPanelComponent } from '@/app/components/job-state-panels/running-panel.component';
import { ReadyPanelComponent } from '@/app/components/job-state-panels/ready-panel.component';
import { FailedPanelComponent } from '@/app/components/job-state-panels/failed-panel.component';

// Re-export them so features can import from this barrel (this is for convenience only as this is an exercise)
export { IdlePanelComponent } from '@/app/components/job-state-panels/idle-panel.component';
export { RunningPanelComponent } from '@/app/components/job-state-panels/running-panel.component';
export { ReadyPanelComponent } from '@/app/components/job-state-panels/ready-panel.component';
export { FailedPanelComponent } from '@/app/components/job-state-panels/failed-panel.component';

// Union type for convenience (instance types are fine for Type<T> usage)
export type JobStatePanel =
  | IdlePanelComponent
  | RunningPanelComponent
  | ReadyPanelComponent
  | FailedPanelComponent;

export const JOB_STATE_PANELS: Record<JobState, Type<JobStatePanel>> = {
  [JobState.Idle]: IdlePanelComponent,
  [JobState.Running]: RunningPanelComponent,
  [JobState.Ready]: ReadyPanelComponent,
  [JobState.Failed]: FailedPanelComponent,
};

export const JOB_STATE_PANEL_IMPORTS = [
  IdlePanelComponent,
  RunningPanelComponent,
  ReadyPanelComponent,
  FailedPanelComponent,
] as const;

/** Helper: given a state, return its panel component type */
export function panelForState(s: JobState): Type<JobStatePanel> {
  return JOB_STATE_PANELS[s];
}