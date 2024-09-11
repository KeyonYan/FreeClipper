const whiteList = ["#text", "P", "A", "IMG", "BR", "B", "STRONG"];

function textHandler(e: HTMLElement) {
	if (!whiteList.includes(e.nodeName)) return;
	if (e.textContent === "") return;
	let content = "";
	if (e.nodeName === "#text") content = e.textContent ?? "";
	else if (e.nodeName === "BR") content = "\n";

	return {
		text: {
			content,
		},
	};
}

function textLinkHandler(e: HTMLElement) {
	const textLink: any = {
		text: {
			content: e.textContent,
		},
	};
	const url = e.getAttribute("href");
	if (url) textLink.text.link = { url };

	return textLink;
}

// 设置文本样式
function annotationsHandler(annotations: any, e: HTMLElement) {
	let newAnnotations = null;
	if (annotations) {
		newAnnotations = Object.assign({}, annotations);
	} else {
		newAnnotations = {
			bold: false,
			italic: false,
			strikethrough: false,
			underline: false,
			code: false,
			color: "default",
		};
	}
	if (e.tagName === "B" || e.tagName === "STRONG") newAnnotations.bold = true;
	else if (e.tagName === "I") newAnnotations.italic = true;
	else if (e.tagName === "CODE") newAnnotations.code = true;

	return newAnnotations;
}

export function richTextHandler(e: HTMLElement, codeMode?: boolean, annotations?: any): any[] | undefined {
	const nodes = e.childNodes;
	if (!nodes || nodes.length <= 0) {
		const text: any = textHandler(e);
		if (text) {
			if (annotations) text.annotations = annotations;

			return [text];
		}
		return;
	} else if (e.tagName === "A") {
		const text: any = textLinkHandler(e);
		if (text) {
			if (annotations) text.annotations = annotations;

			return [text];
		}
		return;
	}

	let texts: any[] = [];
	for (let i = 0; i < nodes.length; i++) {
		const child = nodes[i];
		if (!codeMode) codeMode = e.tagName === "CODE" && e.parentElement?.tagName === "PRE";

		let text = null;
		if (codeMode) {
			text = richTextHandler(child as HTMLElement, codeMode);
		} else {
			const newAnnotations = annotationsHandler(annotations, e);
			text = richTextHandler(child as HTMLElement, codeMode, newAnnotations);
		}
		if (!text) continue;
		texts = [...texts, ...text];
	}
	return texts;
}
