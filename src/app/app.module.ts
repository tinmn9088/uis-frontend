import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './modules/shared/components/page-not-found/page-not-found.component';
import { Language, localStorageLanguageKey } from './modules/shared/models/language.model';
import { SharedModule } from './modules/shared/shared.module';
import { UserModule } from './modules/user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
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
