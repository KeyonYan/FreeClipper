import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import type { DatabaseInfo } from "../index";
import { SelectedOption } from "./SelectedOption";

interface DbSelectProps {
	selectedId: string;
	options: DatabaseInfo[];
	onSelect: (id: string) => void;
}

export const DbSelect = React.forwardRef((props: DbSelectProps, ref: React.Ref<HTMLDivElement>) => {
	const { selectedId, options, onSelect } = props;
	const [open, setOpen] = useState(false);
	const handleSelectClick = (id: string) => {
		onSelect(id);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<FormControl ref={ref}>
					<Button
						variant="outline"
						role="combobox"
						className={cn("w-full justify-between", !selectedId && "text-muted-foreground")}
					>
						<SelectedOption selectedId={selectedId} options={options} />
						<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</FormControl>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-auto h-[160px] p-0">
				<Command>
					<CommandInput placeholder="Search database..." />
					<CommandEmpty>No database found.</CommandEmpty>
					<ScrollArea>
						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									className="flex flex-row justify-between"
									value={option.name}
									key={option.id}
									onSelect={() => handleSelectClick(option.id)}
								>
									<div className="flex flex-row gap-2 items-start">
										<div>{option.name}</div>
									</div>
									<Check className={cn("mr-2 h-4 w-4", option.id === selectedId ? "opacity-100" : "opacity-0")} />
								</CommandItem>
							))}
						</CommandGroup>
					</ScrollArea>
				</Command>
			</PopoverContent>
		</Popover>
	);
});
