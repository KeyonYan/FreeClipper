import { cn } from "@/utils";
import { Cross2Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { motion, useDragControls } from "framer-motion";
import type { HTMLAttributes } from "react";

export type DraggableCardProps = HTMLAttributes<HTMLDivElement> & {
	title?: string;
	onClose?: () => void;
};

export function DraggableCard({ children, className, onClose, style, title }: DraggableCardProps) {
	const dragControls = useDragControls();
	return (
		<motion.div
			dragControls={dragControls}
			drag
			dragMomentum={false}
			dragListener={false}
			dragElastic={false}
			onClick={(e) => e.stopPropagation()}
			whileDrag={{
				cursor: "grabbing",
			}}
			draggable={false}
			className={cn(
				"rounded-2xl fixed top-0 left-0 border shadow-lg flex flex-col p-4 justify-center bg-white/40 backdrop-blur w-[420px]",
				className,
			)}
			style={style}
		>
			<div
				className="absolute inset-x-0 top-0 z-[1] py-1 cursor-grab flex items-center justify-center"
				onPointerDown={(e) => dragControls.start(e)}
			>
				<DotsHorizontalIcon />
			</div>
			<div className="flex items-center justify-between pb-2">
				<h1 className="font-bold text-lg">{title}</h1>
				<button type="button" onClick={onClose}>
					<Cross2Icon className="h-4 w-4" />
				</button>
			</div>

			{children}
		</motion.div>
	);
}

export function withDraggableCard<T extends DraggableCardProps>(Component: React.ComponentType<T>) {
	return function DraggableCardWrapper(props: T) {
		return (
			<DraggableCard {...props}>
				<Component {...props} />
			</DraggableCard>
		);
	};
}
