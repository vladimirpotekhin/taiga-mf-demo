import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuiRoot, TuiSurface } from '@taiga-ui/core';
import { ProfileComponent } from './form/profile';
import { ShowcaseComponent } from './showcase/showcase';
import { TuiCard } from '@taiga-ui/layout';

@Component({
  selector: 'app-remote-v4-entry',
  imports: [
    FormsModule,
    TuiRoot,
    ProfileComponent,
    ShowcaseComponent,
    TuiCard,
    TuiSurface,
  ],
  template: `
    <tui-root>
      <div class="cards">
        <div tuiCardLarge tuiSurface="floating">
          <app-mf-4-profile />
        </div>
        <div tuiCardLarge tuiSurface="floating">
          <app-mf-4-showcase />
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
      flex-direction: column;
      gap: 1rem;
    }

    [tuiCardLarge] {
      max-width: 35rem;
    }
  `,
})
export class RemoteEntryInner {}
