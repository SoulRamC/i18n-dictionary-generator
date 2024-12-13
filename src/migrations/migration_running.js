import * as fs from 'fs';
import * as path from 'path';

import {
  readMigrationFile,
  CreateTranslationFile,
  readMigrationHistory,
  updateMigrationHistory,
  separateNullValues,
} from '../utils/index.js';
import { translateObject } from '../translation/index.js';

function mergeUnappliedMigrations(unAppliedMigrations) {
  let mergedMigration = {};
  for (const file of unAppliedMigrations) {
    const migration = readMigrationFile(file.migration);
    // Object.keys(migration).forEach((key) => {
    //   if (migration[key] === null) delete migration[key];
    // });

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

  // Separate null values into a new object
  const nullValues = separateNullValues(mergedMigration);

  let translation = {};
  for (const lang of langs) {
    translation = await translateObject(mergedMigration, lang, source);

    const translationFilePath = path.join(translationDir, `${lang}.json`);
    // If the translation file exists, merge new translations into it
    if (fs.existsSync(translationFilePath)) {
      let existingTranslations = JSON.parse(
        fs.readFileSync(translationFilePath, 'utf-8')
      );

      // Remove keys with null values from the existing translations
      Object.keys(nullValues).forEach((nullKey) => {
        if (nullKey in existingTranslations) {
          delete existingTranslations[nullKey];
        }
      });

      // Merge new translations into existing translations
      translation = { ...existingTranslations, ...translation };
    }

    // Write the updated translation object to the JSON file
    fs.writeFileSync(translationFilePath, JSON.stringify(translation, null, 2));
  }

  // Mark each migration as applied
  for (const migration of unAppliedMigrations) {
    migration.applied = true;
  }

  updateMigrationHistory(unAppliedMigrations);

  // Optional: Create the translation file if needed
  CreateTranslationFile(langs);
  console.log('Translation files generated successfully');
}
