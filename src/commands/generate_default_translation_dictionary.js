import { GenerateDefaultTranslationDictionary } from '../utils/generate_default_translation_dictionary/generate_default_translation_dictionary.js';

export default (program) => {
  program
    .command('gdtd')
    .description('Generate default translation dictionary named en.json')
    .action(async () => {
      await GenerateDefaultTranslationDictionary();
      console.log('Generated default translation dictionary');
    });
};
