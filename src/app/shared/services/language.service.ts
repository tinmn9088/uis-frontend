import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

export const LOCAL_STORAGE_LANGUAGE_KEY = 'lang';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly DEFAULT_LANGUAGE = environment.defaultLanguage;

  getLanguage(): string {
    return (
      localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY) || this.DEFAULT_LANGUAGE
    );
  }

  setLanguage(lang: string) {
    localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, lang);
    window.location.reload();
  }
}
