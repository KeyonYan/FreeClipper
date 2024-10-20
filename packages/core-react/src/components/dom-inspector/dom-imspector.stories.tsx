import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { chat } from "@/utils/chat";
import { ChatBubbleIcon, ClipboardCopyIcon, NotionLogoIcon } from "@radix-ui/react-icons";
import type { Meta, StoryObj } from "@storybook/react";

import { Provider, atom, createStore, useAtom } from "jotai";
import { useRef } from "react";
import { useEventListener } from "usehooks-ts";
import { useModal } from "../ui/use-modal";
import { InspectorTargetExample } from "./example";
import { DomInspector } from "./index";

const store = createStore();

interface ActionbarAtom {
	show: boolean;
	target?: HTMLElement;
	position?: React.CSSProperties;
}

const actionbarAtom = atom<ActionbarAtom>({
	show: false,
});

function Actionbar() {
	const [actionbarState, setActionbarState] = useAtom(actionbarAtom);
	const ref = useRef<HTMLDivElement>(null);

	useEventListener("click", (e) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			setActionbarState((state) => ({ ...state, show: false }));
		}
	});

	if (!actionbarState.show) return;

	let position = actionbarState.position;
	if (!position && actionbarState.target) {
		const { top, left, bottom, width } = actionbarState.target.getBoundingClientRect();
		const browserHeight = document.documentElement.clientHeight;
		const bottomToViewPort = browserHeight - bottom;
		const topToViewPort = top;
		position = {
			top: topToViewPort > bottomToViewPort ? top : bottom,
			left: left + width / 2,
			transform: "translateX(-50%)",
		};
	}

	return (
		<Menubar ref={ref} className="fixed m-2" style={position}>
			<MenubarMenu>
				<MenubarTrigger>
					<span className="inline-flex items-center gap-1">
						<ChatBubbleIcon />
						Chat
					</span>
				</MenubarTrigger>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>
					<span className="inline-flex items-center gap-1">
						<ClipboardCopyIcon />
						To Markdown
					</span>
				</MenubarTrigger>
			</MenubarMenu>
			<MenubarMenu>
				<MenubarTrigger>
					<span className="inline-flex items-center gap-1">
						<NotionLogoIcon />
						To Notion
					</span>
				</MenubarTrigger>
			</MenubarMenu>
		</Menubar>
	);
}

const meta: Meta<typeof DomInspector> = {
	title: "DomInspector",
	component: DomInspector,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<>
				<Provider store={store}>
					<InspectorTargetExample />
					<Story />
					<Actionbar />
				</Provider>
			</>
		),
	],
	args: {
		handleClip: async (element, toast, confirm) => {
			// const { update, dismiss } = toast({
			// 	title: "initiating chat...",
			// 	duration: 60_000,
			// 	// progress: 0,
			// });

			store.set(actionbarAtom, {
				show: true,
				target: element,
			});

			// confirm({
			// 	title: "Chat Result",
			// 	description: "elapsed:xs",
			// 	body: <ModalContent />,
			// });

			// const res = await chat(element.textContent ?? "", (payload) => {
			// 	if (payload.status === "progress") {
			// 		update({
			// 			title: `Loading ${payload.name}...`,
			// 			progress: payload.progress,
			// 		});
			// 	}
			// 	if (payload.status === "ready") {
			// 		update({
			// 			title: `Model ${payload.model} is ready for ${payload.task}...`,
			// 			progress: 0,
			// 		});
			// 	}
			// 	if (payload.status === "start_inference") {
			// 		update({
			// 			title: "Start Inference...",
			// 			progress: 0,
			// 		});
			// 	}

			// 	if (payload.status === "complete") {
			// 		dismiss();

			// 		confirm({
			// 			title: "Chat Result",
			// 			description: `elapsed: ${payload.elapsed / 1000}s`,
			// 			body: JSON.stringify(payload.output),
			// 		});
			// 	}
			// });

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
