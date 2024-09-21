import { ToastAction } from "@/components/ui/toast";
import type { Meta, StoryObj } from "@storybook/react";
import { HTMLarkdown } from "htmlarkdown";
import React from "react";
import { LocalStorageKeys } from "../../consts";
import { getClipDatabaseInfo, getNotionKey } from "../../mocks";
import { parse2Block } from "./dom-parser";
import { InspectorTargetExample } from "./example";
import { DomInspector } from "./index";

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
		handleClip: async (element, toast) => {
			console.log(element);
			const htmlarkdown = new HTMLarkdown({
				urlTransformer: (url, element, options) => {
					return `http://www.baidu.com/${url}`;
				},
			});

			const res = htmlarkdown.convert(element);
			console.log(res);

			// const notionKey = await getNotionKey();
			// const clipDatabaseInfo = await getClipDatabaseInfo();
			// if (notionKey === null || clipDatabaseInfo === null) {
			// 	toast({
			// 		title: "❌ Clip Failed",
			// 		description: "NotionKey or ClipDatabaseInfo is not set. Please set them in the extension.",
			// 		duration: 3000,
			// 	});
			// 	return;
			// }

			// toast({
			// 	title: "✂ isClipping",
			// 	description: `Clipping to database ${clipDatabaseInfo.name}`,
			// 	duration: 3000,
			// });

			// const blocks = parse2Block(element as HTMLElement);
			// const uploadRes = await onClip(blocks, notionKey, clipDatabaseInfo.id, document.title);
			// if (uploadRes?.success) {
			// 	toast({
			// 		title: "✅ Clip Success",
			// 		description: "Open the notion page",
			// 		duration: 3000,
			// 		action: (
			// 			<ToastAction altText="Open" onClick={() => window.open(uploadRes.url)}>
			// 				Open
			// 			</ToastAction>
			// 		),
			// 	});
			// } else {
			// 	toast({
			// 		title: "❌ Clip Failed",
			// 		description: `${uploadRes.message ?? "Unknown Error"}`,
			// 		duration: 3000,
			// 	});
			// }
		},
		toggleHotKey: "Q",
		levelDownHotKey: "W",
		levelUpHotKey: "S",
	},
};

export default meta;

export const Default: StoryObj<typeof DomInspector> = {};
