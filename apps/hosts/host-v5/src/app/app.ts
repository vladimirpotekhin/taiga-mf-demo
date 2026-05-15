import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiButton, TuiRoot } from '@taiga-ui/core';
import {
  TuiLogoComponent, TuiMainComponent,
  TuiNavigation,
} from '@taiga-ui/layout';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    TuiRoot,
    RouterLinkActive,
    TuiButton,
    TuiNavigation,
    TuiLogoComponent,
    TuiMainComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
}
