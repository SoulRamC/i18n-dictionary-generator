import * as fs from 'fs';
import * as path from 'path';
const translationDirName = process.env.TRANSLATION_DIR_NAME || 'i18n';
const migrationDirName = 'migration';
const historyFileName = 'migration_history.json';

export function CheckDirectories() {
  const translationDir = path.join(process.cwd(), translationDirName);
  if (!fs.existsSync(translationDir)) {
    throw new Error('Translation directory does not exist.');
  }

  // Check if the "en.json" file exists
  if (!fs.existsSync(path.join(process.cwd(), translationDirName, 'en.json'))) {
    throw new Error("No 'en.json' file found in 'translation' directory");
  }

  const migrationDir = path.join(translationDir, migrationDirName);
  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir);
  }

  const historyFilePath = path.join(migrationDir, historyFileName);
  if (!fs.existsSync(historyFilePath)) {
    fs.writeFileSync(historyFilePath, JSON.stringify([], null, 2));
  }
  return { translationDir, historyFilePath, migrationDir };
}
