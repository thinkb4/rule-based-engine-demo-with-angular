import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-job-panel-running',
  template: `<div class="panel running">🟨 Running Panel — processing…</div>`,
  styles: [`
    .panel { padding: 12px; border-radius: 8px; border: 1px solid #ddd; }
    .running { background: #fff8e1; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RunningPanelComponent {}