import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TuiRoot } from '@taiga-ui/core';

@Component({
  selector: 'app-root',

  imports: [RouterOutlet, RouterLink, TuiRoot],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  protected title = 'host-v4';
}
