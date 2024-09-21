import { useEffect, useState } from "react";
import type { ModalProps } from "./modal";

interface State {
	modal: ModalProps;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const memoryState: State = {
	modal: {},
	open: false,
	onOpenChange: (v) => {
		if (!v) close();
	},
};

const listeners: Array<(state: State) => void> = [];

export function close() {
	for (const listener of listeners) {
		listener({
			...memoryState,
			open: false,
		});
	}
}

export function confirm(modal: State["modal"]) {
	for (const listener of listeners) {
		listener({
			...memoryState,
			modal,
			open: true,
		});
	}
}

export function useModal() {
	const [modalState, setModalState] = useState<State>(memoryState);

	useEffect(() => {
		listeners.push(setModalState);
		return () => {
			const index = listeners.indexOf(setModalState);
			if (index > -1) listeners.splice(index, 1);
		};
	}, []);

	return {
		...modalState,
		confirm,
		close,
	};
}
