import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import translate from "@iamtraction/google-translate";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// async function generateTranslateViaGenerativeAI(enJson, targetLanguage) {
//   console.log(
//     "Using gemini-1.5-flash model. API key:",
//     process.env.GEMINI_API_KEY,
//   );
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     generationConfig: { responseMimeType: "application/json" },
//   });
//   const prompt = `Translate the following JSON values to ${targetLanguage}. Keep the keys in English. Return only the translated JSON:\n\n${enJson}`;
//   let result = await model.generateContent(prompt);
//   console.log(result.response.text());
//   return result.response.text();
// }

async function retry(fn, retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Retrying... (${i + 1}/${retries})`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function GetTranslation(text, source, target) {
  let response;
  if (source === "google") {
    response = await retry(() =>
      translate(text, { from: "en", to: target }).then((res) => res.text),
    );
  }

  if (source === "libretranslate") {
    response = await retry(() =>
      axios
        .post("http://localhost:5000/translate", {
          q: text,
          source: "en",
          target: target,
        })
        .then((res) => res.data.translatedText),
    );
  }

  return response;
}

// Recursive function to translate nested objects using promises
async function translateObject(obj, lang, source) {
  const translatedObj = {};

  const translateEntry = async ([key, value]) => {
    if (typeof value === "object") {
      // Recursively translate nested objects
      translatedObj[key] = await translateObject(value, lang, source);
    } else {
      try {
        const response = await GetTranslation(value, source, lang);
        translatedObj[key] = response;
        console.log(`Translated "${value}" to "${lang}" using ${source}`);
      } catch (err) {
        console.log(`Failed to translate "${value}" to "${lang}":`, err);
      }
    }
  };

  // Use Promise.all to handle all translations in parallel
  await Promise.all(Object.entries(obj).map(translateEntry), {
    concurrency: 10,
    timeout: 10000,
  });

  return translatedObj;
}

export async function GenerateTranslation(langs, source) {
  // Read the "en.json" file
  const enFilePath = path.join(process.cwd(), "translation", "en.json");
  const enContent = fs.readFileSync(enFilePath, "utf8");
  const enJson = JSON.parse(enContent);

  // Create the "translation" directory if it doesn't exist
  const translationDir = path.join(process.cwd(), "translation");
  if (!fs.existsSync(translationDir)) {
    fs.mkdirSync(translationDir);
  }

  let translation = {};
  for (const lang of langs) {
    if (source === "gemini") {
      console.log("Still in progress...");
      // translation = await generateTranslateViaGenerativeAI(enJson, lang);
    } else {
      translation = await translateObject(enJson, lang, source);
    }

    // Write the translation object to a JSON file
    fs.writeFileSync(
      path.join(translationDir, `${lang}.json`),
      JSON.stringify(translation, null, 2),
    );
  }
}
