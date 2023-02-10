import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
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

@NgModule({
  declarations: [AppComponent, AppRoutingRedirectComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    SpecializationModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: translateLoader,
      deps: [TranslateService, LanguageService, Injector],
      multi: true,
    },
  ],
})
export class AppModule {}
