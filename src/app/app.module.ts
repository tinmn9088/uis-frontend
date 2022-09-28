import { LOCATION_INITIALIZED } from '@angular/common';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorPagesModule } from './modules/error-pages/error-pages.module';
import { Language, localStorageLanguageKey } from './modules/shared/models/language.model';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

export function translateLoader(translate: TranslateService, injector: Injector): () => Promise<any> {
  return () => new Promise<any>((resolve: any) => {
    const locationInitialized = injector.get(LOCATION_INITIALIZED, Promise.resolve(null));
    locationInitialized.then(() => {
      const defaultLanguage: Language = Language.Ru;
      translate.setDefaultLang(defaultLanguage);
      translate.use(localStorage.getItem(localStorageLanguageKey) || defaultLanguage).subscribe({
        next: () => console.info(`Successfully initialized '${translate.currentLang}' language.'`),
        error: () => console.error(`Problem with '${translate.currentLang}' language initialization.'`),
        complete: () => resolve(null)
      });
    });
  });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ErrorPagesModule,
    UserModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: translateLoader,
      deps: [TranslateService, Injector],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
