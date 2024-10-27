import {
	transformerNotationDiff,
	transformerNotationErrorLevel,
	transformerNotationFocus,
	transformerNotationHighlight,
	transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { useQuery } from "@tanstack/react-query";
import { type Highlighter, createHighlighter } from "shiki";

import { cn } from "@/utils";
import mermaid from "mermaid";
import { type HTMLAttributes, useEffect } from "react";
import languageMap from "./language";

export const FALLBACK_LANG = "txt";
const currentLangs = [FALLBACK_LANG];

type HighlighterTheme = "dark" | "light";
export const highlighterTheme: Record<HighlighterTheme, string> = {
	dark: "github-dark-default",
	light: "github-light",
};

let cacheHighlighter: Highlighter;

const initHighlighter = async (lang: string): Promise<Highlighter> => {
	let highlighter = cacheHighlighter;
	const language = lang.toLowerCase();

	if (highlighter && currentLangs.includes(language)) return highlighter;

	if (languageMap.includes(language) && !currentLangs.includes(language)) {
		currentLangs.push(language);
	}

	highlighter = await createHighlighter({
		langs: currentLangs,
		themes: Object.values(highlighterTheme),
	});

	cacheHighlighter = highlighter;

	return highlighter;
};

export const useHighlight = (text: string, lang: string, theme: HighlighterTheme) =>
	useQuery({
		queryKey: [lang.toLowerCase(), theme, text],
		queryFn: async () => {
			try {
				const language = lang.toLowerCase();
				// await sleep(100000);
				const highlighter = await initHighlighter(language);
				const html = highlighter?.codeToHtml(text, {
					lang: languageMap.includes(language) ? language : FALLBACK_LANG,
					theme: highlighterTheme[theme],
					transformers: [
						transformerNotationDiff(),
						transformerNotationHighlight(),
						transformerNotationWordHighlight(),
						transformerNotationFocus(),
						transformerNotationErrorLevel(),
					],
				});
				return html;
			} catch (e) {
				return String(e);
			}
		},
		refetchOnWindowFocus: false,
	});

export const useMermaid = (content: string) => {
	// biome-ignore lint/correctness/useExhaustiveDependencies:
	useEffect(() => {
		console.log("reload");
		mermaid.initialize({
			securityLevel: "loose",
			startOnLoad: true,
			theme: "base",
			themeVariables: { fontSize: 14 },
		});
		mermaid.contentLoaded();
	}, [content]);

	return ({ className }: HTMLAttributes<HTMLPreElement>) => {
		return (
			<pre className={cn("mermaid flex justify-center overflow-auto items-center text-sm", className)}>{content}</pre>
		);
	};
};
