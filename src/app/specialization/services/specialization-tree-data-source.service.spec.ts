import { TestBed } from '@angular/core/testing';

import { SpecializationTreeDataSourceService } from './specialization-tree-data-source.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  SpecializationFlatNode,
  getLevel,
  isExpandable,
} from './specialization.service';

describe('SpecializationDataSourceService', () => {
  let service: SpecializationTreeDataSourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
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
