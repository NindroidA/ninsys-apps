import { apiGet, apiPost, throwOnApiError } from "@/lib/api";
import { toast } from "@/stores/toastStore";
import type { OnboardingConfig, OnboardingStats, OnboardingStep } from "@/types/onboarding";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useOnboardingConfig(guildId: string) {
	return useQuery({
		queryKey: ["onboarding", "config", guildId],
		queryFn: async () => {
			const result = await apiGet<OnboardingConfig>(`/guilds/${guildId}/onboarding/config`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useUpdateOnboardingConfig(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<OnboardingConfig>) => {
			const result = await apiPost<OnboardingConfig>(
				`/guilds/${guildId}/onboarding/config/update`,
				data,
			);
			return throwOnApiError(result, "Failed to update onboarding config");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["onboarding", "config", guildId],
			});
			toast.success("Onboarding settings updated");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useOnboardingSteps(guildId: string) {
	return useQuery({
		queryKey: ["onboarding", "steps", guildId],
		queryFn: async () => {
			const result = await apiGet<OnboardingStep[]>(`/guilds/${guildId}/onboarding/steps`);
			if (!result.success || !result.data) return [];
			return Array.isArray(result.data) ? result.data : [];
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}

export function useCreateOnboardingStep(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Omit<OnboardingStep, "id" | "sortOrder">) => {
			const result = await apiPost<OnboardingStep>(`/guilds/${guildId}/onboarding/steps/add`, data);
			return throwOnApiError(result, "Failed to create step");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["onboarding", "steps", guildId],
			});
			toast.success("Onboarding step added");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useDeleteOnboardingStep(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (stepId: string) => {
			const result = await apiPost(`/guilds/${guildId}/onboarding/steps/remove`, { stepId });
			return throwOnApiError(result, "Failed to delete step");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["onboarding", "steps", guildId],
			});
			toast.success("Onboarding step removed");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useReorderOnboardingSteps(guildId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (stepIds: string[]) => {
			const result = await apiPost(`/guilds/${guildId}/onboarding/steps/reorder`, { stepIds });
			return throwOnApiError(result, "Failed to reorder steps");
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["onboarding", "steps", guildId],
			});
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});
}

export function useOnboardingStats(guildId: string) {
	return useQuery({
		queryKey: ["onboarding", "stats", guildId],
		queryFn: async () => {
			const result = await apiGet<OnboardingStats>(`/guilds/${guildId}/onboarding/stats`);
			if (!result.success || !result.data) return null;
			return result.data;
		},
		staleTime: 1000 * 60 * 5,
		enabled: !!guildId,
	});
}
