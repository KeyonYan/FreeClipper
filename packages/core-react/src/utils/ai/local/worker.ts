import { type TextGenerationOutput, env, pipeline } from "@xenova/transformers";
import type { LLMOutputMessage, LLMSendMessage } from "./chat";

// Specify a custom location for models (defaults to '/models/').
env.localModelPath = "/models/";

// Disable the loading of remote models from the Hugging Face Hub:
env.allowRemoteModels = false;

const generatorPromise = pipeline("text-generation", "Xenova/Qwen1.5-0.5B-Chat", {
	progress_callback: self.postMessage,
});

self.addEventListener("message", async (event: MessageEvent<LLMSendMessage>) => {
	const { text } = event.data;

	const generator = await generatorPromise;

	self.postMessage({ status: "start_inference" } satisfies LLMOutputMessage);

	const startTime = performance.now();

	const output = await generator(
		[
			// { role: "system", content: "You are a helpful assistant." },
			{ role: "user", content: text },
		],
		{
			max_new_tokens: 1280,
			do_sample: false,
			// return_full_text: false,
		},
	);

	const elapsed = performance.now() - startTime;

	// Send the output back to the main thread
	self.postMessage({
		status: "complete",
		output: output as TextGenerationOutput[],
		elapsed,
	} satisfies LLMOutputMessage);
});
