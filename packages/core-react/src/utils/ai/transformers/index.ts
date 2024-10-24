import { toast } from "@/components/ui/use-toast";
import type { ChatMessage, ChatOptions, ChatService } from "../base";

export type LLMSendMessage = {
	type: "chat";
	messages: ChatMessage[];
};

interface TextGenerationOutput {
	generated_text: ChatMessage[];
}

export type LLMOutputMessage =
	| {
			status: "complete";
			output: TextGenerationOutput;
			elapsed: number;
	  }
	| {
			status: "start_inference";
	  }
	| {
			status: "processing";
	  };

type LLMLoadMessage =
	| {
			status: "progress";
			name: string;
			file: string;
			loaded: number;
			total: number;
			progress: number;
	  }
	| {
			status: "initiate" | "download" | "done";
			name: string;
			file: string;
	  }
	| {
			status: "ready";
			task: string;
			model: string;
	  };

type LLMWorkerMessage = LLMLoadMessage | LLMOutputMessage;

export class TransformersService implements ChatService {
	worker: null | Worker = null;

	initWorker() {
		if (!this.worker) {
			this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
				type: "module",
			});
		}
	}

	chat(options: ChatOptions) {
		this.initWorker();

		const { update } = toast({
			title: "Initiating Chat...",
			duration: 60_000,
		});

		this.worker?.addEventListener("message", (e: MessageEvent<LLMWorkerMessage>) => {
			const { data } = e;

			if (data.status === "progress") {
				update({
					title: `Loading ${data.name}...`,
					progress: data.progress,
				});
			}
			if (data.status === "ready") {
				update({
					title: `Model ${data.model} is ready for ${data.task}...`,
					progress: 0,
				});
			}
			if (data.status === "start_inference") {
				update({
					title: "Start Inference...",
					progress: 0,
				});
			}
			if (data.status === "processing") {
				update({
					title: "Already Processing...",
					duration: 2000,
					progress: 100,
				});

				options.onFinish("an error occurred: Already Processing");
			}

			if (data.status === "complete") {
				const lastMessage = data.output.generated_text.at(-1);

				update({
					title: "Chat Complete",
					description: `elapsed: ${data.elapsed / 1000}s`,
					duration: 2000,
					progress: 100,
				});

				options.onFinish(String(lastMessage?.content));
			}
		});

		this.worker?.postMessage({ type: "chat", messages: options.messages } satisfies LLMSendMessage);
	}
}
