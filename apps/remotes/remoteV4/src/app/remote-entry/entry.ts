import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiRoot, TuiSurface } from '@taiga-ui/core';
import { ProfileComponent } from './form/profile';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-remote-v4-entry',
  imports: [FormsModule, TuiRoot, ProfileComponent, TuiCard, TuiSurface],
  template: `
    <tui-root>
      <div tuiCardLarge tuiSurface="floating">
        <app-mf-4-profile />
      </div>
    </tui-root>
  `,
  styles: `
    tui-root {
      padding: 1rem;
    }
    
    [tuiCardLarge] {
      max-width: fit-content;
    }
  `,
})
export class RemoteEntryInner {}
