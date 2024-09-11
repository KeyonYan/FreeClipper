import { defineConfig } from "wxt";
import react from "@vitejs/plugin-react";

// See https://wxt.dev/api/config.html
export default defineConfig({
	vite: () => ({
		plugins: [react()],
	}),
	manifest: {
		permissions: ["storage"],
	},
	runner: {
		startUrls: ["https://react-challenges-kappa.vercel.app/"],
	},
});
