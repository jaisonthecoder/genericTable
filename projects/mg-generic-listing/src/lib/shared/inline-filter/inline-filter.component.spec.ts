import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InlineFilterComponent } from './inline-filter.component';

describe('InlineFilterComponent', () => {
  let component: InlineFilterComponent;
  let fixture: ComponentFixture<InlineFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InlineFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InlineFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
