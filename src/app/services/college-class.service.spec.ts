import { TestBed } from '@angular/core/testing';

import { CollegeClassService } from './college-class.service';

describe('CollegeClassService', () => {
  let service: CollegeClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollegeClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
