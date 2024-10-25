import type { ChatOptions, ChatService } from "../base";

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
interface SimulateChatOptions {
	onUpdate?: (output: string) => void;
	onFinish?: (output: string) => void;
	interval?: number;
	chunkSize?: number;
}

const defatultSimulateChatOptions: Required<SimulateChatOptions> = {
	onUpdate: () => {},
	onFinish: () => {},
	interval: 80,
	chunkSize: 2,
};

export async function simulateChat(text: string, option: SimulateChatOptions) {
	let currentIndex = 0;
	const mergedOption: Required<SimulateChatOptions> = { ...defatultSimulateChatOptions, ...option };

	const outputNextChunk = async () => {
		const chunkSize = 20;
		const remainingText = text.slice(0, currentIndex + chunkSize);

		if (remainingText.length !== text.length) {
			mergedOption.onUpdate(remainingText);
			currentIndex += chunkSize;
			await delay(mergedOption.interval);
			outputNextChunk();
		} else {
			mergedOption.onFinish(text);
		}
	};
	await delay(800);
	outputNextChunk();
}

export class MockService implements ChatService {
	async chat(options: ChatOptions) {
		simulateChat("Hello, how can I help you?", {
			onUpdate: options.onUpdate,
			onFinish: options.onFinish,
		});
	}
}
