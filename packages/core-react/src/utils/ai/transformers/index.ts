import { confirm } from "@/components/ui/use-modal";
import { toast } from "@/components/ui/use-toast";
import type { TextGenerationOutput } from "@huggingface/transformers";
import type { ChatMessage, ChatOptions, ChatService } from "../base";

export type LLMSendMessage = {
	type: "chat";
	messages: ChatMessage[];
};

export type LLMOutputMessage =
	| {
			status: "complete";
			output: TextGenerationOutput[];
			elapsed: number;
	  }
	| {
			status: "start_inference";
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

		const { update, dismiss } = toast({
			title: "initiating chat...",
			duration: 60_000,
			// progress: 0,
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

			if (data.status === "complete") {
				dismiss();

				confirm({
					title: "Chat Result",
					description: `elapsed: ${data.elapsed / 1000}s`,
					body: JSON.stringify(data.output),
				});
			}
		});

		this.worker?.postMessage({ type: "chat", messages: options.messages } satisfies LLMSendMessage);
	}
}
