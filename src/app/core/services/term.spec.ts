import { TestBed } from '@angular/core/testing';

import { Term } from './term';

describe('Term', () => {
  let service: Term;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Term);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
