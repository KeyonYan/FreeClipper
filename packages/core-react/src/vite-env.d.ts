/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_NOTION_PROXY: string;
	readonly VITE_OPENAI_API_KEY: string;
	readonly VITE_OPENAI_API_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
