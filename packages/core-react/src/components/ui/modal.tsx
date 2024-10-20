import { cn } from "@/utils";
import type React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";
import { useModal } from "./use-modal";
import type { ModalState } from "./use-modal";

export interface ModalProps {
	type?: "dialog";
	body: React.ReactNode;
	title: string;
	description?: string;
	draggable?: boolean;
}

export function Modal() {
	const { modals } = useModal();

	return (
		<>
			{modals.map((modal) => (
				<DialogModal key={modal.id} {...modal} />
			))}
		</>
	);
}

function DialogModal({ open, onOpenChange, draggable, ...props }: ModalState) {
	return (
		<>
			<Dialog modal={true} open={open} onOpenChange={onOpenChange}>
				<DialogContent draggable={draggable}>
					<DialogHeader>
						<DialogTitle>{props.title}</DialogTitle>
						<DialogDescription className={cn(props.description ? "block" : "hidden")}>
							{props.description || props.title}
						</DialogDescription>
					</DialogHeader>
					{props.body}
				</DialogContent>
			</Dialog>
		</>
	);
}
