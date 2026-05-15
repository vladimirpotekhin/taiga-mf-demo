import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideTaiga } from '@taiga-ui/core';
import { RemoteEntryInner } from './entry';

@Component({
  selector: 'app-remote-v5-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector = createEnvironmentInjector(
    [provideTaiga()],
    inject(EnvironmentInjector),
  );
}
