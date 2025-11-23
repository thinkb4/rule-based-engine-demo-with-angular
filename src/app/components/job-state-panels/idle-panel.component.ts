import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-job-panel-idle',
  template: `<div class="panel idle">🟦 Idle Panel — waiting to start</div>`,
  styles: [`
    .panel { padding: 12px; border-radius: 8px; border: 1px solid #ddd; }
    .idle { background: #eef5ff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdlePanelComponent {}