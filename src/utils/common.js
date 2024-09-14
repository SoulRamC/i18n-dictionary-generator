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
