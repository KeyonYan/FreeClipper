import { EventStreamContentType, type FetchEventSourceInit, fetchEventSource } from "@microsoft/fetch-event-source";
import { prettyObject } from "../../format";
import type { ChatOptions } from "../base";

export class ClientOpenAIServie {
	path(path: string): string {
		return [import.meta.env.VITE_OPENAI_API_URL, path].join("/");
	}

	async chat(options: ChatOptions) {
		const requestPayload = {
			messages: options.messages,
			stream: options.config.stream,
			model: options.config.model,
			temperature: options.config.temperature,
			presence_penalty: options.config.presence_penalty,
			frequency_penalty: options.config.frequency_penalty,
			top_p: options.config.top_p,
		};

		const shouldStream = !!options.config.stream;
		const controller = new AbortController();
		options.onController?.(controller);

		try {
			const chatPath = this.path("v1/chat/completions");
			const chatPayload: FetchEventSourceInit = {
				method: "POST",
				body: JSON.stringify(requestPayload),
				signal: controller.signal,

				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${options.config.secret}`,
				},
				redirect: "follow",
			};

			const requestTimeoutId = setTimeout(() => controller.abort(), 60_0000);

			if (shouldStream) {
				let responseText = "";
				let finished = false;

				const finish = () => {
					if (!finished) {
						options.onFinish(responseText);
						finished = true;
					}
				};

				controller.signal.onabort = finish;

				fetchEventSource(chatPath, {
					...chatPayload,
					async onopen(res) {
						clearTimeout(requestTimeoutId);
						const contentType = res.headers.get("content-type");
						console.log("[OpenAI] request response content type: ", contentType);

						if (contentType?.startsWith("text/plain")) {
							responseText = await res.clone().text();
							return finish();
						}

						if (!res.ok || !res.headers.get("content-type")?.startsWith(EventStreamContentType) || res.status !== 200) {
							const responseTexts = [responseText];
							let extraInfo = await res.clone().text();
							try {
								const resJson = await res.clone().json();
								extraInfo = prettyObject(resJson);
							} catch {}

							if (res.status === 401) responseTexts.push("Unauthorized");

							if (extraInfo) responseTexts.push(extraInfo);

							responseText = responseTexts.join("\n\n");

							return finish();
						}
					},
					onmessage(msg) {
						if (msg.data === "[DONE]" || finished) return finish();

						const text = msg.data;
						try {
							const json = JSON.parse(text);
							if (json.choices.length === 0) return;
							const delta = json.choices[0].delta.content;
							if (delta) {
								responseText += delta;
								options.onUpdate?.(responseText);
							}
						} catch (e) {
							console.error("[Request] parse error", text, msg);
						}
					},
					onclose() {
						finish();
					},
					onerror(e) {
						options.onError?.(e);
						throw e;
					},
					openWhenHidden: true,
				});
			} else {
				const res = await fetch(chatPath, chatPayload);
				clearTimeout(requestTimeoutId);

				const json = await res.json();
				const message = json.choices?.at(0)?.message?.content ?? "";
				options.onFinish(message);
			}
		} catch (e) {
			console.log("[Request] failed to make a chat request", e);
			options.onError?.(e as Error);
		}
	}
}
