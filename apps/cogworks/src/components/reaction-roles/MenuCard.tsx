import type { ReactionRoleMenu } from "@/types/reaction-roles";
import { Badge, Button, Card } from "@ninsys/ui/components";
import { AlertCircle, CheckCircle2, Pencil, RefreshCw, Shield, Trash2 } from "lucide-react";
import { MODE_COLORS, MODE_INFO } from "./constants";

export function MenuCard({
	menu,
	onEdit,
	onValidate,
	onRebuild,
	onDelete,
}: {
	menu: ReactionRoleMenu;
	onEdit: () => void;
	onValidate: () => void;
	onRebuild: () => void;
	onDelete: () => void;
}) {
	return (
		<Card className="p-4 hover:border-primary/30 transition-colors">
			<div className="flex items-start justify-between gap-3">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<h3 className="font-semibold truncate">{menu.name}</h3>
						<Badge className={MODE_COLORS[menu.mode]} variant="outline">
							{MODE_INFO[menu.mode].label}
						</Badge>
						{menu.isValid ? (
							<CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
						) : (
							<AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
						)}
					</div>
					{menu.description && (
						<p className="text-sm text-muted-foreground truncate">{menu.description}</p>
					)}
					<p className="text-xs text-muted-foreground mt-1">
						{menu.options.length} option{menu.options.length !== 1 ? "s" : ""}
					</p>
				</div>

				<div className="flex items-center gap-1 shrink-0">
					<Button variant="ghost" onClick={onEdit} className="h-8 w-8 p-0">
						<Pencil className="h-4 w-4" />
					</Button>
					<Button variant="ghost" onClick={onValidate} className="h-8 w-8 p-0">
						<Shield className="h-4 w-4" />
					</Button>
					<Button variant="ghost" onClick={onRebuild} className="h-8 w-8 p-0">
						<RefreshCw className="h-4 w-4" />
					</Button>
					<Button
						variant="ghost"
						onClick={onDelete}
						className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</Card>
	);
}
