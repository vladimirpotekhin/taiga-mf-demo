import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { RemoteEntryInner } from './entry';

@Component({
  selector: 'app-remote-v4-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector = createEnvironmentInjector(
    [provideEventPlugins()],
    inject(EnvironmentInjector),
  );
}
