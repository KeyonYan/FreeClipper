import { chat } from "@/utils/chat";
import type { Meta, StoryObj } from "@storybook/react";
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
		handleClip: async (element, toast, confirm) => {
			const { update, dismiss } = toast({
				title: "initiating chat...",
				duration: 60_000,
				progress: 0,
			});

			const res = await chat(element.textContent ?? "", (payload) => {
				if (payload.status === "progress") {
					update({
						title: `Loading ${payload.name}...`,
						progress: payload.progress,
					});
				}
				if (payload.status === "ready") {
					update({
						title: `Model ${payload.model} is ready for ${payload.task}...`,
						progress: 0,
					});
				}
				if (payload.status === "start_inference") {
					update({
						title: "Start Inference...",
						progress: 0,
					});
				}

				if (payload.status === "complete") {
					dismiss();

					confirm({
						title: "Chat Result",
						description: `elapsed: ${payload.elapsed / 1000}s`,
						body: JSON.stringify(payload.output),
					});
				}
			});

			// const notionKey = await getNotionKey();
			// const clipDatabaseInfo = await getClipDatabaseInfo();
			// if (notionKey === null || clipDatabaseInfo === null) {
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
