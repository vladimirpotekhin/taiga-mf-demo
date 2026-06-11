import { Component, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-both-remotes',
  imports: [NgComponentOutlet],
  template: `
    <h2>Both remotes on one page</h2>
    <div class="both-remotes">
      <div class="column">
        @if (remoteV4(); as comp) {
          <ng-container *ngComponentOutlet="comp" />
        }
      </div>
      <div class="column">
        @if (remoteV5(); as comp) {
          <ng-container *ngComponentOutlet="comp" />
        }
      </div>
    </div>
  `,
  styles: [`
    h2 { margin: 24px 24px 0; }
    .both-remotes {
      display: flex;
      flex-wrap: wrap;
    }
    /* Side-by-side columns on desktop so v4/v5 examples line up pairwise */
    .column {
      flex: 1 1 30rem;
      min-width: 0;
    }
  `],
})
export class BothRemotes {
  protected remoteV4 = signal<Type<unknown> | undefined>(undefined);
  protected remoteV5 = signal<Type<unknown> | undefined>(undefined);

  constructor() {
    import('remoteV4/Module').then((m) => this.remoteV4.set(m.RemoteEntry));
    import('remoteV5/Module').then((m) => this.remoteV5.set(m.RemoteEntry));
  }
}
