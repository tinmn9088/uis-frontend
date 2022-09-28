import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorPagesModule } from './modules/error-pages/error-pages.module';
import { Language, localStorageLanguageKey } from './modules/shared/models/language.model';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

  readonly defaultLanguage: Language = Language.Ru;

  constructor(translate: TranslateService) {
    translate.setDefaultLang(this.defaultLanguage);
    translate.use(localStorage.getItem(localStorageLanguageKey) || this.defaultLanguage);
  }
}
