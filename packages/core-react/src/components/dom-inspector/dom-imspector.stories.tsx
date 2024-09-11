import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { InspectorTargetExample } from "./example";
import { DomInspector } from "./index";
import { LocalStorageKeys } from "../../consts";
import { getClipDatabaseInfo, getNotionKey } from "../../mocks";

const meta: Meta<typeof DomInspector> = {
	title: "DomInspector",
	component: DomInspector,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<>
				<InspectorTargetExample />
				<Story />
			</>
		),
	],
	args: {
		getClipDatabaseInfo,
		getNotionKey,
		toggleHotKey: "Q",
		levelDownHotKey: "W",
		levelUpHotKey: "S",
		onClip: async () => {
			return {
				message: "success",
				success: true,
			};
		},
	},
};

export default meta;

export const Default: StoryObj<typeof DomInspector> = {};
