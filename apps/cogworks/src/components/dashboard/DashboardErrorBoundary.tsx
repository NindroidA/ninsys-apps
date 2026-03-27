import { Button } from "@ninsys/ui/components";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("[Dashboard Error]", error, errorInfo.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex-1 flex items-center justify-center p-8">
					<div className="max-w-md w-full text-center">
						<div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
							<AlertTriangle className="h-7 w-7 text-destructive" />
						</div>
						<h2 className="text-xl font-bold mb-2">Something went wrong</h2>
						<p className="text-sm text-muted-foreground mb-6">
							An error occurred while loading this page. Please try again.
						</p>
						<div className="flex items-center gap-3 justify-center">
							<Button variant="outline" onClick={() => window.history.back()}>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Go Back
							</Button>
							<Button
								onClick={() => {
									window.location.reload();
								}}
							>
								<RefreshCw className="h-4 w-4 mr-2" />
								Reload
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
