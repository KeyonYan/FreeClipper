import type { toast } from "@/components/ui/use-toast";
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
	handleClip: (element: HTMLElement, t: typeof toast) => Promise<void>;
}

export type PositionCssMap = Record<"container" | "margin" | "border" | "padding", Record<string, string>>;
