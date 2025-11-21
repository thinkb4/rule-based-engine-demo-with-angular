import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';

type JobType = 'standard' | 'premium';
type JobState = 'idle' | 'running' | 'ready' | 'failed';

type PrimaryAction =
  | { kind: 'start'; label: string }
  | { kind: 'view'; label: string }
  | { kind: 'retry'; label: string }
  | { kind: 'none'; label: string };

type ViewModel = {
  header: string;
  flags: {
    showIdle: boolean;
    showRunning: boolean;
    showReady: boolean;
    showFailed: boolean;
  };
  action: PrimaryAction;
};

/** Helper to avoid control-flow narrowing complaints in our anti-pattern demo */
function isState(s: JobState, expected: JobState): boolean {
  return s === expected;
}

export function computeVmBranching(type: JobType, state: JobState): ViewModel {
  // Intentionally verbose / poorly structured to illustrate the anti-pattern
  let header = '';
  let showIdle = false;
  let showRunning = false;
  let showReady = false;
  let showFailed = false;
  let action: PrimaryAction = { kind: 'none', label: 'No action' };

  if (state === 'idle' || state === 'running' || state === 'ready' || state === 'failed') {
    if (state === 'idle') {
      showIdle = true;
      if (type === 'standard') {
        header = 'Standard job is idle';
        action = { kind: 'start', label: 'Start Standard' };
      } else {
        if (type === 'premium') {
          header = 'Premium job is idle';
          if (!isState(state, 'running')) {
            action = { kind: 'start', label: 'Start Premium' };
          } else {
            action = { kind: 'none', label: 'Wait...' };
          }
        }
      }
    } else {
      if (state === 'running') {
        showRunning = true;
        if (type === 'premium') {
          header = 'Premium is processing';
          action = { kind: 'none', label: 'Processing…' };
        } else {
          if (type === 'standard') {
            header = 'Standard is processing';
            // Intentionally pointless check kept via helper to avoid TS "no overlap" error
            if (isState(state, 'ready')) {
              action = { kind: 'view', label: 'Open Result' };
            } else {
              action = { kind: 'none', label: 'Processing…' };
            }
          }
        }
      } else if (state === 'ready') {
        showReady = true;
        if (type === 'premium') {
          header = 'Premium result ready';
          action = { kind: 'view', label: 'Open Result' };
        } else if (type === 'standard') {
          header = 'Standard result ready';
          if (!isState(state, 'failed')) {
            action = { kind: 'view', label: 'Open Result' };
          } else {
            action = { kind: 'retry', label: 'Retry' };
          }
        }
      } else {
        if (state === 'failed') {
          showFailed = true;
          if (type === 'premium') {
            header = 'Premium failed';
            action = { kind: 'retry', label: 'Retry' };
          } else {
            if (type === 'standard') {
              header = 'Standard failed';
              // Another intentionally pointless check hidden from control-flow analysis
              if (isState(state, 'idle')) {
                action = { kind: 'start', label: 'Start Standard' };
              } else {
                action = { kind: 'retry', label: 'Retry' };
              }
            }
          }
        }
      }
    }
  }

  if (!header) {
    header = 'Unknown state';
  }

  return {
    header,
    flags: { showIdle, showRunning, showReady, showFailed },
    action,
  };
}

@Component({
  standalone: true,
  selector: 'app-branching-page',
  imports: [],
  templateUrl: './branching.page.html',
  styleUrls: ['./branching.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchingPage {
  readonly types: readonly JobType[] = ['standard', 'premium'] as const;
  readonly states: readonly JobState[] = ['idle', 'running', 'ready', 'failed'] as const;

  readonly type = signal<JobType>('standard');
  readonly state = signal<JobState>('idle');

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