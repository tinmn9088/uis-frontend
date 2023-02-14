import { TestBed } from '@angular/core/testing';

import { DisciplineService } from './discipline.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('DisciplineService', () => {
  let service: DisciplineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
    service = TestBed.inject(DisciplineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
