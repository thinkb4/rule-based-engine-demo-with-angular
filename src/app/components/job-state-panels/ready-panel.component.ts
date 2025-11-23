import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-job-panel-ready',
  template: `<div class="panel ready">🟩 Ready Panel — result available</div>`,
  styles: [`
    .panel { padding: 12px; border-radius: 8px; border: 1px solid #ddd; }
    .ready { background: #e6f7e9; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadyPanelComponent {}