import { DisplayMigrations } from '../migrations/index.js';

export default (program) => {
  program
    .command('md')
    .description('Display Migrations')
    .action(() => {
      DisplayMigrations();
    });
};
