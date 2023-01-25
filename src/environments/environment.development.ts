import { Language } from 'src/app/shared/models/language.model';

export const environment = {
  defaultLanguage: Language.En,
  baseUrl: 'localhost:8080',
  localStorageKeys: {
    jwt: {
      access: 'accessJwtToken',
      refresh: 'refreshJwtToken',
    },
  },
};
