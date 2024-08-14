import { GenerateTranslation } from "../helpers/generate_translations_from_files/generate_translations.js";

/**
 * @param {import("commander")} Command
 *
 */
export default (program) => {
  program
    .command("gtff")
    .description("Generate translation files")
    .argument("[langs...]", "The languages to generate the translations for")
    .action(async (langs) => {
      await GenerateTranslation(langs);
      console.log("Translation files generated successfully");
    });
};
