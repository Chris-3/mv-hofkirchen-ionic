import { TestBed } from '@angular/core/testing';

import { AlertCrtlService } from './alert-crtl.service';

describe('AlertCrtlService', () => {
  let service: AlertCrtlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertCrtlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
