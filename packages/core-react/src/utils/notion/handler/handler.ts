import { BlockObjectRequest } from "@notionhq/client/build/src/api-endpoints";
import { brHandler } from "./baseHandler/BrHandler";
import { bulletedListHandler } from "./baseHandler/BulletedListHandler";
import { codeHandler } from "./baseHandler/CodeHandler";
import { equationHandler } from "./baseHandler/EquationHandler";
import { headingHandler } from "./baseHandler/HeadingHandler";
import { imageHandler } from "./baseHandler/ImageHandler";
import { linkHandler } from "./baseHandler/LinkHandler";
import { numberedListHandler } from "./baseHandler/NumberedListHandler";
import { paragraphHandler } from "./baseHandler/ParagraphHandler";
import { quoteHandler } from "./baseHandler/QuoteHandler";

export function commonHandler(e: HTMLElement) {
	if (e instanceof HTMLParagraphElement) {
		if (e.childElementCount === 1 && e.firstElementChild?.tagName === "A")
			return linkHandler(e.firstElementChild as HTMLLinkElement);
		return paragraphHandler(e);
	}
	if (e instanceof HTMLImageElement) {
		return imageHandler(e);
	}
	if (e instanceof HTMLHeadingElement) {
		return headingHandler(e);
	}
	if (e.tagName === "BLOCKQUOTE") {
		return quoteHandler(e);
	}
	if (e.tagName === "BR") {
		return brHandler();
	}
	if (e instanceof HTMLLinkElement) {
		return linkHandler(e);
	}
	if (e.tagName === "CODE") {
		return codeHandler(e);
	}
	if (e.tagName === "SPAN" && e.getAttribute("data-tex")) {
		return equationHandler(e);
	}
	if (e.tagName === "LI") {
		if (e.parentElement?.tagName === "UL") return bulletedListHandler(e);
		if (e.parentElement?.tagName === "OL") return numberedListHandler(e);
	}
}
