import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { GenericListingTableService, MgGenericListingModule } from '@pcs/generic-listing';
import {DemoListingComponent } from './demo-listing.component';
import { ResponseMaperService } from './helper/response-maper.service';
import { StatusText } from './helper/status-mapper';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { ImagePipe, TruncTextPipe } from './helper/listing-helper.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DemoListingHelperButtonsComponent } from './shared-components/demo-listing-helper-buttons/demo-listing-helper-buttons.component';
import { DemoListingCardComponent } from './shared-components/demo-listing-card/demo-listing-card.component';



@NgModule({
  declarations: [DemoListingComponent, DemoListingHelperButtonsComponent, DemoListingCardComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule, 
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,  
    MgGenericListingModule,
    TranslocoCoreModule,
    ImagePipe,
    TruncTextPipe
  ],
  exports:[MgGenericListingModule, DemoListingComponent, DemoListingHelperButtonsComponent, DemoListingCardComponent, ImagePipe],
  providers:[GenericListingTableService, ResponseMaperService, StatusText]
})
export class DemoListingModule { }
