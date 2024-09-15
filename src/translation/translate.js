import { RetryRequest } from "../utils/retry_request.js";
import translate from 'translate-google'


async function GetTranslation(text, source, target) {
  let response;
  if (source === 'google') {
    response = await RetryRequest(() =>
      translate(text, { from: 'en', to: target }).then((res) => res)
    );
  }

  if (source === 'libretranslate') {
    response = await RetryRequest(() =>
      fetch(
        process.env.LIBRETRANSLATE_URL || 'http://localhost:5000/translate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: 'en',
            target: target,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => data.translatedText)
    );
  }

  return response;
}


export async function translateObject(obj, lang, source) {
  const translatedObj = {};

  const translateEntry = async ([key, value]) => {
    if (typeof value === 'object') {
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
  await Promise.all(Object.entries(obj).map(translateEntry));

  return translatedObj;
}
