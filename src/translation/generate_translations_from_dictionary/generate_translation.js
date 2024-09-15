import * as fs from 'fs';
import * as path from 'path';
import { GenerateTranslationMigration } from 'src/migrations/migration_generation';
const translationDirName = process.env.TRANSLATION_DIR_NAME;

export async function GenerateTranslation(langs, source) {
  if (langs.includes('en')) {
    langs = langs.filter((lang) => lang !== 'en');
  }

  // Check if the "en.json" file exists
  if (!fs.existsSync(path.join(process.cwd(), translationDirName, 'en.json'))) {
    throw new Error("No 'en.json' file found in 'translation' directory");
  }

  // Read the "en.json" file
  const enFilePath = path.join(process.cwd(), translationDirName, 'en.json');
  const enContent = fs.readFileSync(enFilePath, 'utf8');
  const enJson = JSON.parse(enContent);

  // Create the "translation" directory if it doesn't exist
  const translationDir = path.join(process.cwd(), translationDirName);
  if (!fs.existsSync(translationDir)) {
    fs.mkdirSync(translationDir);
  }

  let translation = {};
  for (const lang of langs) {
    if (source === 'gemini') {
      console.log('Still in progress...');
    } else {
      const changes = await GenerateTranslationMigration(enJson);
      console.log('changes', changes);
      if (!changes) {
        console.log('No changes to translate');
        return;
      }
      translation = await translateObject(changes, lang, source);
    }

    // Write the translation object to a JSON file
    fs.writeFileSync(
      path.join(translationDir, `${lang}.json`),
      JSON.stringify(translation, null, 2)
    );
  }

  GenerateTranslationFile(langs);
}
