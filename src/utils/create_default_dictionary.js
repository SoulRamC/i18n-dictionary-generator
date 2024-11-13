// @ts-nocheck
import * as fs from 'fs';
import * as path from 'path';
import readline from 'readline';

async function promptUser() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const stylizedMessage = `⚠️ \nThis will *permanently overwrite* the existing en.json file, and any previous translations may be lost.\nDo you wish to proceed? (y/n): `;

  return new Promise((resolve) => {
    rl.question(stylizedMessage, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

export async function GenerateDefaultTranslationDictionary() {
  const files = fs
    .readdirSync(path.join(process.cwd()), { recursive: true })
    .filter((file) => file.endsWith('.tsx'));

  // Create the "translation" directory if it doesn't exist
  const translationDir = path.join(process.cwd(), 'i18n');
  if (!fs.existsSync(translationDir)) {
    fs.mkdirSync(translationDir);
  }

  const enJsonPath = path.join(translationDir, 'en.json');

  // Check if en.json exists and prompt the user if it does
  if (fs.existsSync(enJsonPath)) {
    const shouldOverwrite = await promptUser();

    if (!shouldOverwrite) {
      console.log('Operation canceled by the user.');
      return;
    }
  }

  const translation = {};

  // Loop through all files with the ".tsx" extension
  for (const file of files) {
    const filePath = path.join('.', file);
    const content = fs.readFileSync(filePath, 'utf8');

    // Find all the strings inside the t("") calls
    const regex = /\bt\(["'](.*?)["']\)/g;
    const matches = [...content.matchAll(regex)];

    // Create the translation object
    for (const match of matches) {
      const keys = match[1].split('.');
      let currentObj = translation;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) {
          currentObj[key] = '';
        } else {
          if (!currentObj[key]) {
            currentObj[key] = {};
          }
          currentObj = currentObj[key];
        }
      }
    }
  }

  // Write the translation object to a JSON file
  fs.writeFileSync(enJsonPath, JSON.stringify(translation, null, 2));
  console.log(
    `en.json has been successfully generated/updated at ${enJsonPath}`
  );
}
