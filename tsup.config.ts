import { defineConfig } from "tsup";

export default defineConfig({
    format: ["esm"],
    entry: ["./src/index.ts"],
    dts: true,
    shims: true,
    clean: true,
    splitting: true,
    // minify: true,
    // minifySyntax: true,
    // minifyIdentifiers: true,
    // minifyWhitespace: true,
    globalName: "aniwatch",
    skipNodeModulesBundle: true,
});
