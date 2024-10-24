import { env, pipeline } from "@huggingface/transformers";
import type { LLMOutputMessage, LLMSendMessage } from "./index";

// Specify a custom location for local models (defaults to '/models/').
env.localModelPath = "/models/";

env.allowRemoteModels = true;
env.allowLocalModels = false;

const generatorPromise = pipeline("text-generation", "onnx-community/Llama-3.2-1B-Instruct-q4f16", {
	device: "webgpu",
	dtype: "q4f16",
	progress_callback: self.postMessage,
});
let generator: Awaited<typeof generatorPromise>;
let isProcessing = false;

self.addEventListener("message", async (event: MessageEvent<LLMSendMessage>) => {
	const { messages } = event.data;

	if (isProcessing) {
		self.postMessage({ status: "processing" } satisfies LLMOutputMessage);
		return;
	}

	isProcessing = true;

	if (!generator) {
		generator = await generatorPromise;
	}

	self.postMessage({ status: "start_inference" } satisfies LLMOutputMessage);

	const startTime = performance.now();

	const output = await generator(
		messages.map((message) => {
			return {
				content: String(message.content),
				role: message.role,
			};
		}),
		{
			max_new_tokens: 128,
			do_sample: false,
			use_cache: true,
		},
	);

	const elapsed = performance.now() - startTime;

	// Send the output back to the main thread
	self.postMessage({
		status: "complete",
		output: (Array.isArray(output) ? output.at(-1) : output) as never,
		elapsed,
	});
});
