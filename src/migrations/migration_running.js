import * as fs from 'fs';
import * as path from 'path';

import {
  readMigrationFile,
  CreateTranslationFile,
  readMigrationHistory,
  updateMigrationHistory,
} from '../utils/index.js';
import { translateObject } from '../translation/index.js';

function mergeUnappliedMigrations(unAppliedMigrations) {
  let mergedMigration = {};
  for (const file of unAppliedMigrations) {
    const migration = readMigrationFile(file.migration);
    mergedMigration = { ...mergedMigration, ...migration };
  }

  return mergedMigration;
}

function getUnappliedMigration() {
  const migrationHistory = readMigrationHistory();
  const unAppliedMigrations = migrationHistory
    .filter((migration) => !migration.applied)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  return unAppliedMigrations;
}

export async function RunMigrations(langs, source) {
  const translationDir = path.join(process.cwd(), 'i18n');
  if (langs.includes('en')) {
    langs = langs.filter((lang) => lang !== 'en');
  }
  const unAppliedMigrations = getUnappliedMigration();
  if (unAppliedMigrations.length === 0) {
    console.log('No unapplied migrations found.');
    return;
  }

  const mergedMigration = mergeUnappliedMigrations(unAppliedMigrations);

  let translation = {};
  for (const lang of langs) {
    if (source === 'gemini') {
      console.log('Still in progress...');
    } else {
      translation = await translateObject(mergedMigration, lang, source);
    }

    const translationFilePath = path.join(translationDir, `${lang}.json`);
    // If the translation file already exists, merge new translations into it
    if (fs.existsSync(translationFilePath)) {
      const existingTranslations = JSON.parse(
        fs.readFileSync(translationFilePath, 'utf-8')
      );
      translation = { ...existingTranslations, ...translation };
    }

    // Write the translation object to the JSON file
    fs.writeFileSync(translationFilePath, JSON.stringify(translation, null, 2));
  }
  for (const migration of unAppliedMigrations) {
    migration.applied = true;
  }

  updateMigrationHistory(unAppliedMigrations);

  CreateTranslationFile(langs);
}
