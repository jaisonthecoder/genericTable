import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleListingComponent } from './sample-listing.component';

describe('SampleListingComponent', () => {
  let component: SampleListingComponent;
  let fixture: ComponentFixture<SampleListingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SampleListingComponent]
    });
    fixture = TestBed.createComponent(SampleListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
