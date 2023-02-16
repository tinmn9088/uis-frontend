import {
  APP_INITIALIZER,
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpecializationModule } from './specialization/specialization.module';
import { SharedModule } from './shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { LanguageService } from './shared/services/language.service';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingRedirectComponent } from './app-routing-redirect/app-routing-redirect.component';
import { SnackbarService } from './shared/services/snackbar.service';
import { DisciplineModule } from './discipline/discipline.module';
import { BehaviorSubject, filter } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';

export const THEME_CSS_CLASS_TOKEN = new InjectionToken<string>('');

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
  constructor(private _snackbarService: SnackbarService) {}

  handleError(error: Error) {
    console.error(error);
    if (error.message) this._snackbarService.showError(error.message);
  }
}

@NgModule({
  declarations: [AppComponent, AppRoutingRedirectComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SpecializationModule,
    DisciplineModule,
    HttpClientModule,
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
    @Inject(THEME_CSS_CLASS_TOKEN) public themeClass$: BehaviorSubject<string>
  ) {
    this.themeClass$
      .pipe(filter(themeClass => !!themeClass))
      .subscribe(themeClass => {
        overlayContainer.getContainerElement().classList.add(themeClass);
      });
  }
}
