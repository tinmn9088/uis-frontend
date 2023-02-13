import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  getLanguage(): string {
    return (
      localStorage.getItem(environment.localStorageKeys.language) ||
      environment.defaultLanguage
    );
  }

  setLanguage(lang: string) {
    localStorage.setItem(environment.localStorageKeys.language, lang);
    window.location.reload();
  }
}
