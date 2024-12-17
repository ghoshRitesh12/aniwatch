import { defineConfig } from "tsup";
import { execSync } from "child_process";

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

  // @ts-ignore
  onSuccess() {
    execSync(
      "pwd && cp ./src/extractors/__megacloud.min.js ./dist/__megacloud.min.js"
    );
    return undefined;
  },
});
