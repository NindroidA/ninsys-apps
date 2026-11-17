import { afterEach, describe, expect, test } from "bun:test";
import {
	DEFAULT_BAN_REASON,
	DEFAULT_WARNING_MESSAGE,
	baitConfigChanges,
	firedFlags,
	normalizeBaitStats,
	withDefaultMessages,
} from "@/hooks/useBaitChannel";
import { apiGet } from "@/lib/api";

describe("normalizeBaitStats", () => {
	test("keeps the bot's override percentage and maps total and buckets", () => {
		const stats = normalizeBaitStats({
			days: 30,
			total: 4,
			actionBreakdown: { ban: 3, logged: 1 },
			overrideRate: 25,
			overriddenCount: 1,
			scoreDistribution: { "0-9": 0, "90-100": 4 },
			topFlags: [{ flag: "newAccount", count: 4 }],
		});
		expect(stats).toEqual({
			total: 4,
			actionBreakdown: { ban: 3, logged: 1 },
			overrideRate: 25,
			overriddenCount: 1,
			scoreDistribution: [
				{ bucket: "0-9", count: 0 },
				{ bucket: "90-100", count: 4 },
			],
			topFlags: [{ flag: "newAccount", count: 4 }],
		});
	});

	test("an empty body gives zeros, not undefined", () => {
		expect(normalizeBaitStats({})).toEqual({
			total: 0,
			actionBreakdown: {},
			overrideRate: 0,
			overriddenCount: 0,
			scoreDistribution: [],
			topFlags: [],
		});
	});
});

describe("firedFlags", () => {
	test("lists only the flags that fired", () => {
		expect(firedFlags({ newAccount: true, noMessages: false, linkSpam: true })).toEqual([
			"newAccount",
			"linkSpam",
		]);
	});

	test("null flags (older rows) are an empty list", () => {
		expect(firedFlags(null)).toEqual([]);
	});
});

describe("baitConfigChanges", () => {
	const original = {
		channelId: "111111111111111111",
		banReason: "Custom reason",
		warningMessage: DEFAULT_WARNING_MESSAGE,
		testMode: false,
		deleteMessageDays: 1,
	};

	test("sends only the settings that changed", () => {
		expect(baitConfigChanges({ ...original, testMode: true }, original)).toEqual({
			testMode: true,
		});
		expect(baitConfigChanges(original, original)).toEqual({});
	});

	test("an emptied custom message saves as the bot's default", () => {
		expect(baitConfigChanges({ ...original, banReason: "  " }, original)).toEqual({
			banReason: DEFAULT_BAN_REASON,
		});
	});

	test("emptying a message that already is the default is no change", () => {
		expect(baitConfigChanges({ ...original, warningMessage: "" }, original)).toEqual({});
	});

	test("other text is sent as typed, so a stored trailing space is no change", () => {
		const stored = { ...original, banReason: "Custom reason " };
		expect(baitConfigChanges(stored, stored)).toEqual({});
	});

	test("a cleared bait channel is left out", () => {
		expect(baitConfigChanges({ ...original, channelId: null }, original)).toEqual({});
	});
});

describe("withDefaultMessages", () => {
	test("fills only emptied messages", () => {
		expect(withDefaultMessages({ banReason: "", warningMessage: "Keep me" })).toEqual({
			banReason: DEFAULT_BAN_REASON,
			warningMessage: "Keep me",
		});
	});
});

describe("API client on bait routes", () => {
	const realFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = realFetch;
	});

	function respondWith(status: number, body: unknown) {
		globalThis.fetch = (async () =>
			new Response(JSON.stringify(body), {
				status,
				headers: { "content-type": "application/json" },
			})) as unknown as typeof fetch;
	}

	test("a bot error the API proxies inside data is the error text", async () => {
		respondWith(409, { success: false, data: { error: "Log entry is already overridden" } });
		const result = await apiGet("/guilds/1/bait-channel/override");
		expect(result.error).toBe("Log entry is already overridden");
		expect(result.status).toBe(409);
	});

	test("a failure carries its HTTP status, so a 404 reads as not set up", async () => {
		respondWith(404, { success: false, error: "Bait channel not configured" });
		const result = await apiGet("/guilds/1/bait-channel/whitelist");
		expect(result.success).toBe(false);
		expect(result.status).toBe(404);
	});
});
