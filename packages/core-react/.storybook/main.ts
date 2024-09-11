import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
	addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
	framework: {
		name: "@storybook/react-vite",
		options: {
			builder: {
				viteConfigPath: ".storybook/vite.config.ts",
			},
		},
	},
	docs: {
		autodocs: "tag",
	},
	viteFinal: async (config, { configType }) => {
		const { mergeConfig } = await import("vite");

		if (configType === "DEVELOPMENT") {
			return mergeConfig(config, {
				server: {
					proxy: {
						"/notion-api": {
							target: "https://api.notion.com/v1",
							changeOrigin: true,
							rewrite: (path) => path.replace(/^\/notion-api/, ""),
						},
					},
				},
			});
		}

		return config;
	},
};
export default config;
