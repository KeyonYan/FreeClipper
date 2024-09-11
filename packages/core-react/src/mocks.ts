import type { DatabaseInfo } from "@/components/clipper-config/index";

export enum LocalStorageKeys {
	NotionKey = "test:notionKey",
	NotionDatabaseInfo = "test:clipDatabaseInfo",
	ClipperModeConfig = "test:modeConfig",
}

export async function getNotionKey() {
	return localStorage.getItem(LocalStorageKeys.NotionKey);
}

export async function getClipDatabaseInfo() {
	const res = localStorage.getItem(LocalStorageKeys.NotionDatabaseInfo);
	if (!res) {
		return null;
	}
	return JSON.parse(res) as DatabaseInfo;
}

export async function setNotionKey(key: string) {
	localStorage.setItem(LocalStorageKeys.NotionKey, key);
}

export async function setClipDatabaseInfo(info: DatabaseInfo) {
	localStorage.setItem(LocalStorageKeys.NotionDatabaseInfo, JSON.stringify(info));
}

export function getModeConfig() {
	const res = localStorage.getItem(LocalStorageKeys.ClipperModeConfig);
	if (!res) {
		return {};
	}
	return JSON.parse(res) as Record<string, boolean>;
}

export async function setModeConfig(modeConfig: Record<string, boolean>) {
	localStorage.setItem(LocalStorageKeys.ClipperModeConfig, JSON.stringify(modeConfig));
}
