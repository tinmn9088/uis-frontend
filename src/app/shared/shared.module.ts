import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ModuleLayoutComponent } from './components/module-layout/module-layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTreeModule } from '@angular/material/tree';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JoinPipe } from './pipes/join.pipe';
import { PaginatorService } from './services/paginator.service';
import { LanguageService } from './services/language.service';
import { FilteredSelectComponent } from './components/filtered-select/filtered-select.component';
import { EmptyComponent } from './components/empty/empty.component';
import { DatepickerYearHeaderComponent } from './components/datepicker-year-header/datepicker-year-header.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ListManagementComponent } from './components/list-management/list-management.component';

export const THEME_CSS_CLASS_TOKEN = new InjectionToken<string>('themeClass');
export const REFRESH_JWT_REQUEST_COUNT_TOKEN = new InjectionToken<string>(
  'refreshJwtRequestCount'
);

const modules = [
  CommonModule,
  RouterModule,
  BrowserAnimationsModule,
  HttpClientModule,
  FormsModule,
  ReactiveFormsModule,
  LayoutModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatSidenavModule,
  MatTabsModule,
  MatPaginatorModule,
  MatTreeModule,
  MatProgressBarModule,
  MatInputModule,
  MatExpansionModule,
  HttpClientModule,
  MatMenuModule,
  MatDividerModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatSortModule,
  MatSelectModule,
  MatCheckboxModule,
  MatCardModule,
  MatRippleModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatListModule,
];

const declarations = [
  ToolbarComponent,
  ModuleLayoutComponent,
  PaginatorComponent,
  JoinPipe,
  FilteredSelectComponent,
  DatepickerYearHeaderComponent,
  EmptyComponent,
  TruncatePipe,
  ListManagementComponent,
];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [...declarations],
  exports: [...modules, declarations, TranslateModule],
  imports: [
    ...modules,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    PaginatorService,
    LanguageService,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class SharedModule {}
