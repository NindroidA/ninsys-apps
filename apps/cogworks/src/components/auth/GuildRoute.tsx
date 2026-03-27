import { useCurrentGuild } from "@/hooks/useCurrentGuild";
import { getBotInviteUrl, getGuildIconUrl } from "@/lib/constants";
import { Button } from "@ninsys/ui/components";
import type { ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

interface GuildRouteProps {
	children: ReactNode;
}

export function GuildRoute({ children }: GuildRouteProps) {
	const { guildId } = useParams<{ guildId: string }>();
	const { guild, isLoading, isFound } = useCurrentGuild();
	const navigate = useNavigate();

	if (!guildId) {
		return <Navigate to="/dashboard" replace />;
	}

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					<p className="text-sm text-muted-foreground">Loading server...</p>
				</div>
			</div>
		);
	}

	if (!isFound) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background p-4">
				<div className="max-w-md w-full text-center">
					<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
						<span className="text-3xl">🚫</span>
					</div>
					<h1 className="text-2xl font-bold mb-2">No Access</h1>
					<p className="text-muted-foreground mb-6">
						You don't have admin access to this server, or the server wasn't found.
					</p>
					<Button
						onClick={() => {
							navigate("/dashboard");
						}}
					>
						Back to Servers
					</Button>
				</div>
			</div>
		);
	}

	if (guild && !guild.hasBot) {
		const iconUrl = getGuildIconUrl(guild.id, guild.icon);
		return (
			<div className="min-h-screen flex items-center justify-center bg-background p-4">
				<div className="max-w-md w-full text-center">
					{iconUrl && (
						<img src={iconUrl} alt={guild.name} className="h-16 w-16 rounded-full mx-auto mb-4" />
					)}
					<h1 className="text-2xl font-bold mb-2">Bot Not in Server</h1>
					<p className="text-muted-foreground mb-6">
						Cogworks hasn't been added to <strong>{guild.name}</strong> yet. Invite the bot to start
						managing your server.
					</p>
					<div className="flex gap-3 justify-center">
						<Button
							variant="outline"
							onClick={() => {
								navigate("/dashboard");
							}}
						>
							Back to Servers
						</Button>
						<Button
							onClick={() =>
								window.open(getBotInviteUrl(guild.id), "_blank", "noopener,noreferrer")
							}
						>
							Invite Bot
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return <>{children}</>;
}
