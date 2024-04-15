import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SampleListingCloneComponent } from './sample-listing.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MgGenericListingModule } from 'projects/mg-generic-listing/src/public-api';
import { RouterModule, Routes } from '@angular/router';
import { TranslocoCoreModule } from 'src/app/core/transloco/transloco.module';



const routes: Routes = [
  {
    path:'table',
    component: SampleListingCloneComponent
  }
];

@NgModule({
  declarations: [SampleListingCloneComponent],
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
  ],
  exports:[SampleListingCloneComponent, RouterModule, TranslocoCoreModule],
  providers:[DatePipe]
})
export class SampleListingCloneModule { }
