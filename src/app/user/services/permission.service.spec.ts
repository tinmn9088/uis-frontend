import { TestBed } from '@angular/core/testing';

import { PermissionService } from './permission.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('PermissionService', () => {
  let service: PermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
    service = TestBed.inject(PermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
