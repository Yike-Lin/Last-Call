import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: [
      ".agents/**",
      ".next/**",
      "node_modules/**",
      "tools/blender_mcp/**"
    ]
  },
  ...nextVitals,
  ...nextTypescript
];

export default config;
