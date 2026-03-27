import { useClickOutside } from "@/hooks/useClickOutside";
import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { useGuilds } from "@/hooks/useGuilds";
import { getBotInviteUrl, getGuildIconUrl } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { cn } from "@ninsys/ui/lib";
import { ChevronDown } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export function GuildSelector() {
	const { guild: currentGuild } = useCurrentGuild();
	const { guilds } = useGuilds();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => setIsOpen(false), []);
	useClickOutside(containerRef, handleClose, isOpen);

	const currentIcon = currentGuild ? getGuildIconUrl(currentGuild.id, currentGuild.icon, 32) : null;

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-muted transition-colors"
			>
				{currentIcon ? (
					<img src={currentIcon} alt="" className="h-6 w-6 rounded-full" />
				) : currentGuild ? (
					<div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
						{getInitials(currentGuild.name)}
					</div>
				) : null}
				<span className="max-w-[140px] truncate hidden sm:inline">
					{currentGuild?.name ?? "Select Server"}
				</span>
				<ChevronDown
					className={cn(
						"h-4 w-4 text-muted-foreground transition-transform",
						isOpen && "rotate-180",
					)}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full right-0 mt-1 w-64 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
					<div className="max-h-64 overflow-y-auto py-1">
						{guilds.map((guild) => {
							const icon = getGuildIconUrl(guild.id, guild.icon, 32);
							const isCurrent = guild.id === currentGuild?.id;
							return (
								<button
									key={guild.id}
									type="button"
									onClick={() => {
										if (guild.hasBot) {
											navigate(`/dashboard/${guild.id}`);
										} else {
											window.open(getBotInviteUrl(guild.id), "_blank", "noopener,noreferrer");
										}
										handleClose();
									}}
									className={cn(
										"flex items-center gap-3 w-full px-3 py-2 text-sm text-left hover:bg-muted transition-colors",
										isCurrent && "bg-primary/5",
									)}
								>
									{icon ? (
										<img src={icon} alt="" className="h-8 w-8 rounded-full flex-shrink-0" />
									) : (
										<div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
											{getInitials(guild.name)}
										</div>
									)}
									<div className="flex-1 min-w-0">
										<div className="truncate font-medium">{guild.name}</div>
										{!guild.hasBot && (
											<div className="text-xs text-muted-foreground">Invite Bot</div>
										)}
									</div>
									{isCurrent && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
								</button>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
