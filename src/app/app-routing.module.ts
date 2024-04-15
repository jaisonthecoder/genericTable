import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SampleListingComponent } from './modules/sample-listing/sample-listing.component';

const routes: Routes = [
 
  { path:'general-listing',loadChildren: () => import('./modules/sample-listing/sample-listing.module').then(m => m.SampleListingModule) },
  { path:'vessel-call',loadChildren: () => import('./modules/generic-table/generic-table.module').then(m => m.GenericTableModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
