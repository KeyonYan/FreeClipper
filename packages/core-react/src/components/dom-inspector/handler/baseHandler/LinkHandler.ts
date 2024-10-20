export function linkHandler(e: HTMLLinkElement) {
	const link = e.getAttribute("href") ?? null;
	const content = e.textContent ?? link;
	return {
		paragraph: { rich_text: [{ type: "text", text: { content, link: { url: link } } }] },
	};
}
