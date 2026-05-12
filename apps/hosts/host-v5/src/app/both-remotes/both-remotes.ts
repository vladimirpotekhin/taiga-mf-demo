import { Component, signal, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-both-remotes',
  imports: [NgComponentOutlet],
  template: `
    <h2>Both remotes on one page</h2>
    <div class="both-remotes">
      @if (remoteV4(); as comp) {
        <ng-container *ngComponentOutlet="comp" />
      }
      @if (remoteV5(); as comp) {
        <ng-container *ngComponentOutlet="comp" />
      }
    </div>
  `,
  styles: [`
    h2 { margin: 24px 24px 0; }
    .both-remotes {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
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
