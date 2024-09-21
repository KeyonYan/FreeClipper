import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";
import { useModal } from "./use-modal";

export interface ModalProps {
	body?: React.ReactNode;
	title?: string;
	description?: string;
}

export function Modal() {
	const { open, onOpenChange, modal } = useModal();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				{modal.title ? (
					<DialogHeader>
						<DialogTitle>{modal.title}</DialogTitle>
						{modal.description && <DialogDescription>{modal.description}</DialogDescription>}
					</DialogHeader>
				) : null}
				{modal.body}
				<DialogFooter>
					<Button type="button" onClick={() => onOpenChange(false)}>
						Okey
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
