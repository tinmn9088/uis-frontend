import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { SharedModule } from 'src/app/shared/shared.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
