import * as path from 'path';
import * as fs from 'fs';

export function CreateTranslationFile(langs) {
  // if no en found, added it
  if (!langs.includes('en')) {
    langs.push('en');
  }
  const imports = langs
    .map((lang) => `import ${lang} from './${lang}.json';`)
    .join('\n');

  const resources = langs
    .map((lang) => {
      return `${lang}: {
      translation: ${lang},
    },`;
    })
    .join('\n  ');

  const translationJsContent = `
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

${imports}

const resources = {
  ${resources}
};

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources,
  lng: 'fr',
  // language to use if translations in user language are not available
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
`;

  const filePath = path.join(
    process.cwd(),
    process.env.TRANSLATION_DIR_NAME,
    'translation.js'
  );
  fs.writeFileSync(filePath, translationJsContent);
  console.log('translation.js file has been generated successfully.');
}
