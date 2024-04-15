import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InlineFilterComponent } from './shared/inline-filter/inline-filter.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
 import { GenericTableCustomizationComponent } from './shared/generic-table-customization/generic-table-customization.component';
import { PortalModule } from '@angular/cdk/portal';
import { GenericTableAdvanceSearchComponent } from './shared/generic-table-advance-search/generic-table-advance-search.component';
import { MgGenericListingTableComponent } from './shared/mg-generic-listing-table/mg-generic-listing-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MgGenericCardListComponent } from './shared/mg-generic-card-list/mg-generic-card-list.component';
import { ListingTranslatePipe } from './helper/translate.pipe';
import { TranslationService } from './services/translation.service';
import {MatListModule} from '@angular/material/list';
import { BidiModule } from '@angular/cdk/bidi';



@NgModule({
  declarations: [
    MgGenericListingTableComponent,
    InlineFilterComponent,
    GenericTableAdvanceSearchComponent,
    GenericTableCustomizationComponent,
    MgGenericCardListComponent,
    ListingTranslatePipe
    
  ],
  imports: [
    CommonModule,CdkTableModule,FormsModule,  MatDialogModule, ReactiveFormsModule, MatAutocompleteModule, MatButtonModule,DragDropModule,PortalModule, MatCheckboxModule, MatDatepickerModule,  MatInputModule,  MatMenuModule, MatPaginatorModule, MatSelectModule, MatTableModule, CdkTableModule, MatListModule, BidiModule
  ],
  exports: [
    MgGenericListingTableComponent,
    InlineFilterComponent,
    GenericTableAdvanceSearchComponent,
    MatSelectModule, FormsModule, CommonModule,
    ListingTranslatePipe
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, 

  {
    provide: DateAdapter,
    useClass: MomentDateAdapter,
    deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  },
  { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  // { provide: MAT_DATE_LOCALE, useValue: 'fa-IR' },
  TranslationService
  ]
})
export class MgGenericListingModule { }
