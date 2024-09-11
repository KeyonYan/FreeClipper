import type { DatabaseInfo } from "../clipper-config";

export interface ClipResult {
	success: boolean;
	message: string;
	url?: string;
}

export interface DomInspectorProps {
	toggleHotKey: string;
	levelUpHotKey: string;
	levelDownHotKey: string;
	getNotionKey: () => Promise<string | null>;
	getClipDatabaseInfo: () => Promise<DatabaseInfo | null>;
	onClip: (blocks: any, notionKey: string, clipDatabaseId: string, title: string) => Promise<ClipResult>;
}

export type PositionCssMap = Record<"container" | "margin" | "border" | "padding", Record<string, string>>;
