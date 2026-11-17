import { afterEach, describe, expect, test } from "bun:test";
import { fetchBotHealth } from "@/hooks/useBotHealth";

const realFetch = globalThis.fetch;
const globals = globalThis as Record<string, unknown>;

function respondWith(status: number, body: unknown, contentType = "application/json") {
	globalThis.fetch = (async () =>
		new Response(typeof body === "string" ? body : JSON.stringify(body), {
			status,
			headers: { "content-type": contentType },
		})) as unknown as typeof fetch;
}

afterEach(() => {
	globalThis.fetch = realFetch;
	globals.window = undefined;
});

const RECENT = new Date(Date.now() - 11 * 60 * 1000).toISOString();
const EPOCH = new Date(0).toISOString();

describe("fetchBotHealth", () => {
	test("online: true clears the banner", async () => {
		respondWith(200, { online: true, ready: true, lastUpdate: new Date().toISOString() });
		expect(await fetchBotHealth()).toEqual({ online: true });
	});

	test("online: false after a real heartbeat means the bot is offline", async () => {
		respondWith(200, { online: false, ready: false, lastUpdate: RECENT });
		await expect(fetchBotHealth()).rejects.toThrow("Bot is currently offline");
	});

	test("online: false with an epoch lastUpdate is unknown (BFF restarted, bot not heard yet)", async () => {
		respondWith(200, { online: false, ready: false, lastUpdate: EPOCH });
		expect(await fetchBotHealth()).toEqual({ online: null });
	});

	test("online: false with a missing or unreadable lastUpdate is unknown", async () => {
		respondWith(200, { online: false });
		expect(await fetchBotHealth()).toEqual({ online: null });
		respondWith(200, { online: false, lastUpdate: "not a date" });
		expect(await fetchBotHealth()).toEqual({ online: null });
	});

	test("a wrapped 503 with no error string means the bot is offline", async () => {
		respondWith(503, { success: false });
		await expect(fetchBotHealth()).rejects.toThrow("Bot is currently offline");
	});

	test("the BFF's own 500 is unknown, not offline", async () => {
		respondWith(500, { online: false, error: "Status check failed" });
		expect(await fetchBotHealth()).toEqual({ online: null });
	});

	test("rate limits and non-JSON replies are unknown", async () => {
		respondWith(429, { success: false, error: "Too many requests" });
		expect(await fetchBotHealth()).toEqual({ online: null });
		respondWith(502, "<html>Bad Gateway</html>", "text/html");
		expect(await fetchBotHealth()).toEqual({ online: null });
	});

	test("an auth error says nothing bad about the bot", async () => {
		globals.window = { location: { pathname: "/login", href: "/login" } };
		respondWith(401, { success: false, error: "Unauthorized" });
		expect(await fetchBotHealth()).toEqual({ online: true });
	});
});
