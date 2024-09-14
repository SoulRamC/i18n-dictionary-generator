import * as fs from 'fs';
import * as path from 'path';

export function DisplayMigrations() {
  const migrationHistoryDir = `${process.env.TRANSLATION_DIR_NAME}/migration`;
  const migrationHistoryPath = path.join(
    process.cwd(),
    migrationHistoryDir,
    'migration_history.json'
  );

  if (!fs.existsSync(migrationHistoryPath)) {
    console.log('No migrations available.');
    return;
  }

  const history = readMigrationHistory(migrationHistoryPath);

  if (history.length === 0) {
    console.log('No migrations found in history.');
    return;
  }

  console.log('Migration History:');
  console.log('-------------------');

  history.forEach((entry, index) => {
    console.log(`Migration #${index + 1}:`);
    console.log(`  - Filename: ${entry.migration}`);
    console.log(`  - Applied: ${entry.applied ? 'Yes' : 'No'}`);
    console.log(`  - Timestamp: ${formatTimestamp(entry.timestamp)}`);
    console.log('-------------------');
  });
}

function readMigrationHistory(migrationHistoryPath) {
  const fileData = JSON.parse(fs.readFileSync(migrationHistoryPath, 'utf8'));
  return fileData;
}

function formatTimestamp(timestamp) {
  const year = timestamp.substring(0, 4);
  const month = timestamp.substring(4, 6);
  const day = timestamp.substring(6, 8);
  const hours = timestamp.substring(9, 11);
  const minutes = timestamp.substring(11, 13);
  const seconds = timestamp.substring(13, 15);

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
