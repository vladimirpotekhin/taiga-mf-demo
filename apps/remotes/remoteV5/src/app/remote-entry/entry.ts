import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiButton, TuiInput, TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-remoteV5-entry',
  imports: [FormsModule, TuiRoot, TuiInput, TuiButton],
  template: `
    <tui-root>
      <div class="remote-card remote-card--v5">
        <h2>Remote v5 (Taiga UI v5)</h2>

        <tui-textfield>
          <label tuiLabel>Sample input</label>
          <input tuiInput [(ngModel)]="value" />
        </tui-textfield>

        <button tuiButton appearance="primary" (click)="onSubmit()">
          Submit
        </button>

        @if (submitted) {
        <p>Submitted: {{ value }}</p>
        }
      </div>
    </tui-root>
  `,
  styles: [
    `
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
      .remote-card--v5 {
        border-color: #7b1fa2;
        background: #f3e5f5;
      }
      .remote-card--v5 h2 {
        color: #7b1fa2;
        margin: 0;
      }
    `,
  ],
})
export class RemoteEntryInner {
  protected value = '';
  protected submitted = false;

  protected onSubmit(): void {
    this.submitted = true;
  }
}
