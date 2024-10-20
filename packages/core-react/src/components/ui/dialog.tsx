"use client";

import { cn } from "@/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { motion, useDragControls } from "framer-motion";
import * as React from "react";
import type { PointerEventHandler } from "react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Overlay>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={cn(
			"fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
			className,
		)}
		{...props}
	/>
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps {
	draggable?: boolean;
	handleDrag?: PointerEventHandler<HTMLDivElement>;
}

const DialogContent: React.FC<React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & DialogContentProps> = ({
	className,
	children,
	...props
}) => {
	const dragControls = useDragControls();

	return (
		<DialogPortal>
			<DialogOverlay className="grid items-center justify-items-center bg-black/20">
				<DialogPrimitive.Content
					className={cn(
						"relative z-50 grid w-full max-w-lg gap-4 bg-background p-6 shadow-lg sm:rounded-lg",
						className,
					)}
					asChild
					{...props}
				>
					<motion.div
						dragControls={dragControls}
						drag
						dragMomentum={false}
						dragListener={false}
						dragElastic={false}
						whileDrag={{
							cursor: "grabbing",
						}}
						draggable={false}
					>
						{props.draggable && (
							<div className="absolute inset-x-0 top-0 z-[1] h-4" onPointerDown={(e) => dragControls.start(e)} />
						)}
						{children}
						<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
							<Cross2Icon className="h-4 w-4" />
							<span className="sr-only">Close</span>
						</DialogPrimitive.Close>
					</motion.div>
				</DialogPrimitive.Content>
			</DialogOverlay>
		</DialogPortal>
	);
};
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
	<div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Title>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title
		ref={ref}
		className={cn("text-lg font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Description>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogPortal,
	DialogOverlay,
	DialogTrigger,
	DialogClose,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
};
