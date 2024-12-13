import { RunMigrations } from '../migrations/index.js';

export default (program) => {
  program
    .command('generate')
    .description('Generate translation using an english dictionary (en.json)')
    .argument(
      'source',
      'The source of translations ( google | libretranslate | gemini )'
    )
    .argument(
      '[langs...]',
      'The languages to generate the translations (en, ar, fr, etc.)'
    )
    .action(async (source, langs) => {
      if (!langs || langs.length === 0) {
        throw new Error('No languages specified');
      }
      if (!['google', 'libretranslate', 'gemini'].includes(source)) {
        throw new Error('Invalid source');
      }

      if (source === 'gemini') throw new Error('Gemini still in progress');

      await RunMigrations(langs, source);
      console.log('Translation files generated successfully');
    });
};
