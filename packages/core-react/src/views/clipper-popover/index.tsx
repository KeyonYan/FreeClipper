import { ClipperConfig, ClipperMode, ClipperTabs } from "@/components";
import {
	getClipDatabaseInfo,
	getModeConfig,
	getNotionKey,
	setClipDatabaseInfo,
	setModeConfig,
	setNotionKey,
} from "@/mocks";

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
	return <ClipperTabs tabs={tabs} />;
}
