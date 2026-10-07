import { describe, expect, test } from "bun:test";
import { toMemoryTagGroup } from "@/hooks/useMemory";
import { applicationStatusBadge, canReviewApplication } from "@/types/applications";
import type { MemoryTag } from "@/types/memory";
import { isTicketClosed, ticketStatusBadge } from "@/types/tickets";

describe("toMemoryTagGroup", () => {
	const category = { id: "1", name: "Bug", tagType: "category" } as MemoryTag;
	const status = { id: "2", name: "Open", tagType: "status" } as MemoryTag;

	test("reads the API's { category, status } shape", () => {
		expect(toMemoryTagGroup({ category: [category], status: [status] })).toEqual({
			categories: [category],
			statuses: [status],
		});
	});

	test("still reads { tags } and { categories, statuses }", () => {
		expect(toMemoryTagGroup({ tags: [category, status] })).toEqual({
			categories: [category],
			statuses: [status],
		});
		expect(toMemoryTagGroup({ categories: [category], statuses: [] })).toEqual({
			categories: [category],
			statuses: [],
		});
	});
});

describe("ticket status", () => {
	test("anything but closed is active, workflow statuses included", () => {
		for (const status of ["created", "opened", "adminOnly", "in-progress"]) {
			expect(isTicketClosed(status)).toBe(false);
		}
		expect(isTicketClosed("closed")).toBe(true);
	});

	test("badge names", () => {
		expect(ticketStatusBadge("opened")).toBe("open");
		expect(ticketStatusBadge("created")).toBe("open");
		expect(ticketStatusBadge("adminOnly")).toBe("admin_only");
		expect(ticketStatusBadge("in-progress")).toBe("in-progress");
	});
});

describe("application status", () => {
	test("Approve/Deny until accepted, rejected or closed", () => {
		for (const status of ["created", "opened", "interview"]) {
			expect(canReviewApplication(status)).toBe(true);
		}
		for (const status of ["accepted", "rejected", "closed"]) {
			expect(canReviewApplication(status)).toBe(false);
		}
	});

	test("badge names", () => {
		expect(applicationStatusBadge("opened")).toBe("pending");
		expect(applicationStatusBadge("accepted")).toBe("approved");
		expect(applicationStatusBadge("rejected")).toBe("denied");
		expect(applicationStatusBadge("closed")).toBe("archived");
		expect(applicationStatusBadge("interview")).toBe("interview");
	});
});
