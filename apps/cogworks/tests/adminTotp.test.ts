import { afterEach, describe, expect, test } from "bun:test";
import { ADMIN_TOTP_REQUIRED_EVENT, isAdminTotpRequired, verifyOutcome } from "@/lib/adminTotp";
import { apiGet } from "@/lib/api";

const timestamp = new Date().toISOString();
const TTL = 15 * 60 * 1000;
const NOW = Date.parse("2026-10-06T12:00:00Z");

describe("isAdminTotpRequired", () => {
	test("matches the API's 403 code, as an object or a string", () => {
		expect(isAdminTotpRequired(403, { code: "ADMIN_TOTP_REQUIRED", message: "x" })).toBe(true);
		expect(isAdminTotpRequired(403, "ADMIN_TOTP_REQUIRED")).toBe(true);
	});

	test("ignores other statuses and codes", () => {
		expect(isAdminTotpRequired(401, { code: "ADMIN_TOTP_REQUIRED" })).toBe(false);
		expect(isAdminTotpRequired(403, { code: "CSRF_TOKEN_INVALID" })).toBe(false);
		expect(isAdminTotpRequired(403, "Forbidden")).toBe(false);
		expect(isAdminTotpRequired(403, null)).toBe(false);
	});
});

describe("verifyOutcome", () => {
	test("a failed request is an error with its text, not a wrong code", () => {
		expect(
			verifyOutcome(
				{ success: false, error: "Rate limited. Try again in 900 seconds.", timestamp },
				TTL,
			),
		).toEqual({ kind: "error", message: "Rate limited. Try again in 900 seconds." });
		expect(verifyOutcome({ success: false, timestamp }, TTL)).toEqual({
			kind: "error",
			message: "Verification failed. Please try again.",
		});
	});

	test("verified: false is a wrong code", () => {
		expect(verifyOutcome({ success: true, data: { verified: false }, timestamp }, TTL)).toEqual({
			kind: "wrong-code",
		});
	});

	test("verified follows the API's expiresAt when it's in the future", () => {
		const expiresAt = "2026-10-06T12:10:00Z";
		expect(
			verifyOutcome({ success: true, data: { verified: true, expiresAt }, timestamp }, TTL, NOW),
		).toEqual({ kind: "verified", expiresAt: Date.parse(expiresAt) });
	});

	test("no expiresAt (older API) or one in the past falls back to the TTL", () => {
		const fallback = { kind: "verified", expiresAt: NOW + TTL };
		expect(verifyOutcome({ success: true, data: { verified: true }, timestamp }, TTL, NOW)).toEqual(
			fallback,
		);
		expect(
			verifyOutcome(
				{ success: true, data: { verified: true, expiresAt: "2026-10-06T11:00:00Z" }, timestamp },
				TTL,
				NOW,
			),
		).toEqual(fallback);
	});
});

describe("apiGet on an admin route", () => {
	const realFetch = globalThis.fetch;
	const globals = globalThis as Record<string, unknown>;

	afterEach(() => {
		globalThis.fetch = realFetch;
		globals.window = undefined;
	});

	function respondWith(status: number, body: unknown) {
		globalThis.fetch = (async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { "content-type": "application/json" },
			})) as unknown as typeof fetch;
	}

	/** A window that records the TOTP event and any redirect. */
	function fakeWindow() {
		const win = Object.assign(new EventTarget(), {
			location: { pathname: "/admin", href: "/admin" },
		});
		const events: string[] = [];
		win.addEventListener(ADMIN_TOTP_REQUIRED_EVENT, (e) => events.push(e.type));
		globals.window = win;
		return { win, events };
	}

	test("403 ADMIN_TOTP_REQUIRED asks for the TOTP form again without logging out", async () => {
		const { win, events } = fakeWindow();
		respondWith(403, {
			success: false,
			error: { code: "ADMIN_TOTP_REQUIRED", message: "Super admin TOTP verification required" },
		});
		const result = await apiGet("/admin/overview");
		expect(result.success).toBe(false);
		expect(result.error).toBe("Super admin TOTP verification required");
		expect(events).toEqual([ADMIN_TOTP_REQUIRED_EVENT]);
		expect(win.location.href).toBe("/admin");
	});

	test("other 403s don't touch the TOTP form", async () => {
		const { events } = fakeWindow();
		respondWith(403, { success: false, error: "Forbidden" });
		await apiGet("/admin/overview");
		expect(events).toEqual([]);
	});
});
