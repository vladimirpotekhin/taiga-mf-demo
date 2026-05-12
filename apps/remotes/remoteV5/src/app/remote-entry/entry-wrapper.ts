import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideTaiga } from '@taiga-ui/core';
import { RemoteEntryInner } from './entry';

@Component({
  selector: 'app-remoteV5-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector: EnvironmentInjector;

  constructor(parent: EnvironmentInjector) {
    this.envInjector = createEnvironmentInjector(
      [provideTaiga()],
      parent,
    );
  }
}
