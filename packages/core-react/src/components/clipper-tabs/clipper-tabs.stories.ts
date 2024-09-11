import type { Meta, StoryObj } from "@storybook/react";
import { ClipperTabs } from "./index";

const meta: Meta<typeof ClipperTabs> = {
	title: "ClipperTabs",
	component: ClipperTabs,
	tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof ClipperTabs> = {
	args: {
		tabs: [
			{
				value: "tab1",
				label: "Tab 1",
				content: "Tab 1 content",
			},
			{
				value: "tab2",
				label: "Tab 2",
				content: "Tab 2 content",
			},
		],
	},
};
