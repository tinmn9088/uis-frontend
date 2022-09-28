import { Component, OnInit } from '@angular/core';
import { Language, localStorageLanguageKey } from '../../models/language.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {

  readonly currentLanguage = this.language;

  readonly languages = Language;

  rotateStyle: string = '';

  constructor() { }

  ngOnInit(): void { }

  get language(): string {
    return localStorage.getItem(localStorageLanguageKey) || '';
  }

  set language(lang: string) {
    localStorage.setItem(localStorageLanguageKey, lang);
    window.location.reload();
  }
}
