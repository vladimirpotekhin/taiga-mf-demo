import { Component } from '@angular/core';
import { TuiRoot } from '@taiga-ui/core';
import { ProfileComponent } from './form/profile';
import { ShowcaseComponent } from './showcase/showcase';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-remote-v5-entry',
  imports: [TuiRoot, ProfileComponent, ShowcaseComponent, TuiCard],
  template: `
    <tui-root>
      <div class="cards">
        <div tuiCardLarge appearance="floating">
          <app-mf-5-profile />
        </div>
        <div tuiCardLarge appearance="floating">
          <app-mf-5-showcase />
        </div>
      </div>
    </tui-root>
  `,
  styles: `
    tui-root {
      padding: 1rem;
    }

    .cards {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: 1rem;
    }

    [tuiCardLarge] {
      flex: 1 1 20rem;
      max-width: 35rem;
    }
  `,
})
export class RemoteEntryInner {}
