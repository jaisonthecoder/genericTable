import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcsSharedComponentsComponent } from './pcs-shared-components.component';

describe('PcsSharedComponentsComponent', () => {
  let component: PcsSharedComponentsComponent;
  let fixture: ComponentFixture<PcsSharedComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcsSharedComponentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcsSharedComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
