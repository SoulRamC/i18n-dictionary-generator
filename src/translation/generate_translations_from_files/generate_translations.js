// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import { GenerateTranslationMigration } from '../migration_generation.js/index.js';
import translate from '@iamtraction/google-translate';

export async function GenerateTranslation(langs) {
  const translationDirName = process.env.TRANSLATION_DIR_NAME;
  await GenerateTranslationMigration();

  const files = fs
    .readdirSync(path.join(process.cwd()), { recursive: true })
    .filter((file) => file.endsWith('.tsx'));

  // Create the "translation" directory if it doesn't exist
  const translationDir = path.join(process.cwd(), translationDirName);
  if (!fs.existsSync(translationDir)) {
    fs.mkdirSync(translationDir);
  }

  for (const lang of langs) {
    const translation = {};

    // Loop through all files with the ".tsx" extension
    for (const file of files) {
      if (file.endsWith('.tsx')) {
        const filePath = path.join('.', file);
        const content = fs.readFileSync(filePath, 'utf8');

        // Find all the strings inside the t("") calls
        const regex = /t\("(.*)"\)/g;
        const matches = [...content.matchAll(regex)];

        // Create the translation object
        for (const match of matches) {
          const keys = match[1].split('.');
          let currentObj = translation;
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (i === keys.length - 1) {
              await translate(key, { from: 'en', to: lang })
                .then((res) => {
                  currentObj[key] = res.text;
                  console.log(`Translated ${key} to ${lang}`);
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              if (!currentObj[key]) {
                currentObj[key] = {};
              }
              currentObj = currentObj[key];
            }
          }
        }
      }
    }

    // Write the translation object to a JSON file
    fs.writeFileSync(
      path.join(translationDir, `${lang}.json`),
      JSON.stringify(translation, null, 2)
    );
  }
}
