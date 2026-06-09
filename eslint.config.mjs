import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Pin the React version explicitly. eslint-plugin-react's auto-detection
  // calls an ESLint API (context.getFilename) removed in ESLint 10, which
  // crashes rule loading; an explicit version skips detection entirely.
  {
    settings: { react: { version: "19.2" } },
    rules: {
      // React Compiler advisory rules (eslint-plugin-react-hooks v6). This
      // project does not run the React Compiler; these rules flag patterns we
      // use deliberately — imperative ref mutation in rAF animation loops
      // (the hand-rolled spring engine) and the standard server→draft state
      // sync in admin forms. They are not correctness bugs, so we disable them.
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
