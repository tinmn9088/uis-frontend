import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FrameComponent } from './components/frame/frame.component';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JoinPipe } from './pipes/join.pipe';
import { PaginatorService } from './services/paginator.service';
import { LanguageService } from './services/language.service';

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
];

const declarations = [ToolbarComponent, FrameComponent, PaginatorComponent];

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [...declarations, JoinPipe],
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
  providers: [PaginatorService, LanguageService],
})
export class SharedModule {}
