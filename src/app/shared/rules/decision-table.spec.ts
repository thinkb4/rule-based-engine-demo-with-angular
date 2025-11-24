import { pickByRules, type StaticRule } from './decision-table';

describe('pickByRules (decision table helper)', () => {
  it('returns first matching rule value (literal)', () => {
    const rules: StaticRule<string>[] = [
      { when: false, value: 'nope' },
      { when: true, value: 'hit' },
      { when: true, value: 'shadowed' },
    ];
    expect(pickByRules(rules, 'fallback')).toBe('hit');
  });

  it('invokes factories but not classes', () => {
    class C {}
    const rules = [
      { when: false, value: C },           // should be returned only if matched; not called
      { when: true, value: () => 'done' }, // factory
    ] as const;

    expect(pickByRules(rules, 'fb')).toBe('done');
  });

  it('uses fallback when nothing matches (supports factory fallback)', () => {
    const rules: StaticRule<number>[] = [{ when: false, value: 1 }];
    expect(pickByRules(rules, 5)).toBe(5);
    expect(pickByRules(rules, () => 7)).toBe(7);
  });
});