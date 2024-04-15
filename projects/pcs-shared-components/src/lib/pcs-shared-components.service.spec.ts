import { TestBed } from '@angular/core/testing';

import { PcsSharedComponentsService } from './pcs-shared-components.service';

describe('PcsSharedComponentsService', () => {
  let service: PcsSharedComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PcsSharedComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
