"use client";
import { Button } from "@/components/ui/button";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { searchNotionDatabase } from "@/utils/notion/notion-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Toaster } from "../ui/toaster";
import { DbSelect } from "./db-select/db-select";

const FormSchema = z.object({
	notionKey: z.string({ required_error: "Please enter a Notion key." }),
	database: z.object({
		id: z.string().default(""),
		name: z.string().default(""),
	}),
});

export type DatabaseInfo = z.infer<typeof FormSchema.shape.database>;

export interface ClipperConfigProps {
	/** notion key */
	getNotionKey: () => Promise<string | null>;
	setNotionKey: (key: string) => Promise<void>;

	/** notion database info */
	getClipDatabaseInfo: () => Promise<DatabaseInfo | null>;
	setClipDatabaseInfo: (info: DatabaseInfo) => Promise<void>;
}

export function ClipperConfig(props: ClipperConfigProps) {
	const { getNotionKey, getClipDatabaseInfo, setNotionKey, setClipDatabaseInfo } = props;

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { notionKey: "" },
	});

	form.watch();

	const {
		data: databases,
		error: getDatabasesError,
		isLoading: isDatabasesLoading,
		refetch: updateDatabaseOptions,
	} = useQuery({
		queryKey: ["notion-database", form.getValues().notionKey],
		queryFn: ({ queryKey }) => {
			const [, key] = queryKey;
			return searchNotionDatabase(key);
		},
		select: (databases) => {
			return databases.map((db) => ({
				id: db.id,
				name: db.title.map((text) => text.plain_text).join(", "),
			}));
		},
		initialData: [],
	});

	useEffect(() => {
		if (getDatabasesError) {
			toast({
				title: "❌ Reload Database Failed",
				description: getDatabasesError?.message ?? "Unknown Error",
				duration: 3000,
			});
		}
	}, [getDatabasesError]);

	const { isPending: isSaving, mutateAsync: _saveConfig } = useMutation({
		mutationFn: async (data: z.infer<typeof FormSchema>) => {
			if (data.notionKey) {
				await setNotionKey(data.notionKey);
			}
			if (data.database) {
				await setClipDatabaseInfo(data.database);
			}
		},
	});

	const saveConfig = async (data: z.infer<typeof FormSchema>) => {
		await _saveConfig(data, {
			onSuccess: () => {
				toast({
					title: "✅ Save Config Success",
					description: "Your config has been saved.",
					duration: 3000,
				});
			},
		});
	};

	const getConfig = async () => {
		const key = await getNotionKey();
		if (key) {
			form.setValue("notionKey", key);
		}

		const info = await getClipDatabaseInfo();
		if (info) {
			form.setValue("database", info);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: this effect should only run once
	useEffect(() => {
		getConfig();
	}, []);

	const onSelectClick = (selectedId: string) => {
		const database = databases.find((db) => db.id === selectedId);
		if (database) form.setValue("database", database);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(saveConfig)} className="space-y-6">
				<FormField
					control={form.control}
					name="notionKey"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>NotionKey</FormLabel>
							<Input placeholder="notion key" {...field} />
							<FormDescription>
								This is the Key of Notion Intergration, get from&nbsp;
								<a className="underline" target="_blank" href="https://www.notion.so/my-integrations" rel="noreferrer">
									here
								</a>
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="database"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<div className="flex flex-row gap-2 items-center">
								<FormLabel>Database</FormLabel>
								<div className="cursor-pointer hover:bg-[#F4F4F5] flex justify-center items-center p-2 rounded-md">
									<UpdateIcon
										onClick={() => updateDatabaseOptions()}
										className={`h-4 w-4 spin ${isDatabasesLoading ? "animate-spin" : ""}`}
									/>
								</div>
							</div>
							<DbSelect
								{...field}
								selectedId={field.value ? field.value.id : ""}
								options={databases}
								onSelect={onSelectClick}
							/>
							<FormDescription>This is the database you want to clip to</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">
					{isSaving ? (
						<div className="flex flex-row items-center">
							<Loader2Icon className="animate-spin" />
							<span>Save...</span>
						</div>
					) : (
						<span>Save</span>
					)}
				</Button>
			</form>
			<Toaster />
		</Form>
	);
}
