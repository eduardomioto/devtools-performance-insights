/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  singleQuote: false,
  tabWidth: 2,
  printWidth: 120,
  endOfLine: "auto",
  trailingComma: "es5",
  tailwindConfig: "./tailwind.config.ts",
};