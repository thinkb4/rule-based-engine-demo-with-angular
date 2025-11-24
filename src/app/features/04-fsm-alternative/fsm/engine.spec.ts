import { step, type Transition } from './engine';

type S = 'idle' | 'running' | 'ready' | 'failed';
type E = 'start' | 'complete' | 'fail' | 'reset';

const transitions: ReadonlyArray<Transition<S, E>> = [
  { from: 'idle',    event: 'start',    to: 'running' },
  { from: 'running', event: 'complete', to: 'ready' },
  { from: 'running', event: 'fail',     to: 'failed' },
  { from: 'failed',  event: 'reset',    to: 'idle' },
  { from: 'ready',   event: 'reset',    to: 'idle' },
];

describe('FSM engine step()', () => {
  it('moves along a matching transition', () => {
    expect(step('idle', 'start', transitions)).toBe('running');
    expect(step('running', 'complete', transitions)).toBe('ready');
  });

  it('is a no-op if transition not allowed', () => {
    expect(step('idle', 'complete', transitions)).toBe('idle');
  });
});