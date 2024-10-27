import { Button } from "@/components/ui/button";
import { cn } from "@/utils";
import { ChevronDown, Copy, CopyCheck } from "lucide-react";
import { type FC, type HTMLAttributes, memo, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

import { SyntaxHighlighter, type SyntaxHighlighterProps } from "../syntax-highlighter";
import { FALLBACK_LANG, useMermaid } from "../syntax-highlighter/hook";

const countLines = (str: string): number => {
	const regex = /\n/g;
	const matches = str.match(regex);
	return matches ? matches.length : 1;
};

interface RawCode {
	props: { className?: string; children: string | string[] };
}

export const useCode = (raw?: RawCode) => {
	if (!raw) return;

	const { children, className } = raw.props;

	if (!children) return;

	const content = Array.isArray(children) ? children[0] : children;

	const lang = className?.replace("language-", "") || FALLBACK_LANG;

	const isSingleLine = countLines(content) <= 1 && content.length <= 32;

	return {
		content,
		isSingleLine,
		lang,
	};
};

interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
	enableMermaid?: boolean;
}

export const CodeBlock: FC<CodeBlockProps> = ({ children, enableMermaid }) => {
	const code = useCode(children as RawCode);

	if (!code) return;

	const [explanded, setExpanded] = useState(true);
	const [copiedValue, copy] = useCopyToClipboard();

	return (
		<div
			className={cn(
				"relative border border-b-0 rounded-lg m-2 grid grid-rows-[min-content_0fr] overflow-hidden transition-all",
				explanded && "grid-rows-[min-content_1fr] border-b",
			)}
		>
			<div className="flex items-center p-1 text-gray-500 bg-neutral-100 border-b">
				<Button
					onClick={() => setExpanded(!explanded)}
					variant="ghost"
					size="icon"
					className="w-6 h-6 p-1 hover:bg-neutral-200"
				>
					<ChevronDown className={cn("transition-transform", explanded ? "rotate-180" : "rotate-0")} />
				</Button>
				<span className="font-mono flex-1 text-center text-xs">{code.lang}</span>
				<Button
					onClick={() => copy(code.content)}
					variant="ghost"
					size="icon"
					className="w-6 h-6 p-1 hover:bg-neutral-200"
				>
					{copiedValue ? <CopyCheck /> : <Copy />}
				</Button>
			</div>
			<CodeContent language={code.lang} enableMermaid={enableMermaid}>
				{code.content}
			</CodeContent>
		</div>
	);
};

interface CodeContentProps extends SyntaxHighlighterProps {
	enableMermaid?: boolean;
}

const CodeContent = memo(({ language, children, enableMermaid, ...rest }: CodeContentProps) => {
	if (enableMermaid && language === "mermaid") {
		return <MermaidContent>{children}</MermaidContent>;
	}

	return (
		<SyntaxHighlighter language={language} {...rest} className="px-2 min-h-0">
			{children}
		</SyntaxHighlighter>
	);
});

const MermaidContent = ({ children }: { children: string }) => {
	const MermaidRender = useMermaid(children);
	return <MermaidRender className="min-h-0 px-2" />;
};
