#!/usr/bin/env node
import { Command } from 'commander';
import { config } from 'dotenv';
import migration_display from './src/commands/migration_display.js';
import init from './src/commands/init.js';
import generate from './src/commands/generate.js';

config();

process.env.TRANSLATION_DIR_NAME = process.env.TRANSLATION_DIR_NAME || 'i18n';
process.env.LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || 'http://localhost:5000/translate';

const program = new Command();

init(program);
generate(program);
migration_display(program);

program.parse(process.argv);
