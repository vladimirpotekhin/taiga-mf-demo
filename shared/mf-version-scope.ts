/**
 * Version marker for cross-major alert content.
 */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  InjectionToken,
  Injector,
  ViewEncapsulation,
} from '@angular/core';
import {
  injectContext,
  PolymorpheusComponent,
  PolymorpheusOutlet,
  type PolymorpheusContent,
} from '@taiga-ui/polymorpheus';

const MF_SCOPED_CONTENT = new InjectionToken<PolymorpheusContent>(
  '[MF_SCOPED_CONTENT]',
);
const MF_SCOPED_VERSION = new InjectionToken<string>('[MF_SCOPED_VERSION]');

/**
 * Renders `content` verbatim inside a `<tui-mf-version-scope data-tui-version>`
 * element. The alert context (`completeWith`/`data`/...) is injected here and
 * forwarded to the wrapped content, so a component/template reads it exactly as
 * if the host had opened it directly.
 */
@Component({
  selector: 'tui-mf-version-scope',
  imports: [PolymorpheusOutlet],
  template: `
    <ng-container *polymorpheusOutlet="content as text; context: context">
      {{ text }}
    </ng-container>
  `,
  host: { '[attr.data-tui-version]': 'version' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MfVersionScope {
  protected readonly content: PolymorpheusContent = inject(MF_SCOPED_CONTENT);
  protected readonly version = inject(MF_SCOPED_VERSION);
  protected readonly context = injectContext<Record<string, unknown>>();
}

export function scopeContentToVersion(
  content: PolymorpheusContent,
  version: string,
  injector: Injector,
): PolymorpheusComponent<MfVersionScope> {
  return new PolymorpheusComponent(
    MfVersionScope,
    Injector.create({
      parent: injector,
      providers: [
        { provide: MF_SCOPED_CONTENT, useValue: content },
        { provide: MF_SCOPED_VERSION, useValue: version },
      ],
    }),
  );
}
