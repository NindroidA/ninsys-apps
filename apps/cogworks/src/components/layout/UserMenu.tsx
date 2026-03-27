import { useAuth } from "@/hooks/useAuth";
import { useClickOutside } from "@/hooks/useClickOutside";
import { getDefaultAvatarUrl, getUserAvatarUrl } from "@/lib/constants";
import { LogOut, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";

export function UserMenu() {
	const { user, logout } = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => setIsOpen(false), []);
	useClickOutside(containerRef, handleClose, isOpen);

	if (!user) return null;

	const avatarUrl = getUserAvatarUrl(user.id, user.avatar, 64) ?? getDefaultAvatarUrl(user.id);
	const displayName = user.globalName ?? user.username;

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors"
			>
				<img
					src={avatarUrl}
					alt={displayName}
					className="h-8 w-8 rounded-full"
					onError={(e) => {
						const fallback = getDefaultAvatarUrl(user.id);
						if ((e.target as HTMLImageElement).src !== fallback) {
							(e.target as HTMLImageElement).src = fallback;
						}
					}}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full right-0 mt-1 w-56 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
					{/* User info */}
					<div className="px-3 py-3 border-b border-border">
						<div className="font-medium text-sm truncate">{displayName}</div>
						<div className="text-xs text-muted-foreground truncate">@{user.username}</div>
					</div>

					{/* Menu items */}
					<div className="py-1">
						<Link
							to="/"
							onClick={handleClose}
							className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
						>
							<User className="h-4 w-4" />
							Back to Home
						</Link>
						<button
							type="button"
							onClick={() => {
								handleClose();
								logout();
							}}
							className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full text-left"
						>
							<LogOut className="h-4 w-4" />
							Logout
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
