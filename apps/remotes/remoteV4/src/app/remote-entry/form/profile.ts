import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  TuiAlertService,
  TuiButton,
  TuiDialogService,
  TuiTextfield,
  TuiTitle,
  TuiIcon,
} from '@taiga-ui/core';
import { TuiForm, TuiHeader } from '@taiga-ui/layout';
import {
  TUI_CONFIRM,
  TuiChevron,
  TuiDataListWrapper,
  TuiSelect,
  TuiTextarea,
  TuiTooltip,
} from '@taiga-ui/kit';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-mf-4-profile',
  imports: [
    ReactiveFormsModule,
    TuiButton,
    TuiForm,
    TuiHeader,
    TuiTitle,
    TuiTextfield,
    TuiSelect,
    TuiDataListWrapper,
    TuiChevron,
    TuiTextarea,
    TuiChevron,
    TuiTooltip,
    TuiIcon,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly alert = inject(TuiAlertService);
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
          this.alert.open('Good job', { label: 'Profile updated' })
        )
      )
      .subscribe();
  }
}
