import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  use: { baseURL: "http://127.0.0.1:5173", headless: true },
  reporter: "list",
  webServer: [
    { command: "npm run dev --prefix ../backend", url: "http://127.0.0.1:3000/health", env: { DATABASE_PATH: "./data/e2e-financeiro.db", PORT: "3000" }, reuseExistingServer: false, timeout: 60000 },
    { command: "npm run dev --prefix ../frontend", url: "http://127.0.0.1:5173", reuseExistingServer: false, timeout: 60000 },
  ],
});
