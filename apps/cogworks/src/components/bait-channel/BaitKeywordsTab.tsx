import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Slider } from "@/components/ui/Slider";
import {
	useAddBaitKeyword,
	useBaitKeywords,
	useRemoveBaitKeyword,
	useResetBaitKeywords,
} from "@/hooks/useBaitChannel";
import type { BaitKeyword } from "@/types/bait-channel";
import { Badge, Button, Input } from "@ninsys/ui/components";
import { Plus, RotateCcw, Trash2 } from "lucide-react";
import { useCallback, useId, useState } from "react";

interface BaitKeywordsTabProps {
	guildId: string;
}

const MAX_KEYWORDS = 50;

function KeywordRow({
	keyword,
	onDelete,
	isDeleting,
}: {
	keyword: BaitKeyword;
	onDelete: (kw: BaitKeyword) => void;
	isDeleting: boolean;
}) {
	return (
		<div className="flex items-center gap-3 px-4 py-2.5 border-b border-border last:border-b-0">
			<span className="text-sm font-medium flex-1 truncate">{keyword.keyword}</span>
			<Badge variant="outline" className="text-xs tabular-nums">
				{keyword.weight}
			</Badge>
			<span className="text-xs text-muted-foreground hidden sm:inline">{keyword.addedBy}</span>
			<span className="text-xs text-muted-foreground hidden sm:inline">
				{new Date(keyword.addedAt).toLocaleDateString()}
			</span>
			<button
				type="button"
				onClick={() => onDelete(keyword)}
				disabled={isDeleting}
				className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
				aria-label={`Delete ${keyword.keyword}`}
			>
				<Trash2 className="h-3.5 w-3.5" />
			</button>
		</div>
	);
}

export function BaitKeywordsTab({ guildId }: BaitKeywordsTabProps) {
	const { data: keywords = [], isLoading } = useBaitKeywords(guildId);
	const addKeyword = useAddBaitKeyword(guildId);
	const removeKeyword = useRemoveBaitKeyword(guildId);
	const resetKeywords = useResetBaitKeywords(guildId);

	const [isAdding, setIsAdding] = useState(false);
	const [newKeyword, setNewKeyword] = useState("");
	const [newWeight, setNewWeight] = useState(5);
	const [addError, setAddError] = useState<string | null>(null);
	const [deleteTarget, setDeleteTarget] = useState<BaitKeyword | null>(null);
	const [showReset, setShowReset] = useState(false);

	const keywordInputId = useId();

	const atLimit = keywords.length >= MAX_KEYWORDS;

	const handleAdd = useCallback(() => {
		const trimmed = newKeyword.trim();
		if (!trimmed) return;

		if (trimmed.length > 100) {
			setAddError("Keyword must be 100 characters or less");
			return;
		}
		if (keywords.some((k) => k.keyword.toLowerCase() === trimmed.toLowerCase())) {
			setAddError("Keyword already exists");
			return;
		}

		setAddError(null);
		addKeyword.mutate(
			{ keyword: trimmed, weight: newWeight },
			{
				onSuccess: () => {
					setNewKeyword("");
					setNewWeight(5);
					setIsAdding(false);
				},
			},
		);
	}, [newKeyword, newWeight, keywords, addKeyword]);

	const handleDelete = useCallback(() => {
		if (!deleteTarget) return;
		removeKeyword.mutate(deleteTarget.keyword, {
			onSuccess: () => setDeleteTarget(null),
		});
	}, [deleteTarget, removeKeyword]);

	const handleReset = useCallback(() => {
		resetKeywords.mutate(undefined, {
			onSuccess: () => setShowReset(false),
		});
	}, [resetKeywords]);

	if (isLoading) {
		return (
			<div className="space-y-3 animate-pulse">
				{[0, 1, 2, 3].map((i) => (
					<div key={`skel-kw-${i}`} className="h-10 rounded-lg bg-muted" />
				))}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<p className="text-sm text-muted-foreground">
						{keywords.length}/{MAX_KEYWORDS} keywords
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						onClick={() => setShowReset(true)}
						disabled={keywords.length === 0}
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						Reset
					</Button>
					{!isAdding && (
						<Button variant="outline" onClick={() => setIsAdding(true)} disabled={atLimit}>
							<Plus className="h-4 w-4 mr-2" />
							Add Keyword
						</Button>
					)}
				</div>
			</div>

			{/* Add keyword form */}
			{isAdding && (
				<div className="rounded-lg border border-primary/50 p-4 space-y-3">
					<div>
						<label htmlFor={keywordInputId} className="text-sm font-medium mb-1.5 block">
							Keyword
						</label>
						<Input
							id={keywordInputId}
							value={newKeyword}
							onChange={(e) => {
								setNewKeyword(e.target.value);
								setAddError(null);
							}}
							placeholder="Enter detection keyword..."
							maxLength={100}
							disabled={addKeyword.isPending}
							autoFocus
							onKeyDown={(e) => {
								if (e.key === "Enter") handleAdd();
							}}
						/>
						{addError && <p className="text-xs text-destructive mt-1">{addError}</p>}
					</div>
					<Slider
						value={newWeight}
						onChange={setNewWeight}
						min={1}
						max={10}
						step={1}
						label="Weight"
						disabled={addKeyword.isPending}
					/>
					<div className="flex items-center gap-2 justify-end">
						<Button
							variant="ghost"
							onClick={() => {
								setIsAdding(false);
								setNewKeyword("");
								setNewWeight(5);
								setAddError(null);
							}}
							disabled={addKeyword.isPending}
						>
							Cancel
						</Button>
						<Button onClick={handleAdd} disabled={!newKeyword.trim() || addKeyword.isPending}>
							{addKeyword.isPending ? "Adding..." : "Add Keyword"}
						</Button>
					</div>
				</div>
			)}

			{/* Keyword list */}
			{keywords.length === 0 ? (
				<div className="text-center py-12 border border-dashed border-border rounded-lg">
					<p className="text-muted-foreground mb-3">No keywords configured</p>
					<Button variant="outline" onClick={() => setIsAdding(true)}>
						<Plus className="h-4 w-4 mr-2" />
						Add Your First Keyword
					</Button>
				</div>
			) : (
				<div className="rounded-lg border border-border overflow-hidden">
					{/* Table header */}
					<div className="flex items-center gap-3 px-4 py-2 bg-muted/30 text-xs font-medium text-muted-foreground">
						<span className="flex-1">Keyword</span>
						<span className="w-12 text-center">Weight</span>
						<span className="hidden sm:inline w-24">Added By</span>
						<span className="hidden sm:inline w-20">Date</span>
						<span className="w-8" />
					</div>
					{keywords.map((kw) => (
						<KeywordRow
							key={kw.keyword}
							keyword={kw}
							onDelete={setDeleteTarget}
							isDeleting={removeKeyword.isPending}
						/>
					))}
				</div>
			)}

			{/* Delete confirmation */}
			<ConfirmDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title="Remove Keyword"
				description={`Remove "${deleteTarget?.keyword}" from detection keywords?`}
				confirmLabel="Remove"
				variant="destructive"
				isLoading={removeKeyword.isPending}
				onConfirm={handleDelete}
			/>

			{/* Reset confirmation */}
			<ConfirmDialog
				open={showReset}
				onOpenChange={setShowReset}
				title="Reset Keywords"
				description="Reset all keywords to defaults? This will remove all custom keywords."
				confirmLabel="Reset to Defaults"
				variant="destructive"
				isLoading={resetKeywords.isPending}
				onConfirm={handleReset}
			/>
		</div>
	);
}
