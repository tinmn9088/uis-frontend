import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecializationTreeNodeComponent } from './specialization-tree-node.component';
import { HttpLoaderFactory, SharedModule } from 'src/app/shared/shared.module';
import { SpecializationFlatNode } from '../../domain/specialization-flat-node';
import { RouterTestingModule } from '@angular/router/testing';
import { JWT_HELPER_SERVICE_TOKEN } from 'src/app/auth/auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SpecializationTreeNodeComponent', () => {
  let component: SpecializationTreeNodeComponent;
  let fixture: ComponentFixture<SpecializationTreeNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SharedModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient],
          },
        }),
      ],
      declarations: [SpecializationTreeNodeComponent],
      providers: [
        {
          provide: JWT_HELPER_SERVICE_TOKEN,
          useValue: new JwtHelperService(),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SpecializationTreeNodeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.specializationNode = new SpecializationFlatNode({
      id: 1,
      name: 'TestName',
      shortName: 'TestShortName',
      cipher: 'TestCipher',
      hasChildren: false,
      parentId: 1,
    });
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
