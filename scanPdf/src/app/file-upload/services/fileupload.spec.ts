import { TestBed } from '@angular/core/testing';

import { Fileupload } from './fileupload';

describe('Fileupload', () => {
  let service: Fileupload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Fileupload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
