#!/usr/bin/env node
import { Command } from "commander";

import generate_translation_from_dictionary from "./commands/generate_translation_from_dictionary.js";
import "dotenv/config";

const program = new Command();

// generate_translation_from_files(program);

generate_translation_from_dictionary(program);

program.parse(process.argv);
