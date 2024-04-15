import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MgGenericListingModule } from 'projects/mg-generic-listing/src/public-api';
import { SampleListingComponent } from './modules/sample-listing/sample-listing.component';
import { AuthModule } from './core/auth/auth.module';
import { SampleListingModule } from './modules/sample-listing/sample-listing.module';
import { SampleListingCloneModule } from './modules/sample-listing copy/sample-listing.module';

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AuthModule,
    MgGenericListingModule,
    SampleListingModule,
    SampleListingCloneModule,
  ],
  exports: [MgGenericListingModule, ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
