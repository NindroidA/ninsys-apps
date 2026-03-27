import { useAuth } from "@/hooks/useAuth";
import { useGuilds } from "@/hooks/useGuilds";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getBotInviteUrl, getGuildIconUrl } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { Button, Card } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { Bot, LogOut, Server } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export function GuildSelectorPage() {
	const { guilds, isLoading } = useGuilds();
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	usePageTitle("Select a Server");

	const withBot = useMemo(() => guilds.filter((g) => g.hasBot), [guilds]);
	const withoutBot = useMemo(() => guilds.filter((g) => !g.hasBot), [guilds]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background p-6">
				<div className="max-w-4xl mx-auto">
					<div className="mb-8">
						<div className="h-8 w-48 bg-muted animate-pulse rounded" />
						<div className="h-5 w-72 bg-muted animate-pulse rounded mt-2" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={`skeleton-${i}`} className="h-40 bg-muted animate-pulse rounded-xl" />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background p-6">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<FadeIn>
					<div className="flex items-start justify-between mb-8">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Select a Server</h1>
							<p className="text-muted-foreground mt-1">Choose a server to manage with Cogworks</p>
						</div>
						{user && (
							<div className="flex items-center gap-3">
								<span className="text-sm text-muted-foreground hidden sm:inline">
									{user.globalName ?? user.username}
								</span>
								<button
									type="button"
									onClick={logout}
									className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
									title="Logout"
								>
									<LogOut className="h-4 w-4" />
								</button>
							</div>
						)}
					</div>
				</FadeIn>

				{guilds.length === 0 ? (
					<FadeIn>
						<div className="text-center py-16">
							<Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h2 className="text-xl font-semibold mb-2">No servers found</h2>
							<p className="text-muted-foreground max-w-md mx-auto">
								You don't have admin access to any Discord servers, or you haven't added Cogworks to
								any servers yet.
							</p>
						</div>
					</FadeIn>
				) : (
					<div className="space-y-10">
						{/* Servers with Cogworks */}
						{withBot.length > 0 && (
							<section>
								<FadeIn>
									<h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
										Your Servers
									</h2>
								</FadeIn>
								<StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{withBot.map((guild) => {
										const iconUrl = getGuildIconUrl(guild.id, guild.icon, 128);
										return (
											<FadeIn key={guild.id}>
												<Card className="p-4 flex flex-col items-center text-center hover:border-primary/30 transition-colors">
													{iconUrl ? (
														<img
															src={iconUrl}
															alt={guild.name}
															className="h-16 w-16 rounded-full mb-3"
														/>
													) : (
														<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold mb-3">
															{getInitials(guild.name)}
														</div>
													)}
													<h3 className="font-semibold truncate w-full mb-3">{guild.name}</h3>
													<Button
														className="w-full"
														onClick={() => navigate(`/dashboard/${guild.id}`)}
													>
														Select
													</Button>
												</Card>
											</FadeIn>
										);
									})}
								</StaggerContainer>
							</section>
						)}

						{/* Servers without Cogworks */}
						{withoutBot.length > 0 && (
							<section>
								<FadeIn>
									<h2 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
										Add Cogworks
									</h2>
								</FadeIn>
								<StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{withoutBot.map((guild) => {
										const iconUrl = getGuildIconUrl(guild.id, guild.icon, 128);
										return (
											<FadeIn key={guild.id}>
												<Card className="p-4 flex flex-col items-center text-center opacity-75 hover:opacity-100 transition-opacity">
													{iconUrl ? (
														<img
															src={iconUrl}
															alt={guild.name}
															className="h-16 w-16 rounded-full mb-3 grayscale"
														/>
													) : (
														<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-lg font-semibold mb-3">
															{getInitials(guild.name)}
														</div>
													)}
													<h3 className="font-semibold truncate w-full mb-3">{guild.name}</h3>
													<Button
														variant="outline"
														className="w-full flex items-center justify-center gap-2"
														onClick={() => {
															window.open(
																getBotInviteUrl(guild.id),
																"_blank",
																"noopener,noreferrer",
															);
														}}
													>
														<Bot className="h-4 w-4" />
														Invite Bot
													</Button>
												</Card>
											</FadeIn>
										);
									})}
								</StaggerContainer>
							</section>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
