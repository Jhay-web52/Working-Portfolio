import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**", "build/**"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // eslint-config-next 16 ships the React Compiler rule set at "error"
      // by default. This project doesn't opt into the React Compiler, and
      // this specific rule flags standard, correct patterns (fetch-on-mount
      // effects, SSR-hydration flags) as hard errors. Keep it visible as a
      // warning rather than failing the build over idiomatic React code.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];

export default eslintConfig;
