import path from "node:path";
import react from "@vitejs/plugin-react";
import type { UserConfigExport } from "vite";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";

async function app(): Promise<UserConfigExport> {
	return defineConfig({
		plugins: [
			react(),
			dts({
				insertTypesEntry: true,
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "../src"),
			},
		},
		server: {
			port: 6007,
			proxy: {
				"/api": {
					target: "https://api.notion.com/v1",
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
	});
}
// https://vitejs.dev/config/
export default app;
