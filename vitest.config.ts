import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "aniwatch",
    environment: "node",
    testTimeout: 6000,
  },
});
