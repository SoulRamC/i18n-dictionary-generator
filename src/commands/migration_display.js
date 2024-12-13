import { DisplayMigrations } from '../migrations/index.js';

export default (program) => {
  program
    .command('show')
    .description('Display Migrations')
    .action(() => {
      DisplayMigrations();
    });
};
