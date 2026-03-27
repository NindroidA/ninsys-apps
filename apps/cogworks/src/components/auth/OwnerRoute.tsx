import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

interface OwnerRouteProps {
	children: ReactNode;
}

export function OwnerRoute({ children }: OwnerRouteProps) {
	const { isOwner, isLoading } = useAuth();
	const { guildId } = useParams<{ guildId: string }>();

	if (isLoading) {
		return null;
	}

	if (!isOwner) {
		return <Navigate to={`/dashboard/${guildId ?? ""}`} replace />;
	}

	return <>{children}</>;
}
