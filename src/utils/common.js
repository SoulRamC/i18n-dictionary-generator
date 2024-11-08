import * as fs from 'fs';
import * as path from 'path';

const translationDirName = process.env.TRANSLATION_DIR_NAME || 'i18n';
const migrationDirName = 'migration';
const historyFileName = 'migration_history.json';

const translationDir = path.join(process.cwd(), translationDirName);
const migrationDir = path.join(translationDir, migrationDirName);
const historyFilePath = path.join(migrationDir, historyFileName);

export function getMigrationFiles() {
  return fs
    .readdirSync(migrationDir)
    .filter((file) => file.endsWith('_migration.json'))
    .sort((a, b) => a.localeCompare(b)); // Sort in ascending order
}

export function readMigrationFile(file) {
  const migrationFilePath = path.join(migrationDir, file);
  const migration = JSON.parse(fs.readFileSync(migrationFilePath, 'utf8'));
  return migration;
}

export function readMigrationHistory() {
  const fileData = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
  return fileData;
}

export function readTranslationFile() {
  const enFilePath = path.join(process.cwd(), translationDirName, 'en.json');
  const enContent = fs.readFileSync(enFilePath, 'utf8');
  const enJson = JSON.parse(enContent);

  return enJson;
}

export function updateMigrationHistory(newHistory) {
  const currentHistory = readMigrationHistory();

  // Write the updated history back to the file
  if (currentHistory.length === 1) {
    fs.writeFileSync(historyFilePath, JSON.stringify(newHistory, null, 2));
  } else {
    currentHistory.forEach((oldEntry) => {
      const match = newHistory.find(
        (currentEntry) => currentEntry.migration === oldEntry.migration
      );
      if (match) {
        oldEntry.applied = true;
      }
    });

    fs.writeFileSync(historyFilePath, JSON.stringify(currentHistory, null, 2));
  }
}
