import { ClipperConfig, ClipperMode, ClipperTabs } from "@/components";
import {
	getClipDatabaseInfo,
	getModeConfig,
	getNotionKey,
	setClipDatabaseInfo,
	setModeConfig,
	setNotionKey,
} from "@/mocks";
import { queryClient } from "@/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ClipperPopover() {
	const tabs = [
		{
			value: "config",
			label: "Config",
			content: (
				<ClipperConfig
					getNotionKey={getNotionKey}
					getClipDatabaseInfo={getClipDatabaseInfo}
					setNotionKey={setNotionKey}
					setClipDatabaseInfo={setClipDatabaseInfo}
				/>
			),
		},
		{
			value: "mode",
			label: "Mode",
			content: <ClipperMode getModeConfig={getModeConfig} setModeConfig={setModeConfig} />,
		},
	];
	return (
		<QueryClientProvider client={queryClient}>
			<ClipperTabs tabs={tabs} />
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}
