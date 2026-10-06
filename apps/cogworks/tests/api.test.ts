import { describe, expect, test } from "bun:test";
import { throwOnApiError } from "@/lib/api";
import { isModuleAvailable } from "@/lib/constants";

const timestamp = new Date().toISOString();

describe("throwOnApiError", () => {
	test("returns the data of a success response", () => {
		expect(throwOnApiError({ success: true, data: { id: 1 }, timestamp }, "failed")).toEqual({
			id: 1,
		});
	});

	test("a success response without data (delete, clear) does not throw", () => {
		expect(throwOnApiError({ success: true, timestamp }, "Failed to delete")).toBeUndefined();
	});

	test("throws the API error message on failure", () => {
		expect(() =>
			throwOnApiError({ success: false, error: "Ticket type not found", timestamp }, "failed"),
		).toThrow("Ticket type not found");
	});

	test("falls back to the given message when the failure has no error string", () => {
		expect(() => throwOnApiError({ success: false, timestamp }, "Failed to delete")).toThrow(
			"Failed to delete",
		);
	});
});

describe("isModuleAvailable", () => {
	test("modules without a bot backend are unavailable", () => {
		for (const module of ["xp", "starboard", "events", "onboarding", "sla", "routing"]) {
			expect(isModuleAvailable(module)).toBe(false);
		}
		expect(isModuleAvailable("incidents")).toBe(false);
		expect(isModuleAvailable("analytics-settings")).toBe(false);
	});

	test("everything else stays available, including inherited object keys", () => {
		for (const module of ["", "tickets", "server-analytics", "constructor", "toString"]) {
			expect(isModuleAvailable(module)).toBe(true);
		}
	});
});
