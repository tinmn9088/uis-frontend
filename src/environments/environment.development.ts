import { Language } from 'src/app/shared/domain/language';

export const environment = {
  defaultLanguage: Language.En,
  backendUrl: 'localhost:8080/api',
  localStorageKeys: {
    jwt: {
      access: 'accessJwtToken',
      refresh: 'refreshJwtToken',
    },
    language: 'lang',
  },
};
