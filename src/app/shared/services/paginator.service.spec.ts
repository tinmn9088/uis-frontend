import { TestBed } from '@angular/core/testing';

import { PaginatorService } from './paginator.service';

fdescribe('PaginatorService', () => {
  let service: PaginatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate [0, 1, 2, 3, 4, 5]', () => {
    const indexes = service.generatePageIndexes(0, 10, 6);
    expect(indexes.length).toBe(6);
    expect(indexes[0]).toBe(0);
    expect(indexes[5]).toBe(5);
  });

  it('should generate [4, 5, 6, 7, 8, 9]', () => {
    const indexes = service.generatePageIndexes(9, 10, 6);
    expect(indexes.length).toBe(6);
    expect(indexes[0]).toBe(4);
    expect(indexes[5]).toBe(9);
  });

  it('should generate [2, 3, 4, 5, 6, 7]', () => {
    const indexes = service.generatePageIndexes(5, 10, 6);
    expect(indexes.length).toBe(6);
    expect(indexes[0]).toBe(2);
    expect(indexes[5]).toBe(7);
  });
});
