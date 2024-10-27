import { type CSSProperties, memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CodeBlock } from "./code-block";
import classes from "./style.module.css";
import { escapeBrackets, escapeMhchem, fixMarkdownBold } from "./utils";

export interface MarkdownProps {
	allowHtml?: boolean;
	children: string;
	className?: string;
	components?: Components;
	enableLatex?: boolean;
	enableMermaid?: boolean;
	onDoubleClick?: () => void;
	style?: CSSProperties;
}

export const Markdown = memo<MarkdownProps>(
	({
		children,
		className,
		style,
		onDoubleClick,
		enableLatex = true,
		enableMermaid = true,
		allowHtml = true,
		components = {},
		...rest
	}) => {
		const escapedContent = useMemo(() => {
			if (!enableLatex) return fixMarkdownBold(children);
			return fixMarkdownBold(escapeMhchem(escapeBrackets(children)));
		}, [children, enableLatex]);

		const memoComponents = useMemo<Components>(
			() => ({
				pre: (props) => <CodeBlock enableMermaid={enableMermaid}>{props.children}</CodeBlock>,
				...components,
			}),
			[components, enableMermaid],
		);

		const memoRehypePlugins = useMemo(
			() => [allowHtml && rehypeRaw, enableLatex && rehypeKatex].filter(Boolean) as never,
			[allowHtml, enableLatex],
		);

		const memoRemarkPlugins = useMemo(
			() => [remarkBreaks, remarkGfm, enableLatex && remarkMath].filter(Boolean) as never,
			[enableLatex],
		);

		return (
			<article className={classes.markdown} data-code-type="markdown" onDoubleClick={onDoubleClick} style={style}>
				<ReactMarkdown
					className={className}
					components={memoComponents}
					rehypePlugins={memoRehypePlugins}
					remarkPlugins={memoRemarkPlugins}
					{...rest}
				>
					{escapedContent}
				</ReactMarkdown>
			</article>
		);
	},
);
