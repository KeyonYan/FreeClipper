import type { CheckedState } from "@radix-ui/react-checkbox";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import type { ClipperModeProps, Mode, ModeCheckboxProps } from "./types";

export function ClipperMode(props: ClipperModeProps) {
	const { getModeConfig, setModeConfig } = props;
	const [modes, setModes] = useState<Mode[]>([
		{
			key: "free",
			open: true,
			mode: "Free Selection Mode",
			modeDesc: "Press the Q key to activate free selection mode, and press the left mouse to clip.",
		},
		{ key: "copy", open: false, mode: "Copy Mode", modeDesc: "Copy mode updates the clipboard." },
		{
			key: "remember",
			open: false,
			mode: "Remember Mode",
			modeDesc: "Remember the last clipped element, and clip directly.",
		},
		{ key: "freepro", open: false, mode: "Free Selection Pro Mode", modeDesc: "More advanced features." },
	]);

	const initModeConfig = async () => {
		const modeConfig = await getModeConfig();
		if (modeConfig === null) return;

		const newModes = modes.map((mode) => {
			if (modeConfig[mode.key] === undefined) mode.open = false;
			else mode.open = modeConfig[mode.key];
			return mode;
		});

		setModes(newModes);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: This effect should only run once
	useEffect(() => {
		initModeConfig();
	}, []);

	const onCheckedChange = (checked: CheckedState, key: string) => {
		const newModes = modes.map((mode) => {
			if (mode.key === key) mode.open = checked === true;
			return mode;
		});
		setModes(newModes);
		const modeConfig = newModes.reduce(
			(acc, mode) => {
				acc[mode.key] = mode.open;
				return acc;
			},
			{} as { [key: string]: boolean },
		);

		setModeConfig(modeConfig);
	};
	return (
		<div className="flex flex-col gap-4">
			{modes.map((mode) => (
				<div className="flex items-center space-x-2" key={mode.key}>
					<Checkbox
						id={mode.key}
						checked={mode.open}
						onCheckedChange={(checked) => onCheckedChange(checked, mode.key)}
					/>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<label
									htmlFor={mode.key}
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									{mode.mode}
								</label>
							</TooltipTrigger>
							<TooltipContent align="start">
								<p>{mode.modeDesc}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}
