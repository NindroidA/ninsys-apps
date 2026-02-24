/**
 * Admin Audit Log page - read-only trail of admin actions
 */

import { ADMIN_PAGE_SIZE } from "@/lib/constants";
import { useAdminAuditLog } from "@/hooks/useAdmin";
import { Button } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, ClipboardList, Loader2 } from "lucide-react";
import { useState } from "react";

export function AdminAuditLogPage() {
	const [page, setPage] = useState(1);
	const { data, isLoading } = useAdminAuditLog(page);

	const totalPages = data ? Math.ceil(data.total / ADMIN_PAGE_SIZE) : 0;

	return (
		<div className="space-y-6">
			<FadeIn>
				<div className="flex items-center gap-3">
					<ClipboardList className="h-6 w-6 text-primary" />
					<h1 className="text-2xl font-bold">Audit Log</h1>
				</div>
			</FadeIn>

			<FadeIn delay={0.1}>
				{isLoading ? (
					<div className="flex items-center justify-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
						<span className="sr-only">Loading audit log...</span>
					</div>
				) : (
					<>
						<div className="rounded-xl border border-border overflow-hidden">
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className="bg-muted/50">
											<th className="text-left px-4 py-3 font-medium text-muted-foreground">Admin</th>
											<th className="text-left px-4 py-3 font-medium text-muted-foreground">Action</th>
											<th className="text-left px-4 py-3 font-medium text-muted-foreground">Target User</th>
											<th className="text-left px-4 py-3 font-medium text-muted-foreground">Details</th>
											<th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
										</tr>
									</thead>
									<tbody>
										{!data?.entries?.length ? (
											<tr>
												<td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
													No audit log entries.
												</td>
											</tr>
										) : (
											data.entries.map((entry) => (
												<tr key={entry.id} className="border-t border-border">
													<td className="px-4 py-3 font-medium">{entry.adminEmail}</td>
													<td className="px-4 py-3">
														<span className="px-2 py-0.5 rounded bg-muted text-xs font-medium">
															{entry.action}
														</span>
													</td>
													<td className="px-4 py-3 text-muted-foreground">
														{entry.targetUserEmail || "—"}
													</td>
													<td className="px-4 py-3 text-muted-foreground max-w-xs truncate">
														{entry.details || "—"}
													</td>
													<td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
														{format(new Date(entry.createdAt), "MMM d, yyyy HH:mm")}
													</td>
												</tr>
											))
										)}
									</tbody>
								</table>
							</div>
						</div>

						{totalPages > 1 && (
							<div className="flex items-center justify-between">
								<p className="text-sm text-muted-foreground">{data!.total} entries total</p>
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage((p) => Math.max(1, p - 1))}
										disabled={page <= 1}
										aria-label="Previous page"
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<span className="text-sm text-muted-foreground">
										Page {page} of {totalPages}
									</span>
									<Button
										variant="outline"
										size="sm"
										onClick={() => setPage((p) => p + 1)}
										disabled={page >= totalPages}
										aria-label="Next page"
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
						)}
					</>
				)}
			</FadeIn>
		</div>
	);
}
