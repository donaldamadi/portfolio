import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next 16 ships its ESLint config as native flat config, so it's imported
// directly. The old FlatCompat wrapper can't load it any more.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "node_modules/**", "out/**", "next-env.d.ts"]),
]);

export default eslintConfig;
