export interface Tab {
	value: string;
	label: string;
	content: React.ReactNode;
}

export interface ClipperTabsProps {
	tabs: Tab[];
}
