import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgGenericListingTableComponent } from './mg-generic-listing-table.component';

describe('MgGenericListingTableComponent', () => {
  let component: MgGenericListingTableComponent;
  let fixture: ComponentFixture<MgGenericListingTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MgGenericListingTableComponent]
    });
    fixture = TestBed.createComponent(MgGenericListingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
