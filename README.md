# Rule-Based Engine Demo (Pure Angular, Angular 19)

A training exercise that shows **four different ways** to implement the **same UI decision problem**—from a brittle, nested branching approach to a data-driven rule engine and finally a finite-state machine (FSM).

## Use Case: “Job Processing” UI

**Imagine** we’re building a small UI for a background “job processing” system. A user can start a job, watch it run, see when it’s ready, or recover from a failure. We support two **job types**—`standard` and `premium`—and a lifecycle with four **states**: `idle`, `running`, `ready`, and `failed`.

Each screen needs to compute a **view-model** consisting of:

- A **header** text describing what’s going on (e.g., “Premium is processing”)
- A **primary action** (button intent) such as **start**, **view**, **retry**, or **none**

We’ll implement the same business rules in four different ways to compare ergonomics, testability, and clarity.

## Business Rules (shared across pages)

### Header (mapping from `(state, type)`)

- `idle`   → “{Standard|Premium} job is idle”
- `running`→ “{Standard|Premium} is processing”
- `ready`  → “{Standard|Premium} result ready”
- `failed` → “{Standard|Premium} failed”

### Primary Action (priority order)

1. If `ready`  → **view** (“Open Result”)
2. Else if `running` → **none** (“Processing…”)
3. Else if `idle` → **start** (“Start Standard” or “Start Premium”)
4. Else if `failed` → **retry** (“Retry”)
5. Else → **none** (“No action”)

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

2) **Rule-based (Decision Table)** — `features/02-decision-table`  
   - A small helper (`pickByRules`) evaluates **ordered rules** (`{ when, value }`) with **first-match-wins**.  
   - Facts are derived once; policy is a declarative array of rules.

3) **Improved Rule Engine** — `features/03-decision-table-improved`  
   - `decideWithCtx(ctx, rules, fallback)` supports **explicit priorities**, **lazy values**, **trace output**, and **Angular DI tokens** to register rules via `multi: true`.  
   - Enables modular policy contributions from multiple features.

4) **FSM Alternative** — `features/04-fsm-alternative`  
   - Explicit **states** and **events** with a small `step()` runner and a pure `(state, type) -> view-model` mapping.  
   - UI enables only allowed events; disallowing illegal transitions.

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

## Project Layout (relevant bits)

``` bash
src/app/features/
  01-branching-anti-pattern/
  02-decision-table/
  03-decision-table-improved/
  04-fsm-alternative/
```

Use the header menu to navigate between the four views.

## Key Ideas

- **Decision Table (data-driven CoR):** Encode policy as ordered rules; **first match wins**. Easy to read and test.
- **Improved Engine:** Add priorities, typed context, tracing, and DI-based rule registration for modularity.
- **FSM:** Prefer when the domain is a strict lifecycle with mutually exclusive states and event-driven transitions.

## Extending This Demo

- Add new job types or states and update the rules (Views 2–3) or transitions (View 4).
- Contribute rules via DI tokens in the Improved Engine without editing a central “god” file.
- Use the FSM when you need invariants like “this event cannot happen from that state”.

## What to Look For

- How easily can you add or change a rule?
- Is priority clear and testable?
- Can features contribute policy without merge conflicts?
- Does the UI reflect allowed/blocked actions (especially in the FSM view)?

Happy exploring!
