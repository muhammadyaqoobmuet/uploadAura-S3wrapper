import { defineConfig } from "tsup";

export default defineConfig({
  // The entry point. tsup reads this file and follows all imports.
  entry: ["src/index.ts"],

  // Emit BOTH CommonJS (.cjs) and ES Modules (.mjs).
  // CJS = works with require(). ESM = works with import.
  // You need both for maximum compatibility.
  format: ["cjs", "esm"],

  // Run tsc to emit .d.ts declaration files.
  // Consumers get full IntelliSense on your SDK.
  // Pass ignoreDeprecations so tsup's internal TS worker (which injects
  // baseUrl for path resolution) doesn't fail on TypeScript 6.
  dts: {
    compilerOptions: {
      ignoreDeprecations: "6.0",
    },
  },

  // Generate source maps. Consumers can debug into your code.
  sourcemap: true,

  // Wipe dist/ before each build. Prevents stale output.
  clean: true,

  // Don't bundle these packages. They stay as require('form-data')
  // in the output. Consumers install them from their own package.json.
  // tsup auto-externalises everything in "dependencies" by default.
  external: ["form-data", "node-fetch"],

  // Minify in production builds. Makes the bundle smaller.
  // Set to false during dev for readable output.
  minify: false,

  // Target Node 18+. esbuild uses this to decide what syntax
  // to downcompile and what to leave as-is.
  target: "node18",

  // Print file sizes after each build. Useful for keeping
  // your bundle lean over time.
  treeshake: true,
});
