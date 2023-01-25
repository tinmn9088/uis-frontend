import { Language } from 'src/app/shared/enums/language.enum';

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
