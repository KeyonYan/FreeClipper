export interface DomInspectorProps {
	toggleHotKey: string;
	levelUpHotKey: string;
	levelDownHotKey: string;
	handleClip: (element: HTMLElement) => Promise<void>;
}

export type PositionCssMap = Record<"container" | "margin" | "border" | "padding", Record<string, string>>;
