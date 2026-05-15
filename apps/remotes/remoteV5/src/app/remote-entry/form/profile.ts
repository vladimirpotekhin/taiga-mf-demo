import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButton,
  TuiDialogService, TuiInput,
  TuiNotificationService,
  TuiTitle,
} from '@taiga-ui/core';
import {
  TUI_CONFIRM,
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiTextarea,
  TuiTooltip,
} from '@taiga-ui/kit';
import { switchMap } from 'rxjs';
import { TuiForm, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-mf-5-profile',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiTitle,
    TuiSelect,
    TuiDataListWrapper,
    TuiChevron,
    TuiTextarea,
    TuiTooltip,
    TuiInput,
    TuiHeader,
    TuiForm,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  protected readonly notifications = inject(TuiNotificationService);
  private readonly dialogs = inject(TuiDialogService);

  protected readonly emails = ['my@example.com', 'ersatz@example.com'];

  protected readonly form = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(this.emails[0]),
    bio: new FormControl(''),
  });

  protected submit(): void {
    this.dialogs
      .open(TUI_CONFIRM, {
        data: {
          content: 'You profile will be updated',
          no: 'You have no choice',
        },
      })
      .pipe(
        switchMap(() =>
          this.notifications.open('Good job', { label: 'Profile updated' })
        )
      )
      .subscribe();
  }
}
