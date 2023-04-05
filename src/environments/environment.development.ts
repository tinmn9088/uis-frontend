import { Language } from 'src/app/shared/domain/language';

export const environment = {
  defaultLanguage: Language.En,
  backendUrl: 'localhost:8080/api',
  localStorageKeys: {
    auth: 'auth',
    user: 'user',
    language: 'lang',
  },
};
