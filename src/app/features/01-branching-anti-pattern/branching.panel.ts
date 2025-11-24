import { Type } from '@angular/core';
import { JobState, JobType } from '@/app/shared/domain/job.model';
import {
  IdlePanelComponent,
  RunningPanelComponent,
  ReadyPanelComponent,
  FailedPanelComponent,
  JobStatePanel,
} from '@/app/shared/ui/job-state-panels';

/**
 * Deliberately branching-based panel chooser (to mirror the anti-pattern VM).
 * The redundancy here is intentional, so students can compare with rule-based versions.
 */
export function selectPanelBranching(type: JobType, state: JobState): Type<JobStatePanel> {
  // Intentionally messy branching like the anti-pattern VM
  if (state === JobState.Idle) {
    if (type === JobType.Standard) {
      return IdlePanelComponent;
    } else {
      if (type === JobType.Premium) {
        return IdlePanelComponent; // same component, but branch shows redundancy
      }
    }
  } else {
    if (state === JobState.Running) {
      if (type === JobType.Premium) {
        return RunningPanelComponent;
      } else {
        if (type === JobType.Standard) {
          return RunningPanelComponent;
        }
      }
    } else if (state === JobState.Ready) {
      if (type === JobType.Premium) {
        return ReadyPanelComponent;
      } else if (type === JobType.Standard) {
        return ReadyPanelComponent;
      }
    } else {
      if (state === JobState.Failed) {
        if (type === JobType.Premium) {
          return FailedPanelComponent;
        } else {
          if (type === JobType.Standard) {
            return FailedPanelComponent;
          }
        }
      }
    }
  }
  return IdlePanelComponent;
}