import type { Meta, StoryObj } from "@storybook/react";
import { Provider } from "../clipper-provider";
import { markdownMockText } from "./example";
import { Markdown } from "./index";

const meta: Meta<typeof Markdown> = {
	title: "Markdown",
	component: Markdown,
	tags: ["autodocs"],
};

export default meta;

export const Default: StoryObj<typeof Markdown> = {
	args: {
		children: markdownMockText,
	},
	decorators: [
		(Story) => (
			<>
				<Provider>
					<Story />
				</Provider>
			</>
		),
	],
};
