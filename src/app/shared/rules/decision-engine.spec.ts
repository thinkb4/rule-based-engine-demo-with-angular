import { decideWithCtx, type Rule } from './decision-engine';

type Ctx = { a: number; b: string };

describe('decideWithCtx (improved engine)', () => {
  it('sorts by priority and returns first match', () => {
    const ctx: Ctx = { a: 10, b: 'x' };
    const rules: Rule<Ctx, string>[] = [
      { name: 'low',  priority: 10, when: (c) => c.a > 0,  value: 'low' },
      { name: 'high', priority: 50, when: (c) => c.a > 0,  value: 'high' },
      { name: 'none', priority: 0,  when: () => false,     value: 'none' },
    ];
    expect(decideWithCtx(ctx, rules, 'fb')).toBe('high');
  });

  it('supports value factories and trace collection', () => {
    const ctx: Ctx = { a: 1, b: 'k' };
    const logs: unknown[] = [];
    const rules: Rule<Ctx, string>[] = [
      { name: 'calc', priority: 10, when: (c) => !!c.b, value: (c) => `B:${c.b}` },
    ];
    const res = decideWithCtx(ctx, rules, 'fb', { collect: (s) => logs.push(s) });
    expect(res).toBe('B:k');
    expect(logs.length).toBeGreaterThan(0);
  });

  it('uses fallback (supports factory fallback) when nothing matches', () => {
    const ctx: Ctx = { a: 0, b: '' };
    expect(decideWithCtx(ctx, [], 'fb')).toBe('fb');
    expect(decideWithCtx(ctx, [], (c) => `F:${c.a}`)).toBe('F:0');
  });
});