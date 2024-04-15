import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableAdvanceSearchComponent } from './generic-table-advance-search.component';

describe('GenericTableAdvanceSearchComponent', () => {
  let component: GenericTableAdvanceSearchComponent;
  let fixture: ComponentFixture<GenericTableAdvanceSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericTableAdvanceSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTableAdvanceSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
