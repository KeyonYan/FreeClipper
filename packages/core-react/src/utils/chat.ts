import type { TextGenerationOutput } from "@xenova/transformers";

export type LLMSendMessage = {
	type: "chat";
	text: string;
};

export type LLMOutPutMessage =
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

type LLMWorkerMessage = LLMLoadMessage | LLMOutPutMessage;

let worker: null | Worker = null;

function initWorker() {
	if (!worker) {
		worker = new Worker(new URL("./llm.worker.ts", import.meta.url), {
			type: "module",
		});
	}
}

export async function chat(text: string, onMessage: (message: LLMWorkerMessage) => void) {
	initWorker();

	worker?.postMessage({ type: "chat", text } satisfies LLMSendMessage);

	return new Promise<TextGenerationOutput[]>((resolve) => {
		worker?.addEventListener("message", (e: MessageEvent<LLMWorkerMessage>) => {
			const { data } = e;
			if (data.status === "complete") {
				resolve(data.output);
			}
			onMessage(data);
		});
	});
}
