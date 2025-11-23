import { ActionKind, JobState, JobType, PrimaryAction, ViewModel } from '@/app/shared/domain/job.model';

function isState(s: JobState, expected: JobState): boolean {
  return s === expected;
}

export function computeVmBranching(type: JobType, state: JobState): ViewModel {
  let header = '';
  let showIdle = false;
  let showRunning = false;
  let showReady = false;
  let showFailed = false;
  let action: PrimaryAction = { kind: ActionKind.None, label: 'No action' };

  if (state === JobState.Idle || state === JobState.Running || state === JobState.Ready || state === JobState.Failed) {
    if (state === JobState.Idle) {
      showIdle = true;
      if (type === JobType.Standard) {
        header = 'Standard job is idle';
        action = { kind: ActionKind.Start, label: 'Start Standard' };
      } else {
        if (type === JobType.Premium) {
          header = 'Premium job is idle';
          if (!isState(state, JobState.Running)) {
            action = { kind: ActionKind.Start, label: 'Start Premium' };
          } else {
            action = { kind: ActionKind.None, label: 'Wait...' };
          }
        }
      }
    } else {
      if (state === JobState.Running) {
        showRunning = true;
        if (type === JobType.Premium) {
          header = 'Premium is processing';
          action = { kind: ActionKind.None, label: 'Processing…' };
        } else {
          if (type === JobType.Standard) {
            header = 'Standard is processing';
            if (isState(state, JobState.Ready)) {
              action = { kind: ActionKind.View, label: 'Open Result' };
            } else {
              action = { kind: ActionKind.None, label: 'Processing…' };
            }
          }
        }
      } else if (state === JobState.Ready) {
        showReady = true;
        if (type === JobType.Premium) {
          header = 'Premium result ready';
          action = { kind: ActionKind.View, label: 'Open Result' };
        } else if (type === JobType.Standard) {
          header = 'Standard result ready';
          if (!isState(state, JobState.Failed)) {
            action = { kind: ActionKind.View, label: 'Open Result' };
          } else {
            action = { kind: ActionKind.Retry, label: 'Retry' };
          }
        }
      } else {
        if (state === JobState.Failed) {
          showFailed = true;
          if (type === JobType.Premium) {
            header = 'Premium failed';
            action = { kind: ActionKind.Retry, label: 'Retry' };
          } else {
            if (type === JobType.Standard) {
              header = 'Standard failed';
              if (isState(state, JobState.Idle)) {
                action = { kind: ActionKind.Start, label: 'Start Standard' };
              } else {
                action = { kind: ActionKind.Retry, label: 'Retry' };
              }
            }
          }
        }
      }
    }
  }

  if (!header) header = 'Unknown state';

  return {
    header,
    flags: { showIdle, showRunning, showReady, showFailed },
    action,
  };
}