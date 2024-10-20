import type { confirm } from "@/components/ui/use-modal";
import type { toast } from "@/components/ui/use-toast";

export interface DomInspectorProps {
	toggleHotKey: string;
	levelUpHotKey: string;
	levelDownHotKey: string;
	handleClip: (element: HTMLElement, t: typeof toast, d: typeof confirm) => Promise<void>;
}

export type PositionCssMap = Record<"container" | "margin" | "border" | "padding", Record<string, string>>;
