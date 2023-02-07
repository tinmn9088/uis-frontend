import { TestBed } from '@angular/core/testing';

import { SpecializationService } from './specialization.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('SpecializationService', () => {
  let service: SpecializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SharedModule] });
    service = TestBed.inject(SpecializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
