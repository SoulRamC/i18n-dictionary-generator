import * as fs from 'fs';
import * as path from 'path';
import { GenerateTranslationMigration } from '../migration_generation.js';

export async function GenerateDefaultTranslationDictionary() {
  await GenerateTranslationMigration();

  const files = fs
    .readdirSync(path.join(process.cwd()), { recursive: true })
    .filter((file) => file.endsWith('.tsx'));

  // Create the "translation" directory if it doesn't exist
  const translationDir = path.join(process.cwd(), 'i18n');
  if (!fs.existsSync(translationDir)) {
    fs.mkdirSync(translationDir);
  }

  const translation = {};

  // Loop through all files with the ".tsx" extension
  for (const file of files) {
    if (file.endsWith('.tsx')) {
      const filePath = path.join('.', file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Find all the strings inside the t("") calls
      const regex = /\bt\(["'](.*?)["']\)/g;
      const matches = [...content.matchAll(regex)];

      // Create the translation object
      for (const match of matches) {
        const keys = match[1].split('.');
        let currentObj = translation;
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (i === keys.length - 1) {
            currentObj[key] = '';
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
    path.join(translationDir, `en.json`),
    JSON.stringify(translation, null, 2)
  );
}
