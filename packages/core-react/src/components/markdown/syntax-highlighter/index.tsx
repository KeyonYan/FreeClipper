import { cn } from "@/utils";
import { Loader2Icon } from "lucide-react";
import { memo } from "react";
import { useHighlight } from "./hook";

export interface SyntaxHighlighterProps {
	children: string;
	language: string;
	className?: string;
}

export const SyntaxHighlighter = memo<SyntaxHighlighterProps>(({ children, language, className }) => {
	const { data, isLoading } = useHighlight(children.trim(), language, "light");

	return (
		<>
			{isLoading || !data ? (
				<div className={cn("relative font-mono", className)}>
					<pre>
						<code>{children.trim()}</code>
					</pre>
					{isLoading && (
						<div className="absolute top-1 right-1 bg-white/30">
							<Loader2Icon className="animate-spin" height={14} width={14} />
						</div>
					)}
				</div>
			) : (
				<div
					className={className}
					// biome-ignore lint/security/noDangerouslySetInnerHtml:
					dangerouslySetInnerHTML={{ __html: data }}
				/>
			)}
		</>
	);
});
