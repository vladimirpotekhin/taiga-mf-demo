import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiRoot, TuiTextfield } from '@taiga-ui/core';

@Component({
  selector: 'app-remoteV4-entry',
  imports: [FormsModule, TuiRoot, TuiButton, TuiTextfield],
  template: `
    <tui-root>
    <div class="remote-card remote-card--v4">
      <h2>Remote v4 (Taiga UI v4)</h2>

      <tui-textfield>
        <label tuiLabel>Sample input</label>
        <input tuiTextfield [(ngModel)]="value" />
      </tui-textfield>

      <button tuiButton appearance="primary" (click)="onSubmit()">Submit</button>

      @if (submitted) {
        <p>Submitted: {{ value }}</p>
      }
    </div>
    </tui-root>
  `,
  styles: [`
    .remote-card {
      margin: 24px;
      padding: 24px;
      border-radius: 8px;
      border: 2px solid;
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 400px;
    }
    .remote-card--v4 {
      border-color: #1976d2;
      background: #e3f2fd;
    }
    .remote-card--v4 h2 { color: #1976d2; margin: 0; }
  `],
})
export class RemoteEntryInner {
  protected value = '';
  protected submitted = false;

  protected onSubmit(): void {
    this.submitted = true;
  }
}
