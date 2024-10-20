import "./index.css";

import { useEventListener, useKeyPress, useUpdateEffect } from "ahooks";
import { useState } from "react";

import { Modal } from "../ui/modal";
import { Toaster } from "../ui/toaster";
import { confirm } from "../ui/use-modal";
import { toast } from "../ui/use-toast";

import type { DomInspectorProps, PositionCssMap } from "./types";

function getDomPropertyValue(target: HTMLElement, property: string) {
	const computedStyle = window.getComputedStyle(target);
	return computedStyle.getPropertyValue(property);
}

function getBatchDomPropertyValue(target: HTMLElement, properties: string[]) {
	const result: string[] = [];
	for (const property of properties) {
		result.push(getDomPropertyValue(target, property));
	}
	return result;
}

export function DomInspector(props: DomInspectorProps) {
	const { toggleHotKey, levelUpHotKey, levelDownHotKey, handleClip } = props;
	const [positionCssMap, setPositionCssMap] = useState<PositionCssMap>({
		container: {},
		margin: {},
		border: {},
		padding: {},
	});

	const [enableInspect, setEnableInspect] = useState<boolean>(false);
	const [infoClassName, setInfoClassName] = useState<string>("");
	const [showInspectContainer, setShowInspectContainer] = useState<boolean>(false);
	const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
	const [hoveredHistoryElements, setHoveredHistoryElements] = useState<HTMLElement[]>([]);
	const [preUserSelect, setPreUserSelect] = useState<string>("");

	const renderCover = () => {
		if (!hoveredElement) {
			setShowInspectContainer(false);
			document.body.style.userSelect = preUserSelect;
			setPreUserSelect("");
			return;
		}

		setShowInspectContainer(true);

		if (!preUserSelect) {
			setPreUserSelect(getComputedStyle(document.body).userSelect);
		}

		const target = hoveredElement;
		const { top, right, bottom, left } = target.getBoundingClientRect();

		const [bt, br, bb, bl] = getBatchDomPropertyValue(target, [
			"border-top-width",
			"border-right-width",
			"border-bottom-width",
			"border-left-width",
		]);
		const [pt, pr, pb, pl] = getBatchDomPropertyValue(target, [
			"padding-top",
			"padding-right",
			"padding-bottom",
			"padding-left",
		]);
		const [mt, mr, mb, ml] = getBatchDomPropertyValue(target, [
			"margin-top",
			"margin-right",
			"margin-bottom",
			"margin-left",
		]);

		setPositionCssMap({
			container: {
				"--top": `${top}px`,
				"--left": `${left}px`,
				"--bottom": `${bottom}px`,
				"--right": `${right}px`,
				"--mt": mt,
				"--mr": mr,
				"--mb": mb,
				"--ml": ml,
				"--bt": bt,
				"--br": br,
				"--bb": bb,
				"--bl": bl,
				"--pt": pt,
				"--pr": pr,
				"--pb": pb,
				"--pl": pl,
				top: "calc(var(--top) - var(--mt))",
				left: "calc(var(--left) - var(--ml))",
				height: "calc(var(--bottom) - var(--top) + var(--mb) + var(--mt))",
				width: "calc(var(--right) - var(--left) + var(--mr) + var(--ml))",
			},
			margin: {
				borderWidth: "var(--mt) var(--mr) var(--mb) var(--ml)",
			},
			border: {
				borderWidth: "var(--bt) var(--br) var(--bb) var(--bl)",
			},
			padding: {
				borderWidth: "var(--pt) var(--pr) var(--pb) var(--pl)",
			},
		});

		const browserHeight = document.documentElement.clientHeight; // 浏览器高度
		// 自动调整信息弹出位置
		const bottomToViewPort = browserHeight - bottom - Number(mb.replace("px", ""));

		const topToViewPort = top - Number(mt.replace("px", ""));

		setInfoClassName(
			topToViewPort > bottomToViewPort
				? topToViewPort < 100
					? "element-info-top-inner"
					: "element-info-top"
				: bottomToViewPort < 100
					? "element-info-bottom-inner"
					: "element-info-bottom",
		);
	};

	useUpdateEffect(() => {
		renderCover();
	}, [hoveredElement]);

	const removeHoveredElement = () => {
		setHoveredElement(null);
		setHoveredHistoryElements([]);
	};

	useKeyPress(
		toggleHotKey,
		() => {
			if (!enableInspect) setEnableInspect(true);
		},
		{ events: ["keydown"] },
	);

	useKeyPress(
		toggleHotKey,
		() => {
			if (enableInspect) {
				setEnableInspect(false);
				removeHoveredElement();
			}
		},
		{ events: ["keyup"] },
	);

	useKeyPress(levelUpHotKey, () => {
		if (!enableInspect || !hoveredElement) return;
		const parentNode = hoveredElement.parentElement;
		if (parentNode) {
			setHoveredHistoryElements([...hoveredHistoryElements, hoveredElement]);
			setHoveredElement(parentNode);
		}
	});

	useKeyPress(levelDownHotKey, () => {
		if (!enableInspect || !hoveredElement) return;
		const historyNode = hoveredHistoryElements.pop();
		if (historyNode) {
			setHoveredElement(historyNode);
			setHoveredHistoryElements(hoveredHistoryElements);
		} else {
			const newHoveredElement = (hoveredElement.children[0] as HTMLElement) ?? hoveredElement;
			setHoveredElement(newHoveredElement);
		}
	});

	useEventListener(
		"mousemove",
		(e) => {
			if (!enableInspect) {
				removeHoveredElement();
				return;
			}
			const targetNode = e.target as HTMLElement;
			if (targetNode !== hoveredElement) {
				setHoveredElement(targetNode);
				setHoveredHistoryElements([]);
			}
		},
		{ target: document.body },
	);

	useEventListener(
		"mouseleave",
		() => {
			if (!enableInspect) removeHoveredElement();
		},
		{ target: document.body },
	);

	useEventListener(
		"click",
		async (e) => {
			if (!enableInspect || !showInspectContainer || !hoveredElement) return;

			e.stopPropagation();
			e.preventDefault();

			await handleClip(hoveredElement, toast, confirm);

			removeHoveredElement();
			setEnableInspect(false);
		},
		{ target: document.body },
	);

	return (
		<div>
			<div
				className={`pointer-events-none transition-all fixed z-[99999] border border-blue-500 rounded-sm ${hoveredElement ? "block" : "hidden"}`}
				style={positionCssMap.container}
			>
				<div className="border-[rgba(255,155,0,0.3)] absolute inset-0" style={positionCssMap.margin}>
					<div className="border-[rgba(255,200,50,0.3)] absolute inset-0" style={positionCssMap.border}>
						<div className="border-[rgba(77,200,0,0.3)] absolute inset-0" style={positionCssMap.padding}>
							<div className="bg-[rgba(120,170,210,0.7)] absolute inset-0" />
						</div>
					</div>
				</div>
				<div className={`absolute left-1/2 -translate-x-1/2 ${infoClassName}`}>
					<span className="max-w-full text-sm bg-sky-600 text-red break-all shadow py-1 px-2 rounded text-nowrap">
						Click to Clip {hoveredElement?.className}
					</span>
				</div>
			</div>
			<Toaster />
			<Modal />
		</div>
	);
}
