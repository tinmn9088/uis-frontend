import { TestBed } from '@angular/core/testing';

import {
  SpecializationFlatNode,
  SpecializationTreeDataSourceService,
  getLevel,
  isExpandable,
} from './specialization-tree-data-source.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SpecializationDataSourceService', () => {
  let service: SpecializationTreeDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
      providers: [
        {
          provide: FlatTreeControl,
          useValue: new FlatTreeControl<SpecializationFlatNode>(
            getLevel,
            isExpandable
          ),
        },
      ],
    });
    service = TestBed.inject(SpecializationTreeDataSourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
