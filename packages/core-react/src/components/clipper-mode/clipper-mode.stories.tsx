import type { Meta, StoryObj } from "@storybook/react";
import { ClipperMode } from "./index";
import { getModeConfig, setModeConfig } from "../../mocks";

const meta: Meta<typeof ClipperMode> = {
	title: "ClipperMode",
	component: ClipperMode,
	tags: ["autodocs"],
};

export const Default: StoryObj<typeof ClipperMode> = {
	args: {
		getModeConfig,
		setModeConfig,
	},
};

export default meta;
