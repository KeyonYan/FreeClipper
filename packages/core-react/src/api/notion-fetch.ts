import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { SearchParameters } from "@notionhq/client/build/src/api-endpoints";

const LIMIT_BLOCK_COUNT = 50;

export function getClient(key: string) {
	const notion = new Client({
		auth: key,
		fetch: (url: string, init) => {
			if (import.meta.env.DEV) {
				return fetch(url.replace("https://api.notion.com/v1", "/notion-api"), init);
			}

			if (import.meta.env.VITE_NOTION_PROXY) {
				url = import.meta.env.VITE_NOTION_PROXY + url;
			}
			
			return fetch(url, init);
		},
	});
	return notion;
}

export async function uploadToNotion(blocks: any[], key: string, databaseId: string, title: string) {
	try {
		const resp = await addNotionPageToDatabase(
			key,
			databaseId,
			{ title: { title: [{ text: { content: title } }] } },
			blocks.slice(0, LIMIT_BLOCK_COUNT),
		);
		if (blocks.length > LIMIT_BLOCK_COUNT) {
			for (let i = LIMIT_BLOCK_COUNT; i < blocks.length; i += LIMIT_BLOCK_COUNT)
				await appendToNotionPage(key, resp.id, blocks.slice(i, i + LIMIT_BLOCK_COUNT));
		}
		return { success: true, url: resp.url };
	} catch (e: any) {
		console.log("notion-fetch:error", e);
		return { success: false, message: e.code };
	}
}

export async function addNotionPageToDatabase(key: string, databaseId: string, pageProperties: any, blocks?: any[]) {
	const newPage = await getClient(key).pages.create({
		parent: {
			database_id: databaseId,
		},
		properties: pageProperties,
		children: blocks,
	});
	return newPage as PageObjectResponse;
}

export async function appendToNotionPage(key: string, pageId: string, blocks: any[]) {
	await getClient(key).blocks.children.append({
		block_id: pageId,
		children: blocks,
	});
}

export async function searchNotionDatabase(key: string, title?: string) {
	const searchParam: SearchParameters = {
		filter: {
			value: "database",
			property: "object",
		},
		sort: {
			direction: "ascending",
			timestamp: "last_edited_time",
		},
	};

	if (title) searchParam.query = title;
	const resp = await getClient(key).search(searchParam);
	return resp;
}
