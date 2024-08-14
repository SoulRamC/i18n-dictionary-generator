import * as fs from "fs";
import * as path from "path";

export async function GenerateTranslationMigration() {
  // Read if the translation files exist already
  const promise = new Promise((resolve, reject) => {
    try {
      const date = new Date().toISOString();
      const translationDir = path.join(process.cwd(), "translation");
      if (!fs.existsSync(translationDir)) {
        return;
      }
      const translationFiles = fs
        .readdirSync(translationDir)
        .filter((file) => file.endsWith(".json"));

      if (translationFiles.length === 0) {
        return;
      }

      const migrationDir = path.join(process.cwd(), "translation", "migration");
      if (!fs.existsSync(migrationDir)) {
        fs.mkdirSync(migrationDir);
      }

      const migrationSubDir = path.join(migrationDir, date);
      if (!fs.existsSync(migrationSubDir)) {
        fs.mkdirSync(migrationSubDir);
      }

      for (const file of translationFiles) {
        const srcPath = path.join(translationDir, file);
        const destPath = path.join(migrationSubDir, file);
        fs.renameSync(srcPath, destPath);
      }

      resolve();
    } catch (error) {
      reject(error);
    }
  });
}
