import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableCustomizationComponent } from './generic-table-customization.component';

describe('GenericTableCustomizationComponent', () => {
  let component: GenericTableCustomizationComponent;
  let fixture: ComponentFixture<GenericTableCustomizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericTableCustomizationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericTableCustomizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
