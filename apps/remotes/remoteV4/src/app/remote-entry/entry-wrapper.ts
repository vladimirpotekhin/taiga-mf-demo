import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { RemoteEntryInner } from './entry';

@Component({
  selector: 'app-remote-v4-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
  styleUrls: ['./remote-theme.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector = createEnvironmentInjector(
    [provideEventPlugins()],
    inject(EnvironmentInjector),
  );
}
