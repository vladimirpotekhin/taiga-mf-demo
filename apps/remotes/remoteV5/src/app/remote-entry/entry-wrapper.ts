import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { provideTaiga } from '@taiga-ui/core';
import { RemoteEntryInner } from './entry';

@Component({
  selector: 'app-remote-v5-entry',
  imports: [NgComponentOutlet],
  template: `<ng-container *ngComponentOutlet="component; environmentInjector: envInjector" />`,
  styleUrls: ['./remote-theme.less'],
  encapsulation: ViewEncapsulation.None,
})
export class RemoteEntry {
  protected component = RemoteEntryInner;
  protected envInjector = createEnvironmentInjector(
    [provideTaiga()],
    inject(EnvironmentInjector),
  );
}
