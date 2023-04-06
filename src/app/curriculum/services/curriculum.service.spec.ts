import { TestBed } from '@angular/core/testing';

import { CurriculumService } from './curriculum.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('CurriculumService', () => {
  let service: CurriculumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
    service = TestBed.inject(CurriculumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
