import { TestBed } from '@angular/core/testing';

import { HighlightTextService } from './highlight-text.service';

describe('HighlightTextService', () => {
  let service: HighlightTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighlightTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
