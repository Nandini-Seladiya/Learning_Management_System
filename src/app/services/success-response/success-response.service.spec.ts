import { TestBed } from '@angular/core/testing';

import { SuccessResponseService } from './success-response.service';

describe('SuccessResponseService', () => {
  let service: SuccessResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
