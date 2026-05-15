import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { ProfileComponent } from './form/profile';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-remoteV5-entry',
  imports: [TuiRoot, ProfileComponent, TuiCard],
  template: `
    <tui-root>
      <div tuiCardLarge appearance="floating">
        <mf-5-profile />
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
