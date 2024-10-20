export function equationHandler(e: HTMLElement) {
	return {
		equation: { expression: e.getAttribute("data-tex") },
	};
}
