import { deriveFacts } from './job.facts';
import { JobState, JobType } from './job.model';

describe('deriveFacts', () => {
  it('returns correct derived flags', () => {
    const f = deriveFacts(JobType.Premium, JobState.Running);
    expect(f.isPremium).toBe(true);
    expect(f.isStandard).toBe(false);
    expect(f.isRunning).toBe(true);
    expect(f.isIdle).toBe(false);
    expect(f.isReady).toBe(false);
    expect(f.isFailed).toBe(false);
  });
});