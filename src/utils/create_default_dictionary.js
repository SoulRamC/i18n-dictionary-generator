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
  // Collect all .tsx files recursively
  function getAllTsxFiles(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stats = fs.statSync(fullPath);
      if (stats.isDirectory()) {
        results = results.concat(getAllTsxFiles(fullPath));
      } else if (file.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
    return results;
  }

  const tsxFiles = getAllTsxFiles(process.cwd());

  // Create the "translation" directory if it doesn't exist
  const translationDir = path.join(
    process.cwd(),
    process.env.TRANSLATION_DIR_NAME
  );
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

  // Loop through all collected .tsx files
  for (const filePath of tsxFiles) {
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
          currentObj[key] = formatKey(key);
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

// Helper function to format keys
function formatKey(key) {
  return key
    .replace(/[_-]/g, ' ') // Replace _ and - with spaces
    .toLowerCase() // Convert the key to lowercase
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
}
