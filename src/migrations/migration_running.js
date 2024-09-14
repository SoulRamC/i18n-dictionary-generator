import * as fs from 'fs';
import * as path from 'path';

import {
  getMigrationFiles,
  readMigrationFile,
  CreateTranslationFile,
} from '../utils/index.js';
import { translateObject } from '../translation/index.js';

function mergeTranslationObj() {
  const migrationFiles = getMigrationFiles();
  // Combine all existing migrations
  let allMigrations = {};
  for (const file of migrationFiles) {
    const migration = readMigrationFile(file);
    allMigrations = { ...allMigrations, ...migration };
  }

  return allMigrations;
}

function getPendingMigrations() {}

export async function RunMigrations(langs, source) {
  const translationDir = path.join(process.cwd(), 'i18n');
  if (langs.includes('en')) {
    langs = langs.filter((lang) => lang !== 'en');
  }
  const allMigrationsData = mergeTranslationObj();

  let translation = {};
  for (const lang of langs) {
    if (source === 'gemini') {
      console.log('Still in progress...');
    } else {
      translation = await translateObject(allMigrationsData, lang, source);
    }

    // Write the translation object to a JSON file
    fs.writeFileSync(
      path.join(translationDir, `${lang}.json`),
      JSON.stringify(translation, null, 2)
    );
  }

  CreateTranslationFile(langs);
}
