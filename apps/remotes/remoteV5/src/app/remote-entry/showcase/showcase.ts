import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiCheckbox,
  TuiNotificationService,
  TuiRadio,
  TuiSlider,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TuiAvatar,
  TuiBadge,
  TuiChip,
  TuiProgress,
  TuiRating,
  TuiSegmented,
  TuiSwitch,
} from '@taiga-ui/kit';
import { TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-mf-5-showcase',
  imports: [
    FormsModule,
    TuiAvatar,
    TuiBadge,
    TuiButton,
    TuiCheckbox,
    TuiChip,
    TuiHeader,
    TuiProgress,
    TuiRadio,
    TuiRating,
    TuiSegmented,
    TuiSlider,
    TuiSwitch,
    TuiTitle,
  ],
  templateUrl: './showcase.html',
  styleUrl: './showcase.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowcaseComponent {
  private readonly alerts = inject(TuiNotificationService);

  protected period = 1;
  protected notifications = true;
  protected digest = false;
  protected theme = 'light';
  protected storage = 64;
  protected rating = 4;

  protected readonly tags = ['Angular', 'TypeScript', 'Taiga UI'];

  protected showAlert(appearance: 'positive' | 'negative'): void {
    this.alerts
      .open(
        appearance === 'positive'
          ? 'Everything is up to date'
          : 'Something went wrong',
        { label: 'Showcase V5', appearance }
      )
      .subscribe();
  }
}
