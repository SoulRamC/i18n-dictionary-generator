import { GenerateTranslation } from '../utils/generate_translations_from_files/generate_translations.js';

export default (program) => {
  program
    .command('gtff')
    .description('Generate translation files')
    .argument('[langs...]', 'The languages to generate the translations for')
    .action(async (langs) => {
      await GenerateTranslation(langs);
      console.log('Translation files generated successfully');
    });
};
