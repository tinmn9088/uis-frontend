import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeComponent } from './specialization-tree.component';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { FlatTreeControl } from '@angular/cdk/tree';
import {
  getLevel,
  isExpandable,
} from '../../services/specialization-tree-data-source.service';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

describe('SpecializationTreeComponent', () => {
  let component: SpecializationTreeComponent;
  let fixture: ComponentFixture<SpecializationTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [SpecializationTreeComponent],
      providers: [
        {
          provide: FlatTreeControl,
          useValue: new FlatTreeControl<SpecializationFlatNode>(
            getLevel,
            isExpandable
          ),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
