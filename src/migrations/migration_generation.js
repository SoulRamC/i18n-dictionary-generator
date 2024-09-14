import * as fs from 'fs';
import * as path from 'path';
import {
  getMigrationFiles,
  readTranslationFile,
  CheckDirectories,
} from '../utils/index.js';

export async function GenerateTranslationMigration() {
  try {
    const translationObj = readTranslationFile();

    const { migrationDir, historyFilePath } = CheckDirectories();

    const existingMigrations = getMigrationFiles();
    const changes = compareWithAllMigrations(
      translationObj,
      existingMigrations,
      migrationDir
    );
    if (Object.keys(changes).length > 0) {
      const timestamp = new Date()
        .toISOString()
        .replace(/[-:]/g, '')
        .split('.')[0];
      const migrationFileName = `${timestamp}_migration.json`;
      const migrationFilePath = path.join(migrationDir, migrationFileName);
      fs.writeFileSync(migrationFilePath, JSON.stringify(changes, null, 2));

      console.log(`New migration file created: ${migrationFileName}`);

      // Update migration history
      const history = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
      history.push({
        migration: migrationFileName,
        applied: false,
        timestamp,
      });
      fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2));
    } else {
      console.log('No changes detected. No new migration file created.');
    }
    return changes;
  } catch (error) {
    console.error('Error generating migration:', error);
  }
}

function compareWithAllMigrations(newObj, migrationFiles, migrationDir) {
  const changes = {};
  const flattenedNewObj = flattenObject(newObj);
  // Combine all existing migrations
  let allMigrations = {};
  for (const file of migrationFiles) {
    const migrationPath = path.join(migrationDir, file);
    const migration = JSON.parse(fs.readFileSync(migrationPath, 'utf8'));
    allMigrations = { ...allMigrations, ...migration };
  }

  // Compare new translations with all migrations
  for (const key in flattenedNewObj) {
    const newValue = flattenedNewObj[key];
    if (!allMigrations[key] || allMigrations[key] !== newValue) {
      changes[key] = newValue;
    }
  }
  // Check for removed keys
  for (const key in allMigrations) {
    if (!(key in flattenedNewObj)) {
      changes[key] = null; // Indicate removal
    }
  }
  return changes;
}

function flattenObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
}
