import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { pickByRules } from './rules/decision-table';

type JobType = 'standard' | 'premium';
type JobState = 'idle' | 'running' | 'ready' | 'failed';

type PrimaryAction =
  | { kind: 'start'; label: string }
  | { kind: 'view'; label: string }
  | { kind: 'retry'; label: string }
  | { kind: 'none'; label: string };

type ViewModel = {
  header: string;
  flags: { showIdle: boolean; showRunning: boolean; showReady: boolean; showFailed: boolean };
  action: PrimaryAction;
};

function deriveFacts(type: JobType, state: JobState) {
  return {
    isStandard: type === 'standard',
    isPremium: type === 'premium',
    isIdle: state === 'idle',
    isRunning: state === 'running',
    isReady: state === 'ready',
    isFailed: state === 'failed',
  } as const;
}

export function computeVmDecisionTable(type: JobType, state: JobState): ViewModel {
  const d = deriveFacts(type, state);

  const header = pickByRules<string>(
    [
      { when: d.isIdle && d.isStandard, value: 'Standard job is idle' },
      { when: d.isIdle && d.isPremium, value: 'Premium job is idle' },
      { when: d.isRunning && d.isStandard, value: 'Standard is processing' },
      { when: d.isRunning && d.isPremium, value: 'Premium is processing' },
      { when: d.isReady && d.isStandard, value: 'Standard result ready' },
      { when: d.isReady && d.isPremium, value: 'Premium result ready' },
      { when: d.isFailed && d.isStandard, value: 'Standard failed' },
      { when: d.isFailed && d.isPremium, value: 'Premium failed' },
    ],
    'Unknown state',
  );

  const action = pickByRules<PrimaryAction>(
    [
      { when: d.isReady, value: { kind: 'view', label: 'Open Result' } as const },
      { when: d.isRunning, value: { kind: 'none', label: 'Processing…' } as const },
      { when: d.isIdle && d.isStandard, value: { kind: 'start', label: 'Start Standard' } as const },
      { when: d.isIdle && d.isPremium, value: { kind: 'start', label: 'Start Premium' } as const },
      { when: d.isFailed, value: { kind: 'retry', label: 'Retry' } as const },
    ],
    { kind: 'none', label: 'No action' } as const,
  );

  return {
    header,
    flags: { showIdle: d.isIdle, showRunning: d.isRunning, showReady: d.isReady, showFailed: d.isFailed },
    action,
  };
}

@Component({
  standalone: true,
  selector: 'app-decision-table-page',
  imports: [],
  templateUrl: './decision-table.page.html',
  styleUrls: ['./decision-table.page.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DecisionTablePage {
  readonly types: readonly JobType[] = ['standard', 'premium'] as const;
  readonly states: readonly JobState[] = ['idle', 'running', 'ready', 'failed'] as const;

  readonly type = signal<JobType>('standard');
  readonly state = signal<JobState>('idle');

  readonly vm = computed(() => computeVmDecisionTable(this.type(), this.state()));

  onSelectType(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobType;
    this.type.set(value);
  }

  onSelectState(e: Event): void {
    const value = (e.target as HTMLSelectElement).value as JobState;
    this.state.set(value);
  }
}