import { GenerateTranslationMigration } from '../migrations/index.js';

export default (program) => {
  program
    .command('gm')
    .description('Generate Migrations')
    .action(() => {
      GenerateTranslationMigration();
    });
};
