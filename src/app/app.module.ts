import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpecializationModule } from './specialization/specialization.module';
import { SharedModule } from './shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { LOCATION_INITIALIZED } from '@angular/common';
import { LOCAL_STORAGE_LANGUAGE_KEY } from './shared/models/language.model';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

export function translateLoader(
  translate: TranslateService,
  injector: Injector
): () => Promise<void> {
  return () =>
    new Promise<void>(resolve => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve()
      );
      locationInitialized.then(() => {
        const defaultLanguage = environment.defaultLanguage;
        translate.setDefaultLang(defaultLanguage);
        translate
          .use(
            localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) || defaultLanguage
          )
          .subscribe({
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
  declarations: [AppComponent],
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
      deps: [TranslateService, Injector],
      multi: true,
    },
  ],
})
export class AppModule {}
