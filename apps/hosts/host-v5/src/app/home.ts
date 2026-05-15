import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiBadge } from '@taiga-ui/kit';
import { TuiCard, TuiHeader } from '@taiga-ui/layout';
import { TuiNotification } from '@taiga-ui/core';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TuiBadge, TuiHeader, TuiCard, TuiNotification],
  template: `
    <section class="home">
      <span tuiBadge appearance="accent">Host v5 · Taiga UI v5</span>
      <header tuiHeader>
        <h1 tuiTitle="l">
          Taiga UI Microfrontends
          <p tuiSubtitle>
            A playground for testing how different major versions of Taiga UI
            coexist on a single page via Module Federation.
          </p>
        </h1>
      </header>

      <div class="grid">
        <a tuiCardLarge tuiHeader appearance="floating" routerLink="/remoteV4">
          <h3 tuiTitle>
            Remote v4
            <div tuiSubtitle>Microfrontend on Taiga UI v4</div>
          </h3>
        </a>
        <a tuiCardLarge tuiHeader appearance="floating" routerLink="/remoteV5">
          <h3 tuiTitle>
            Remote v5
            <div tuiSubtitle>Microfrontend on Taiga UI v5</div>
          </h3>
        </a>
        <a tuiCardLarge tuiHeader appearance="floating" routerLink="/both">
          <h3 tuiTitle>
            Both
            <div tuiSubtitle>v4 and v5 side by side</div>
          </h3>
        </a>
      </div>

      <div size="l" tuiNotification>
        Scenario: <strong>host runs v5</strong>, remotes bring their own Taiga.
        Expected pain points — CSS variables, DI tokens, overlay containers.
      </div>
    </section>
  `,
  styles: [
    `
      .home {
        max-width: 880px;
        margin: 0 auto;
        padding: 48px 24px 64px;
        color: #1a1a1a;
      }
      
      [tuiHeader] {
        margin-block: 1rem;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
        margin-block: 2rem
      }
    `,
  ],
})
export class Home {}
