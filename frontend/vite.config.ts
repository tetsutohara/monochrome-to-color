import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    host: true,
    watch: {
      usePolling: true,
    },
    port: 5173,
  },
});
