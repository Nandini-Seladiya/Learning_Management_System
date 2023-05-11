import { TestBed } from '@angular/core/testing';

import { AppUiService } from './app-ui.service';

describe('AppUiService', () => {
  let service: AppUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
