import { GenerateDefaultTranslationDictionary } from 'src/utils/create_default_dictionary.js';

export default (program) => {
  program
    .command('gd')
    .description('Generate default translation dictionary named en.json')
    .action(async () => {
      await GenerateDefaultTranslationDictionary();
      console.log('Generated default translation dictionary');
    });
};
