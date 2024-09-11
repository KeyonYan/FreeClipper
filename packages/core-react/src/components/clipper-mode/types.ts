import type { CheckedState } from "@radix-ui/react-checkbox";

export interface Mode {
	key: string;
	open: boolean;
	mode: string;
	modeDesc?: string;
}

export interface ModeCheckboxProps {
	modeKey: string;
	open: boolean;
	mode: string;
	onCheckedChange: (checked: CheckedState, modeKey: string) => void;
}

export interface ClipperModeProps {
	getModeConfig: () => Promise<Record<string, boolean>>;
	setModeConfig: (modeConfig: Record<string, boolean>) => Promise<void>;
}
