import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProgress,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, progress, ...props }) => {
				return (
					<Toast key={id} {...props} className="space-y-2">
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && <ToastDescription>{description}</ToastDescription>}
						</div>
						{action}
						<ToastClose />
						<ToastProgress duration={props.duration} progress={progress} />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}
