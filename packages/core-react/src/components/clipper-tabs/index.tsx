import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import type { ClipperTabsProps } from "./types";

export function ClipperTabs(props: ClipperTabsProps) {
	const { tabs } = props;
	return (
		<Tabs defaultValue="config" className="w-auto">
			<TabsList>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value}>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent className="mt-4" key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
}
