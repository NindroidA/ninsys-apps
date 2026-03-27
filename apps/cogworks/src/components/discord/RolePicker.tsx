import { useClickOutside } from "@/hooks/useClickOutside";
import { useRoles } from "@/hooks/useDiscord";
import { intToHex, normalizeColor } from "@/lib/utils";
import { cn } from "@ninsys/ui/lib";
import { ChevronDown, X } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";

interface RolePickerProps {
	guildId: string;
	value: string | string[] | null;
	onChange: (roleId: string | string[] | null) => void;
	multi?: boolean;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	clearable?: boolean;
	excludeEveryone?: boolean;
}

export function RolePicker({
	guildId,
	value,
	onChange,
	multi = false,
	placeholder = "Select a role",
	label,
	error,
	disabled,
	clearable,
	excludeEveryone = true,
}: RolePickerProps) {
	const { data: roles = [], isLoading } = useRoles(guildId);
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	const handleClose = useCallback(() => {
		setIsOpen(false);
		setSearch("");
	}, []);

	useClickOutside(containerRef, handleClose, isOpen);

	const filteredRoles = useMemo(() => {
		let filtered = roles
			.filter((r) => !excludeEveryone || r.name !== "@everyone")
			.sort((a, b) => b.position - a.position);
		if (search) {
			const q = search.toLowerCase();
			filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
		}
		return filtered;
	}, [roles, excludeEveryone, search]);

	const selectedValues = multi
		? Array.isArray(value)
			? value
			: []
		: value
			? [value as string]
			: [];
	const selectedRoles = roles.filter((r) => selectedValues.includes(r.id));

	const toggleRole = (roleId: string) => {
		if (multi) {
			const current = Array.isArray(value) ? value : [];
			if (current.includes(roleId)) {
				onChange(current.filter((id) => id !== roleId));
			} else {
				onChange([...current, roleId]);
			}
		} else {
			onChange(roleId);
			handleClose();
		}
	};

	return (
		<div ref={containerRef} className="relative">
			{label && <label className="text-sm font-medium mb-1.5 block">{label}</label>}
			<button
				type="button"
				disabled={disabled || isLoading}
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"flex items-center justify-between w-full rounded-lg border px-3 py-2 text-sm transition-colors min-h-[38px]",
					error ? "border-destructive" : "border-border",
					disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50",
				)}
			>
				<div className="flex flex-wrap gap-1 flex-1 min-w-0">
					{selectedRoles.length === 0 ? (
						<span className="text-muted-foreground">{placeholder}</span>
					) : multi ? (
						selectedRoles.map((r) => (
							<span
								key={r.id}
								className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
							>
								<span
									className="h-2 w-2 rounded-full flex-shrink-0"
									style={{ backgroundColor: intToHex(normalizeColor(r.color)) }}
								/>
								{r.name}
								<X
									className="h-3 w-3 cursor-pointer hover:text-destructive"
									onClick={(e) => {
										e.stopPropagation();
										toggleRole(r.id);
									}}
								/>
							</span>
						))
					) : (
						<span className="flex items-center gap-2">
							<span
								className="h-3 w-3 rounded-full"
								style={{
									backgroundColor: intToHex(normalizeColor(selectedRoles[0]?.color ?? 0)),
								}}
							/>
							{selectedRoles[0]?.name}
						</span>
					)}
				</div>
				<div className="flex items-center gap-1 flex-shrink-0">
					{clearable && selectedValues.length > 0 && (
						<span
							role="button"
							tabIndex={0}
							onClick={(e) => {
								e.stopPropagation();
								onChange(multi ? [] : null);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.stopPropagation();
									onChange(multi ? [] : null);
								}
							}}
							className="p-0.5 rounded hover:bg-muted"
						>
							<X className="h-3 w-3" />
						</span>
					)}
					<ChevronDown
						className={cn(
							"h-4 w-4 text-muted-foreground transition-transform",
							isOpen && "rotate-180",
						)}
					/>
				</div>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
					<div className="p-2 border-b border-border">
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search roles..."
							className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary/50"
						/>
					</div>
					<div className="max-h-56 overflow-y-auto py-1">
						{filteredRoles.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">No roles found</p>
						) : (
							filteredRoles.map((role) => {
								const isSelected = selectedValues.includes(role.id);
								return (
									<button
										key={role.id}
										type="button"
										onClick={() => toggleRole(role.id)}
										className={cn(
											"flex items-center gap-2 w-full px-3 py-1.5 text-sm hover:bg-muted transition-colors",
											isSelected && "bg-primary/5",
										)}
									>
										<span
											className="h-3 w-3 rounded-full flex-shrink-0"
											style={{
												backgroundColor: intToHex(normalizeColor(role.color)),
											}}
										/>
										<span className="flex-1 text-left truncate">{role.name}</span>
										{multi && isSelected && <span className="text-primary text-xs">Selected</span>}
									</button>
								);
							})
						)}
					</div>
				</div>
			)}

			{error && <p className="text-xs text-destructive mt-1">{error}</p>}
		</div>
	);
}
