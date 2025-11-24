import { Type } from '@angular/core';
import { JobState } from '@/app/shared/domain/job.model';

// Import concrete, standalone presentational components
import { IdlePanelComponent } from '@/app/components/job-state-panels/idle-panel.component';
import { RunningPanelComponent } from '@/app/components/job-state-panels/running-panel.component';
import { ReadyPanelComponent } from '@/app/components/job-state-panels/ready-panel.component';
import { FailedPanelComponent } from '@/app/components/job-state-panels/failed-panel.component';

// Re-export them so features can import from this barrel (keeps call-sites tidy)
export { IdlePanelComponent } from '@/app/components/job-state-panels/idle-panel.component';
export { RunningPanelComponent } from '@/app/components/job-state-panels/running-panel.component';
export { ReadyPanelComponent } from '@/app/components/job-state-panels/ready-panel.component';
export { FailedPanelComponent } from '@/app/components/job-state-panels/failed-panel.component';

/**
 * Union type of our presentational state panels.
 * (Instance types are fine for Type<T> usage given they’re standalone.)
 */
export type JobStatePanel =
  | IdlePanelComponent
  | RunningPanelComponent
  | ReadyPanelComponent
  | FailedPanelComponent;

/**
 * Maps a domain state to its corresponding presentational component.
 * This is intentionally dumb: no logic inside panels; all decisions outside.
 */
export const JOB_STATE_PANELS: Record<JobState, Type<JobStatePanel>> = {
  [JobState.Idle]: IdlePanelComponent,
  [JobState.Running]: RunningPanelComponent,
  [JobState.Ready]: ReadyPanelComponent,
  [JobState.Failed]: FailedPanelComponent,
};

/**
 * Convenience list for importing all 4 panels in a module/feature if needed.
 */
export const JOB_STATE_PANEL_IMPORTS = [
  IdlePanelComponent,
  RunningPanelComponent,
  ReadyPanelComponent,
  FailedPanelComponent,
] as const;

/**
 * Given a state, return the corresponding presentational component type.
 * @param s - domain state
 * @returns standalone component to render
 */
export function panelForState(s: JobState): Type<JobStatePanel> {
  return JOB_STATE_PANELS[s];
}