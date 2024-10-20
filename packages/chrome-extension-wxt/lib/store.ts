import type { DatabaseInfo } from "free-clipper-core-react";
import { storage } from "wxt/storage";

enum LocalStorageKeys {
	NotionKey = "local:freeclipper:notionKey",
	NotionDatabaseInfo = "local:freeclipper:clipDatabaseInfo",
	ClipperModeConfig = "local:freeclipper:modeConfig",
}

export const notionKey = storage.defineItem<string>(LocalStorageKeys.NotionKey);

export async function getNotionKey() {
	return storage.getItem<string>(LocalStorageKeys.NotionKey);
}

export async function getClipDatabaseInfo() {
	const res = await storage.getItem<DatabaseInfo>(LocalStorageKeys.NotionDatabaseInfo);
	return res;
}

export async function setNotionKey(key: string) {
	const res = await storage.setItem<string>(LocalStorageKeys.NotionKey, key);
	return res;
}

export async function setClipDatabaseInfo(info: DatabaseInfo) {
	const res = await storage.setItem<DatabaseInfo>(LocalStorageKeys.NotionDatabaseInfo, info);
	return res;
}

export async function getModeConfig() {
	const res = await storage.getItem<Record<string, boolean>>(LocalStorageKeys.ClipperModeConfig);
	return res ?? {};
}

export async function setModeConfig(modeConfig: Record<string, boolean>) {
	await storage.setItem<Record<string, boolean>>(LocalStorageKeys.ClipperModeConfig, modeConfig);
}
