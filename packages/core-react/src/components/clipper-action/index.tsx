import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import { ChatBubbleIcon, ClipboardCopyIcon, NotionLogoIcon } from "@radix-ui/react-icons";
import { ChatBotCard } from "./ai-card";

import { atom, useAtom } from "jotai";
import { useRef, useState } from "react";
import { useEventListener } from "usehooks-ts";

interface ActionbarAtom {
	show: boolean;
	target?: HTMLElement;
	position: React.CSSProperties;
}

export const actionbarAtom = atom<ActionbarAtom>({
	show: false,
	position: {},
});

export function Actionbar() {
	const [actionbarState, setActionbarState] = useAtom(actionbarAtom);
	const ref = useRef<HTMLDivElement>(null);
	const [showChatCard, setShowChatCard] = useState(false);

	useEventListener("click", (e) => {
		if (ref.current && !ref.current.contains(e.target as Node)) {
			setActionbarState((state) => ({ ...state, show: false }));
		}
	});

	if (!actionbarState.show) return;

	let position = actionbarState.position;
	if (actionbarState.target) {
		const { top, left, bottom, width } = actionbarState.target.getBoundingClientRect();
		const browserHeight = document.documentElement.clientHeight;
		const bottomToViewPort = browserHeight - bottom;
		const topToViewPort = top;
		position = {
			...(position || {}),
			top: topToViewPort > bottomToViewPort ? top : bottom,
			left: left + width / 2,
			transform: "translateX(-50%)",
		};
	}

	const cardPrompt = `请将以下html翻译为markdown: ${actionbarState.target?.textContent ?? ""}`;

	return (
		<>
			{!showChatCard && (
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
						<MenubarTrigger onClick={() => setShowChatCard(true)}>
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
			)}
			{showChatCard && (
				<ChatBotCard
					title="To Markdown With AI"
					prompt={cardPrompt}
					onClose={() => setShowChatCard(false)}
					style={{ top: position.top, left: Number(position.left) - 200 }}
				/>
			)}
		</>
	);
}
