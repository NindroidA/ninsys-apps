import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfigSection } from "@/components/forms/ConfigSection";
import { EmojiTextarea } from "@/components/ui/EmojiTextarea";
import { Select } from "@/components/ui/Select";
import {
	clearGlobalAnnouncement,
	getGlobalAnnouncement,
	getMaintenanceBannerMessage,
	setGlobalAnnouncement,
	setMaintenanceBannerMessage,
	useBotStatusFull,
	useClearStatusOverride,
	useMaintenanceStatus,
	useSetStatusOverride,
} from "@/hooks/useMaintenance";
import { usePageTitle } from "@/hooks/usePageTitle";
import type { StatusLevel } from "@/types/maintenance";
import { Badge, Button, Card, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import {
	AlertTriangle,
	CheckCircle2,
	Clock,
	Construction,
	Loader2,
	Radio,
	Server,
	XCircle,
} from "lucide-react";
import { useCallback, useState } from "react";

const LEVEL_CONFIG: Record<
	StatusLevel,
	{ label: string; color: string; dotColor: string; icon: typeof CheckCircle2 }
> = {
	operational: {
		label: "Operational",
		color: "text-green-500",
		dotColor: "bg-green-500",
		icon: CheckCircle2,
	},
	degraded: {
		label: "Degraded",
		color: "text-yellow-500",
		dotColor: "bg-yellow-500",
		icon: AlertTriangle,
	},
	"partial-outage": {
		label: "Partial Outage",
		color: "text-orange-500",
		dotColor: "bg-orange-500",
		icon: AlertTriangle,
	},
	"major-outage": {
		label: "Major Outage",
		color: "text-red-500",
		dotColor: "bg-red-500",
		icon: XCircle,
	},
	maintenance: {
		label: "Maintenance",
		color: "text-blue-500",
		dotColor: "bg-blue-500",
		icon: Construction,
	},
};

function formatUptime(seconds: number): string {
	if (!seconds || seconds <= 0) return "—";
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor((seconds % 86400) / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	if (days > 0) return `${days}d ${hours}h`;
	if (hours > 0) return `${hours}h ${mins}m`;
	return `${mins}m`;
}

export function AdminBotStatusPage() {
	usePageTitle("Bot Status — Admin");
	const { data: maintenance } = useMaintenanceStatus();
	const { data: botStatus, isLoading } = useBotStatusFull();
	const setOverride = useSetStatusOverride();
	const clearOverride = useClearStatusOverride();

	const [overrideMessage, setOverrideMessage] = useState("");
	const [overrideLevel, setOverrideLevel] = useState<StatusLevel>("maintenance");
	const [bannerMessage, setBannerMessage] = useState(() => getMaintenanceBannerMessage());

	const handleSetOverride = useCallback(() => {
		if (!overrideMessage.trim()) return;
		setOverride.mutate(
			{ message: overrideMessage.trim(), level: overrideLevel },
			{ onSuccess: () => setOverrideMessage("") },
		);
	}, [overrideMessage, overrideLevel, setOverride]);

	const handleSaveBannerMessage = useCallback(() => {
		setMaintenanceBannerMessage(bannerMessage);
	}, [bannerMessage]);

	const statusConfig = botStatus
		? (LEVEL_CONFIG[botStatus.level] ?? LEVEL_CONFIG.operational)
		: null;

	return (
		<FadeIn>
			<PageHeader
				title="Bot Status & Maintenance"
				description="Monitor bot status and manage global status overrides"
			/>

			<div className="space-y-6 max-w-4xl">
				{/* Maintenance Mode Alert */}
				{maintenance?.active && (
					<Card className="p-4 border-amber-500/30 bg-amber-500/5">
						<div className="flex items-center gap-3">
							<Construction className="h-5 w-5 text-amber-500" />
							<div>
								<p className="text-sm font-medium text-amber-300">Maintenance Mode Active</p>
								<p className="text-xs text-amber-300/70">
									The bot is in maintenance mode
									{maintenance.startedAt &&
										` since ${new Date(maintenance.startedAt).toLocaleString()}`}
									{maintenance.version && ` (v${maintenance.version})`}
								</p>
							</div>
						</div>
					</Card>
				)}

				{/* Current Status */}
				<ConfigSection title="Current Status" description="Live bot status information">
					{isLoading ? (
						<div className="flex items-center gap-2 py-4">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span className="text-sm text-muted-foreground">Loading status...</span>
						</div>
					) : !botStatus ? (
						<p className="text-sm text-muted-foreground py-4">
							Unable to retrieve bot status. The bot may be offline or in maintenance mode.
						</p>
					) : (
						<div className="space-y-4">
							{/* Status level */}
							<div className="flex items-center gap-3">
								<span className={cn("h-3 w-3 rounded-full", statusConfig?.dotColor)} />
								<span className={cn("text-lg font-semibold", statusConfig?.color)}>
									{statusConfig?.label}
								</span>
								{botStatus.isOverride && (
									<Badge
										variant="outline"
										className="text-xs bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-blue-400 border-blue-500/20"
									>
										Override Active
									</Badge>
								)}
							</div>

							{/* Status details */}
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-xs text-muted-foreground">Uptime</p>
										<p className="text-sm font-medium">{formatUptime(botStatus.uptime)}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Server className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-xs text-muted-foreground">Servers</p>
										<p className="text-sm font-medium">{botStatus.guilds}</p>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<Radio className="h-4 w-4 text-muted-foreground" />
									<div>
										<p className="text-xs text-muted-foreground">Presence</p>
										<p className="text-sm font-medium truncate">{botStatus.presenceText}</p>
									</div>
								</div>
								<div>
									<p className="text-xs text-muted-foreground">Version</p>
									<p className="text-sm font-medium">v{botStatus.version}</p>
								</div>
							</div>

							{/* Override message */}
							{botStatus.isOverride && botStatus.message && (
								<Card className="p-3 bg-blue-500/5 border-blue-500/20">
									<p className="text-sm">
										<span className="font-medium">Override message:</span> {botStatus.message}
									</p>
									{botStatus.overrideExpiresAt && (
										<p className="text-xs text-muted-foreground mt-1">
											Expires: {new Date(botStatus.overrideExpiresAt).toLocaleString()}
										</p>
									)}
								</Card>
							)}
						</div>
					)}
				</ConfigSection>

				{/* Override Controls */}
				<ConfigSection
					title="Status Override"
					description="Set a custom presence message and post a status update to the bot's status channel. Expires after 24 hours."
				>
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium mb-1.5 block">Presence Message</label>
							<Input
								value={overrideMessage}
								onChange={(e) => setOverrideMessage(e.target.value)}
								placeholder="e.g. Scheduled maintenance at 10pm UTC"
								maxLength={128}
							/>
						</div>

						<Select
							value={overrideLevel}
							onChange={(v) => setOverrideLevel(v as StatusLevel)}
							options={Object.entries(LEVEL_CONFIG).map(([value, cfg]) => ({
								value,
								label: cfg.label,
							}))}
							label="Status Level"
						/>

						<div className="flex items-center gap-3">
							<Button
								onClick={handleSetOverride}
								disabled={!overrideMessage.trim() || setOverride.isPending}
							>
								{setOverride.isPending ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin mr-2" />
										Setting...
									</>
								) : (
									"Set Override"
								)}
							</Button>

							{botStatus?.isOverride && (
								<Button
									variant="outline"
									onClick={() => clearOverride.mutate()}
									disabled={clearOverride.isPending}
								>
									{clearOverride.isPending ? "Clearing..." : "Clear Override"}
								</Button>
							)}
						</div>
					</div>
				</ConfigSection>

				{/* Maintenance Banner Message */}
				<ConfigSection
					title="Maintenance Banner Message"
					description="Custom message shown across the webapp when the bot is in maintenance mode"
				>
					<div className="space-y-3">
						<EmojiTextarea
							value={bannerMessage}
							onChange={setBannerMessage}
							placeholder="Cogworks services are currently undergoing maintenance..."
							rows={3}
							maxLength={500}
						/>
						<div className="flex items-center justify-between">
							<p className="text-xs text-muted-foreground">{bannerMessage.length}/500 characters</p>
							<Button variant="outline" onClick={handleSaveBannerMessage}>
								Save Message
							</Button>
						</div>

						{/* Preview */}
						<div className="rounded-lg overflow-hidden border border-amber-500/20">
							<div className="bg-gradient-to-r from-amber-500/15 to-orange-500/10 px-4 py-3 flex items-center gap-3">
								<Construction className="h-5 w-5 text-amber-500 flex-shrink-0" />
								<p className="text-sm text-amber-200 flex-1">{bannerMessage}</p>
								<span className="text-xs text-amber-400/50">✕</span>
							</div>
						</div>
					</div>
				</ConfigSection>

				{/* Global Announcement */}
				<GlobalAnnouncementSection />
			</div>
		</FadeIn>
	);
}

function GlobalAnnouncementSection() {
	const existing = getGlobalAnnouncement();
	const [message, setMessage] = useState(existing?.message ?? "");
	const [type, setType] = useState<"info" | "warning" | "success">(existing?.type ?? "info");
	const [saved, setSaved] = useState(false);

	const handleSet = useCallback(() => {
		if (!message.trim()) return;
		setGlobalAnnouncement(message.trim(), type);
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	}, [message, type]);

	const handleClear = useCallback(() => {
		clearGlobalAnnouncement();
		setMessage("");
		setType("info");
		setSaved(false);
	}, []);

	return (
		<ConfigSection
			title="Global Announcement"
			description="Show a custom banner across all pages — independent of maintenance mode"
		>
			<div className="space-y-4">
				{existing && (
					<Card className="p-3 border-primary/20 bg-primary/5">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs text-muted-foreground">Currently active</p>
								<p className="text-sm mt-0.5">{existing.message}</p>
							</div>
							<Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive">
								Clear
							</Button>
						</div>
					</Card>
				)}

				<div>
					<label className="text-sm font-medium mb-1.5 block">Message</label>
					<EmojiTextarea
						value={message}
						onChange={setMessage}
						placeholder="e.g. We're migrating to a new server! Expect brief downtime tonight."
						rows={2}
						maxLength={300}
					/>
					<p className="text-xs text-muted-foreground mt-1">{message.length}/300</p>
				</div>

				<Select
					value={type}
					onChange={(v) => setType(v as "info" | "warning" | "success")}
					options={[
						{ value: "info", label: "Info (Blue)" },
						{ value: "warning", label: "Warning (Amber)" },
						{ value: "success", label: "Success (Green)" },
					]}
					label="Banner Type"
				/>

				<div className="flex items-center gap-3">
					<Button onClick={handleSet} disabled={!message.trim()}>
						{saved ? "Saved!" : existing ? "Update Announcement" : "Set Announcement"}
					</Button>
					{existing && (
						<Button variant="outline" onClick={handleClear}>
							Clear Announcement
						</Button>
					)}
				</div>
			</div>
		</ConfigSection>
	);
}
