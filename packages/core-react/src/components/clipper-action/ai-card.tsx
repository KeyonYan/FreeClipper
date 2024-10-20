import { type DraggableCardProps, withDraggableCard } from "@/components/ui/card";
import type { ChatMessage } from "@/utils/ai/base";
import { useChat } from "@/utils/ai/hook";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";

function getLatestBotMessage(messages: ChatMessage[]) {
	const result = messages.filter((m) => m.role === "assistant").at(-1)?.content;
	if (typeof result === "string") return result;
	if (result?.length) return JSON.stringify(result);
	return "";
}

interface ChatbotResultProps extends DraggableCardProps {
	prompt: string;
}

export function ChatbotCardContent({ prompt }: ChatbotResultProps) {
	const { messages, pendingMessage, loading, chat } = useChat();
	const message = pendingMessage || getLatestBotMessage(messages);

	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		chat(prompt);
	}, []);

	return (
		<>
			{message}
			{loading && <Loader2Icon size={16} className="animate-spin" />}
		</>
	);
}

export const ChatBotCard = withDraggableCard(ChatbotCardContent);
