import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  { rules: pluginJs.rules, plugins: ["@eslint/js"] },
];
