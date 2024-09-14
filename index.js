#!/usr/bin/env node
import { Command } from 'commander';
import 'dotenv/config';
import migration_display from './src/commands/migration_display.js';
import migration_running from './src/commands/migration_running.js';
import migration_generation from './src/commands/migration_generation.js';

const program = new Command();

migration_display(program);
migration_generation(program);
migration_running(program);

program.parse(process.argv);
