import type { ApiResponse } from "@/types/api";

/**
 * Fired on `window` when an admin route answers 403 ADMIN_TOTP_REQUIRED (the
 * API's 15-minute TOTP grant is missing or expired). SuperAdminRoute listens
 * and shows the TOTP form again. Unlike a 401, this keeps the user logged in.
 */
export const ADMIN_TOTP_REQUIRED_EVENT = "cogworks:admin-totp-required";

/** The API sends the code as `error.code`; a bare string is accepted too. */
export function isAdminTotpRequired(status: number, error: unknown): boolean {
	if (status !== 403) return false;
	if (error === "ADMIN_TOTP_REQUIRED") return true;
	return (
		typeof error === "object" &&
		error !== null &&
		(error as { code?: unknown }).code === "ADMIN_TOTP_REQUIRED"
	);
}

export type VerifyOutcome =
	| { kind: "verified"; expiresAt: number }
	| { kind: "wrong-code" }
	| { kind: "error"; message: string };

/**
 * Reads POST /admin/totp/verify. A wrong code is `{ success: true, verified: false }`.
 * A failed request (rate limit, server error) is not a wrong code and must not
 * count toward the lockout. The session follows the API grant's `expiresAt` when
 * it's in the future (older APIs don't send it; a skewed clock falls back to the TTL).
 */
export function verifyOutcome(
	result: ApiResponse<{ verified: boolean; expiresAt?: string }>,
	fallbackTtlMs: number,
	now = Date.now(),
): VerifyOutcome {
	if (!result.success) {
		return { kind: "error", message: result.error ?? "Verification failed. Please try again." };
	}
	if (!result.data?.verified) return { kind: "wrong-code" };
	const serverExpiry = Date.parse(result.data.expiresAt ?? "");
	return { kind: "verified", expiresAt: serverExpiry > now ? serverExpiry : now + fallbackTtlMs };
}
