import { ChangeDetectionStrategy, Component } from '@angular/core';
import { type TuiPortalContext } from '@taiga-ui/cdk';
import { TuiAppearance, TuiButton, TuiLink, type TuiNotificationOptions } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

/**
 * Interactive component-type alert content (Polymorpheus). It reads its data via
 * `injectContext` and reports back through `context.completeWith`, so it only
 * works when the renderer shares the *same* `@taiga-ui/polymorpheus` singleton as
 * the code that created it. Used to probe whether component content survives the
 * MF alert bus when host and remote are the same Taiga major vs. different ones.
 */
@Component({
  imports: [TuiButton, TuiLink, TuiAppearance],
  template: `
    <span tuiSubtitle>
      <em>Your balance:</em>
      {{ value }} RUB
    </span>
    <div>
      <button
        size="s"
        appearance="outline-grayscale"
        tuiButton
        type="button"
        (click)="context.completeWith(value)"
      >
        Submit
      </button>
      <button
        size="s"
        tuiLink 
        appearance=""
        type="button"
        (click)="increaseBalance()"
      > 
        Increase
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceAlert {
  protected readonly context =
    injectContext<TuiPortalContext<TuiNotificationOptions<number>, number>>();

  protected value = this.context.data;

  protected increaseBalance(): void {
    this.value += 10;
  }
}
