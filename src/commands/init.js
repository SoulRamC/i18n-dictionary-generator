import { GenerateDefaultTranslationDictionary } from '../utils/create_default_dictionary.js';

/**
 * Adds the `generate` command to the Commander.js program.
 *
 * @param {import('commander').Command} program - The Commander.js program instance to which the command will be added.
 * @returns {void}
 */
export default (program) => {
  console.log('transalton dir', process.env.TRANSLATION_DIR_NAME);
  program
    .command('init')
    .description(
      'Scan project and generated default translation dictionary named en.json'
    )
    .action(async () => {
      await GenerateDefaultTranslationDictionary();
    });
};
