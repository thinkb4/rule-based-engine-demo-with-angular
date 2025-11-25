# Rule-Based Engine Demo (Pure Angular, Angular 19)

A training exercise that shows **four different ways** to implement the **same UI decision problem**—from a brittle, nested branching approach to a data-driven rule engine and finally a finite-state machine (FSM).

 Each view also **chooses a presentational component at runtime** using its respective decision mechanism. This makes the benefits (or pain) of each approach visible beyond simple string/CTA selection.

## Use Case: “Job Processing” UI

**Imagine** we’re building a small UI for a background “job processing” system. A user can start a job, watch it run, see when it’s ready, or recover from a failure. We support two **job types**—`standard` and `premium`—and a lifecycle with four **states**: `idle`, `running`, `ready`, and `failed`.

Each screen computes a **view-model** with:

- A **header** describing the situation (e.g., “Premium is processing”)
- A **primary action** (button intent): **start**, **view**, **retry**, or **none**
- A **runtime-selected panel** (pure, presentational component) that visually reflects the state

We implement the same business rules in four different ways to compare ergonomics, testability, and clarity.

## Business Rules (shared across pages)

### Header (mapping from `(state, type)`)

- `idle`   -> “{Standard|Premium} job is idle”
- `running`-> “{Standard|Premium} is processing”
- `ready`  -> “{Standard|Premium} result ready”
- `failed` -> “{Standard|Premium} failed”

### Primary Action (priority order)

1. If `ready`  -> **view** (“Open Result”)
2. Else if `running` -> **none** (“Processing…”)  
3. Else if `idle` -> **start** (“Start Standard” or “Start Premium”)
4. Else if `failed` -> **retry** (“Retry”)
5. Else -> **none** (“No action”)

### FSM Transitions (used by View 4)

- `idle --start--> running`
- `running --complete--> ready`
- `running --fail--> failed`
- `failed --reset--> idle`
- `ready --reset--> idle`

> By design, **`fail` is only allowed from `running`** in the strict FSM; the UI disables invalid buttons preventing illegal transitions.

## The Four Implementations

1) **Anti-pattern (Branching Hell)** — `features/01-branching-anti-pattern`  
   - Deeply nested `if/else` with duplicated checks and hidden priorities.  
   - Hard to reason about, easy to introduce dead code.  
   - **Runtime component choosing:** panel is picked with the same tangled branching (`selectPanelBranching`).

2) **Rule-based (Decision Table)** — `features/02-decision-table`  
   - A small helper (`pickByRules`) evaluates **ordered rules** (`{ when, value }`) with **first-match-wins**.  
   - Facts are derived once; policy is a declarative array of rules.  
   - **Runtime component choosing:** panel is picked by **rules** as well (`selectPanelByRules`).

3) **Improved Rule Engine** — `features/03-decision-table-improved`  
   - `decideWithCtx(ctx, rules, fallback)` supports **explicit priorities**, **lazy values**, **trace output**, and **Angular DI tokens** to register rules via `multi: true`.  
   - Enables modular policy contributions from multiple features.  
   - **Runtime component choosing:** a **DI-backed rule set** selects which component to render (`PANEL_RULES` + `decideWithCtx`). A separate `JobPanelFallbackComponent` is used as the fallback.

4) **FSM Alternative** — `features/04-fsm-alternative`  
   - Explicit **states** and **events** with a small `step()` runner and a pure `(state, type) -> view-model` mapping.  
   - UI enables only allowed events; disallowing illegal transitions.  
   - **Runtime component choosing:** a simple **state -> component map** (`panelForState`) returns the presentational component.

## Runtime Component Selection (Presentational Panels)

All views render one of four **presentational** components (no logic inside) to make state transitions visible:

- `IdlePanelComponent`
- `RunningPanelComponent`
- `ReadyPanelComponent`
- `FailedPanelComponent`

These are exported via the shared barrel: `@/app/shared/ui/job-state-panels` and rendered using Angular’s `*ngComponentOutlet`.

### How each view chooses the component

- **View 1 (Branching):** `selectPanelBranching(type, state)` mirrors the nested `if/else` anti-pattern.  
- **View 2 (Decision Table):** `selectPanelByRules(type, state)` uses the same `pickByRules` helper as the VM.  
- **View 3 (Improved):** DI-powered `PANEL_RULES` + `decideWithCtx` picks a component by **priority** and **context**. A separate `JobPanelFallbackComponent` is used as the fallback.  
- **View 4 (FSM):** `panelForState(state)` is a direct map from `JobState` to component.

### Why this matters

- Shows that data/decision policy can **drive real UI**, not just strings.  
- Keeps presentational components **dumb** and highly reusable.  
- Demonstrates different ways to avoid `if/else` soup when selecting UI.

### Important detail: don’t accidentally **call** component classes

Our decision helpers allow `value` to be either a **literal** or a **factory function**. Angular components are class constructors (functions), so we must **not** invoke them. We added a shared guard to only call **true** factories:

- `isFactoryFunction` (in `@/app/shared/utils/invocation-guards`) returns `true` only for non-Angular, non-class functions.  
- Both `pickByRules` and `decideWithCtx` use this guard to avoid the classic error: **“Class constructor X cannot be invoked without 'new'.”**

### Optional: lazy-load panels

The four panels are small, but in real apps you can lazy-load heavy panels (standalone components) via dynamic `import()` and return the component type once resolved.

> Tip: if panels become very similar, consider a single configurable component with `@Input()`s instead of four separate classes.

## Getting Started

```bash
npm ci
npm start
# open http://localhost:4200
```

### Run tests

```bash
npm test
npm run test:watch
```

## Key Ideas

- **Decision Table (data-driven CoR):** Encode policy as ordered rules; **first match wins**. Easy to read and test.
- **Improved Engine:** Add priorities, typed context, tracing, and DI-based rule registration for modularity.
- **FSM:** Prefer when the domain is a strict lifecycle with mutually exclusive states and event-driven transitions.
- **Runtime UI selection:** The same decision mechanism that builds the VM can also pick **which component to render**.

## Extending This Demo

- Add new job types or states and update the rules (Views 2–3) or transitions (View 4).
- Contribute rules via DI tokens in the Improved Engine without editing a central “god” file.
- Use the FSM when you need invariants like “this event cannot happen from that state”.
- Replace the four panels with a single configurable one if they start to drift only in visuals.

## What to Look For

- How easily can you add or change a rule?
- Is priority clear and testable?
- Can features contribute policy without merge conflicts?
- Does the UI reflect allowed/blocked actions (especially in the FSM view)?
- Is it straightforward to swap out the presentational component based on policy?

## References

- [Angular Signals](https://angular.dev/guide/signals)  
- [NgComponentOutlet](https://angular.dev/api/common/NgComponentOutlet)  
- [Dependency Injection & Multi Providers](https://angular.dev/guide/di/defining-dependency-providers#multiple-providers)  
- [Decision Tables](https://en.wikipedia.org/wiki/Decision_table)  
- [Chain of Responsibility - Refactoring Guru](https://refactoring.guru/design-patterns/chain-of-responsibility)
- [State Pattern - Refactoring Guru](https://refactoring.guru/design-patterns/state)
- [State Pattern - Wikipedia](https://en.wikipedia.org/wiki/State_pattern)
- [Finite-State Machines](https://en.wikipedia.org/wiki/Finite-state_machine)
- [An introduction to finite state machines and the state pattern for game development](https://youtu.be/-ZP2Xm-mY4E?si=bjbA_WAakJgjjXbY)
