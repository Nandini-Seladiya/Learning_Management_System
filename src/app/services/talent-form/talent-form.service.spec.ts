import { TestBed } from '@angular/core/testing';

import { TalentFormService } from './talent-form.service';

describe('TalentFormService', () => {
  let service: TalentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
