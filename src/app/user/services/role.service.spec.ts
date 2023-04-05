import { TestBed } from '@angular/core/testing';

import { RoleService } from './role.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('RoleService', () => {
  let service: RoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
    service = TestBed.inject(RoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
