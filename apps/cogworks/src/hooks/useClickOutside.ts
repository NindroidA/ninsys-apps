import type { RefObject } from "react";
import { useEffect } from "react";

export function useClickOutside(
	ref: RefObject<HTMLElement | null>,
	onClose: () => void,
	enabled: boolean,
) {
	useEffect(() => {
		if (!enabled) return;
		function onMouseDown(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) onClose();
		}
		function onKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		document.addEventListener("mousedown", onMouseDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [ref, onClose, enabled]);
}
