import { ClientOpenAIServie } from "./openai";

export const ROLES = ["system", "user", "assistant"] as const;
export type MessageRole = (typeof ROLES)[number];

export interface MessageImageContent {
	type: "image_url";
	image_url: { url: string };
}
export interface MessageTextContent {
	type: "text";
	text: string;
}

export type MessageContent = (MessageTextContent | MessageImageContent)[];

export interface ChatMessage {
	role: MessageRole;
	content: string | MessageContent;
	state?: "pending" | "success" | "error";
}

export interface LLMConfig {
	model: string;
	temperature?: number;
	top_p?: number;
	stream?: boolean;
	presence_penalty?: number;
	frequency_penalty?: number;
	secret?: string;
}

export interface LLMModel {
	name: string;
	available: boolean;
}

export interface ChatOptions {
	messages: ChatMessage[];
	config: LLMConfig;

	onUpdate?: (message: string) => void;
	onFinish: (message: string) => void;
	onError?: (err: Error) => void;
	onController?: (controller: AbortController) => void;
}

export class ChatApi {
	openai = new ClientOpenAIServie();

	async chat(options: ChatOptions) {
		this.openai.chat(options);
	}
}

export const chatApi = new ChatApi();
