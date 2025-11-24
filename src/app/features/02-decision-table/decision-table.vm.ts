import { ActionKind, JobState, JobType, PrimaryAction, ViewModel, NO_ACTION } from '@/app/shared/domain/job.model';
import { deriveFacts } from '@/app/shared/domain/job.facts';
import { pickByRules } from '@/app/shared/rules/decision-table';

/**
 * Classic decision-table VM builder (first match wins).
 * Facts are derived once; rules stay declarative and predictable.
 *
 * @see https://en.wikipedia.org/wiki/Decision_table
 */
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
      { when: d.isReady, value: { kind: ActionKind.View, label: 'Open Result' } as const },
      { when: d.isRunning, value: { kind: ActionKind.None, label: 'Processing…' } as const },
      { when: d.isIdle && d.isStandard, value: { kind: ActionKind.Start, label: 'Start Standard' } as const },
      { when: d.isIdle && d.isPremium, value: { kind: ActionKind.Start, label: 'Start Premium' } as const },
      { when: d.isFailed, value: { kind: ActionKind.Retry, label: 'Retry' } as const },
    ],
    NO_ACTION,
  );

  return {
    header,
    flags: {
      showIdle: d.isIdle,
      showRunning: d.isRunning,
      showReady: d.isReady,
      showFailed: d.isFailed,
    },
    action,
  };
}