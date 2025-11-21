import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'anti-pattern' },

  {
    path: 'anti-pattern',
    loadComponent: () =>
      import('./features/01-branching-anti-pattern/branching.page').then(
        (m) => m.BranchingPage,
      ),
    title: 'Anti-pattern (branching hell)',
  },

  {
    path: 'rule-based',
    loadComponent: () =>
      import('./features/02-decision-table/decision-table.page').then(
        (m) => m.DecisionTablePage,
      ),
    title: 'Rule-based (decision table)',
  },

  {
    path: 'rule-based-improved',
    loadComponent: () =>
      import(
        './features/03-decision-table-improved/decision-table-advanced.page'
      ).then((m) => m.DecisionTableAdvancedPage),
    title: 'Improved rule engine',
  },

  {
    path: 'fsm-alternative',
    loadComponent: () =>
      import('./features/04-fsm-alternative/fsm.page').then((m) => m.FsmPage),
    title: 'FSM alternative',
  },
];