import { Actionbar } from "@/components/clipper-action";
import { Modal } from "@/components/ui/modal";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider as JotaiProvider, createStore } from "jotai";

export const store = createStore();

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
		mutations: {
			retry: false,
		},
	},
});

export function Provider({ children }: { children: React.ReactNode }) {
	return (
		<JotaiProvider store={store}>
			<QueryClientProvider client={queryClient}>
				{children}
				<Actionbar />
				<Toaster />
				<Modal />
				<ReactQueryDevtools />
			</QueryClientProvider>
		</JotaiProvider>
	);
}
