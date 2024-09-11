import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import tailwindcss from "tailwindcss";
import type { UserConfigExport } from "vite";
import dts from "vite-plugin-dts";

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
		css: {
			postcss: {
				plugins: [tailwindcss],
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
