import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SampleListingComponent } from './sample-listing.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MgGenericListingModule } from 'projects/mg-generic-listing/src/public-api';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoCoreModule } from 'src/app/core/transloco/transloco.module';
import { SampleListingCloneModule } from '../sample-listing copy/sample-listing.module';



const routes: Routes = [
  {
    path:'table',
    component: SampleListingComponent
  }
];

@NgModule({
  declarations: [SampleListingComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    MatTableModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MgGenericListingModule,
    RouterModule.forRoot(routes),
    TranslocoCoreModule,  
    SampleListingCloneModule
  ],
  exports:[SampleListingComponent, RouterModule, TranslocoCoreModule],
  providers:[DatePipe]
})
export class SampleListingModule { }
