import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgGenericCardListComponent } from './mg-generic-card-list.component';

describe('MgGenericCardListComponent', () => {
  let component: MgGenericCardListComponent;
  let fixture: ComponentFixture<MgGenericCardListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MgGenericCardListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MgGenericCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
