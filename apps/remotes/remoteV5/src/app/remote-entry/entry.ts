import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { ProfileComponent } from './form/profile';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-remote-v5-entry',
  imports: [TuiRoot, ProfileComponent, TuiCard],
  template: `
    <tui-root>
      <div tuiCardLarge appearance="floating">
        <app-mf-5-profile />
      </div>
    </tui-root>
  `,
  styles: `
    tui-root {
      padding: 1rem;
    }

    [tuiCardLarge] {
      max-width: 35rem;
    }
  `,
})
export class RemoteEntryInner {}
