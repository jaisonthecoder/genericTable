import { ComponentPortal } from '@angular/cdk/portal';
import { InlineFilterComponent } from '../shared/inline-filter/inline-filter.component';

export interface IGenericInlineFiltersPortalInstance {
  filterName: string;
  filterInstance: ComponentPortal<InlineFilterComponent>;
}
