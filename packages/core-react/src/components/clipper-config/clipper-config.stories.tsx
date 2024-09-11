import type { Meta, StoryObj } from "@storybook/react";
import { ClipperConfig } from "./index";
import type { DatabaseInfo } from "./index";
import { getNotionKey, getClipDatabaseInfo, setNotionKey, setClipDatabaseInfo } from "../../mocks";

const meta: Meta<typeof ClipperConfig> = {
	title: "ClipperConfig",
	component: ClipperConfig,
	tags: ["autodocs"],
	args: {
		getNotionKey,
		getClipDatabaseInfo,
		setNotionKey,
		setClipDatabaseInfo,
	},
};

export default meta;

export const Default: StoryObj<typeof ClipperConfig> = {};
