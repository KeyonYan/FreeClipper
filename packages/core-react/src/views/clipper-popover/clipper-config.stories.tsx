import type { Meta, StoryObj } from "@storybook/react";
import { ClipperPopover } from "./index";

import { Provider } from "@/components/clipper-provider";
import { getClipDatabaseInfo, getNotionKey, setClipDatabaseInfo, setNotionKey } from "../../mocks";

const meta: Meta<typeof ClipperPopover> = {
	title: "ClipperPopover",
	component: ClipperPopover,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<>
				<Provider>
					<Story />
				</Provider>
			</>
		),
	],
	args: {
		getNotionKey,
		getClipDatabaseInfo,
		setNotionKey,
		setClipDatabaseInfo,
	},
};

export default meta;

export const Default: StoryObj<typeof ClipperPopover> = {};
