import { useState } from "react";
import type { ChatMessage, LLMConfig } from "./base";
import { chatApi } from "./base";

export function useChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [config, setConfig] = useState<LLMConfig>({
		model: "gpt-3.5-turbo",
		temperature: 0.6,
		top_p: 1.0,
		stream: true,
		presence_penalty: 0.0,
		frequency_penalty: 0.0,
		secret: import.meta.env.VITE_OPENAI_API_KEY,
	});
	const [error, setError] = useState<Error | null>(null);
	const [loading, setLoading] = useState(false);
	const [pendingMessage, setPendingMessage] = useState<string | null>(null);

	const getCreatedMessage = (message: string) => {
		const result: ChatMessage[] = [...messages, { content: message, role: "user" }];
		return result.filter((m) => m.content !== "" && m.state !== "pending");
	};

	const chat = async (message: string) => {
		if (loading) return;
		if (!message) return;
		setLoading(true);
		const messages = getCreatedMessage(message);
		setMessages(messages);
		chatApi.chat({
			config,
			messages,
			onUpdate: (message: string) => {
				setPendingMessage(message);
			},
			onFinish: (message: string) => {
				setMessages((prev) => {
					return [...prev, { content: message, role: "assistant" }];
				});
				setPendingMessage(null);
				setLoading(false);
			},
			onError: (err: Error) => {
				setPendingMessage(null);
				setError(err);
				setLoading(false);
			},
		});
	};

	return {
		pendingMessage,
		messages,
		config,
		setConfig,
		error,
		loading,
		chat,
	};
}
