import ReactDOM from "react-dom/client";
import { Container } from "./container.tsx";

export default defineContentScript({
	matches: ["<all_urls>"],
	// 2. Set cssInjectionMode
	cssInjectionMode: "ui",

	async main(ctx: any) {
		// 3. Define your UI
		const ui = await createShadowRootUi(ctx, {
			name: "freeclipper-ui",
			position: "inline",
			anchor: "body",
			onMount: (container: any) => {
				// Create a root on the UI container and render a component
				const root = ReactDOM.createRoot(container);
				root.render(<Container />);
				return root;
			},
			onRemove: (root: any) => {
				// Unmount the root when the UI is removed
				root.unmount();
			},
		});

		// 4. Mount the UI
		ui.mount();
	},
});
