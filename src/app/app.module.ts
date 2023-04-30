import {
  APP_INITIALIZER,
  ErrorHandler,
  Inject,
  Injectable,
  Injector,
  NgModule,
  NgZone,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HttpLoaderFactory,
  REFRESH_JWT_REQUEST_COUNT_TOKEN,
  SharedModule,
  THEME_CSS_CLASS_TOKEN,
} from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { LanguageService } from './shared/services/language.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingRedirectComponent } from './shared/components/app-routing-redirect/app-routing-redirect.component';
import { SnackbarService } from './shared/services/snackbar.service';
import { BehaviorSubject, filter } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ModuleService } from './shared/services/module.service';
import { CategoryModule } from './category/category.module';
import { ModuleRoutingModule } from './shared/module-routing.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SnackbarAction } from './shared/domain/snackbar-action';
import { CurriculumModule } from './curriculum/curriculum.module';

export function translateLoader(
  translate: TranslateService,
  languageService: LanguageService,
  injector: Injector
): () => Promise<void> {
  return () =>
    new Promise<void>(resolve => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve()
      );
      locationInitialized.then(() => {
        translate.use(languageService.getLanguage()).subscribe({
          next: () =>
            console.info(
              `Successfully initialized "${translate.currentLang}" language.`
            ),
          error: () =>
            console.error(
              `Problem with '${translate.currentLang}' language initialization.`
            ),
          complete: () => resolve(),
        });
      });
    });
}

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(
    private _snackbarService: SnackbarService,
    private _zone: NgZone
  ) {}

  handleError(error: Error) {
    console.error(error);
    if (error.message) {
      this._zone.run(() => {
        this._snackbarService.showError(error.message, SnackbarAction.Cross);
      });
    }
  }
}

@NgModule({
  declarations: [AppComponent, AppRoutingRedirectComponent],
  bootstrap: [AppComponent],
  imports: [
    AuthModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    CategoryModule,
    CurriculumModule,
    UserModule,
    HttpClientModule,
    ModuleRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: translateLoader,
      deps: [TranslateService, LanguageService, Injector],
      multi: true,
    },
    { provide: ErrorHandler, useClass: AppErrorHandler },
    {
      provide: THEME_CSS_CLASS_TOKEN,
      useValue: new BehaviorSubject(''),
    },
    {
      provide: REFRESH_JWT_REQUEST_COUNT_TOKEN,
      useValue: new BehaviorSubject(0),
    },
  ],
})
export class AppModule {
  /**
   * Since certain components are inside of a global overlay container, your theme may
   * not be applied to them. In order to define the theme that will be used for overlay
   * components, it is needed to specify it on the global `OverlayContainer` instance.
   */
  constructor(
    overlayContainer: OverlayContainer,
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>,
    moduleService: ModuleService
  ) {
    this.themeClass$
      .pipe(filter(themeClass => !!themeClass))
      .subscribe(themeClass => {
        moduleService.getAllThemeCssClasses().forEach(themeClass => {
          overlayContainer.getContainerElement().classList.remove(themeClass);
        });
        overlayContainer.getContainerElement().classList.add(themeClass);
      });
  }
}
