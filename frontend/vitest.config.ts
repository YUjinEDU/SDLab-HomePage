import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      "next/cache": path.resolve(__dirname, "src/__mocks__/next/cache.ts"),
    },
  },
  test: { environment: "node", globals: true },
});
