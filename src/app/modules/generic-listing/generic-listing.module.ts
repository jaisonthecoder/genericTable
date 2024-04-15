import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { GenericListingTableService, MgGenericListingModule } from '@pcs/generic-listing';
import {GenericListingComponent } from './generic-listing.component';
import { ResponseMaperService } from './helper/response-maper.service';
import { StatusText } from './helper/status-mapper';
import { TranslocoCoreModule } from 'app/core/transloco/transloco.module';
import { ImagePipe, TruncTextPipe } from './helper/listing-helper.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GenericListingHelperButtonsComponent } from './shared-components/generic-listing-helper-buttons/generic-listing-helper-buttons.component';
import { GenericListingCardComponent } from './shared-components/generic-listing-card/generic-listing-card.component';



@NgModule({
  declarations: [GenericListingComponent, GenericListingHelperButtonsComponent, GenericListingCardComponent],
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
  exports:[MgGenericListingModule, GenericListingComponent, GenericListingHelperButtonsComponent, GenericListingCardComponent, ImagePipe],
  providers:[GenericListingTableService, ResponseMaperService, StatusText]
})
export class GenericListingModule { }
