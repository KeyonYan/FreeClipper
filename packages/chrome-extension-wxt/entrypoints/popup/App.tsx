import { ClipperConfig, ClipperMode, ClipperTabs } from "free-clipper-core-react";
import "free-clipper-core-react/style.css";
import {
	getClipDatabaseInfo,
	getModeConfig,

	setClipDatabaseInfo,
	setModeConfig,
	notionKey,
} from "@/lib/store";

function App() {
	const tabs = [
		{
			value: "config",
			label: "Config",
			content: (
				<ClipperConfig
					getNotionKey={notionKey.getValue}
					getClipDatabaseInfo={getClipDatabaseInfo}
					setNotionKey={notionKey.setValue}
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

export default App;
