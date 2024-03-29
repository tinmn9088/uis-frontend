import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeNodeComponent } from './category-tree-node.component';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { CategoryModule } from '../../category.module';
import { CategoryFlatNode } from '../../domain/category-flat-node';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

describe('CategoryTreeNodeComponent', () => {
  let component: CategoryTreeNodeComponent;
  let fixture: ComponentFixture<CategoryTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        CategoryModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [CategoryTreeNodeComponent],
      providers: [
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTreeNodeComponent);
    component = fixture.componentInstance;
    component.categoryNode = new CategoryFlatNode({
      id: 1,
      name: 'TestName',
      hasChildren: false,
      parentId: 2,
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
