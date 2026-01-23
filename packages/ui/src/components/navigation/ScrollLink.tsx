import type { ComponentProps, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

export interface ScrollLinkProps extends ComponentProps<typeof Link> {
	/** Whether to scroll to top on navigation (default: true) */
	scrollToTop?: boolean;
	/** Scroll behavior: smooth or instant (default: instant for faster UX) */
	scrollBehavior?: ScrollBehavior;
}

/**
 * A wrapper around react-router's Link that scrolls to the top of the page on navigation.
 * Use this for any internal navigation links where you want the page to start at the top.
 */
export function ScrollLink({
	scrollToTop = true,
	scrollBehavior = "instant",
	onClick,
	children,
	...props
}: ScrollLinkProps) {
	const navigate = useNavigate();

	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		// Call any existing onClick handler
		onClick?.(e);

		// If the default wasn't prevented and we should scroll to top
		if (!e.defaultPrevented && scrollToTop) {
			e.preventDefault();
			// Navigate first, then scroll
			navigate(props.to as string);
			window.scrollTo({ top: 0, behavior: scrollBehavior });
		}
	};

	return (
		<Link {...props} onClick={handleClick}>
			{children}
		</Link>
	);
}

/**
 * Utility function to scroll to the top of the page.
 * Can be used with regular onClick handlers when you can't use ScrollLink.
 */
export function scrollToTop(behavior: ScrollBehavior = "instant") {
	window.scrollTo({ top: 0, behavior });
}
