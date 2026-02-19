import { Button } from "@ninsys/ui/components";
import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("[ErrorBoundary]", error, errorInfo.componentStack);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center p-4">
					<div className="max-w-md w-full text-center">
						<div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
							<span className="text-3xl">!</span>
						</div>
						<h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
						<p className="text-muted-foreground mb-6">
							An unexpected error occurred. Please try refreshing the page.
						</p>
						<Button onClick={() => window.location.reload()}>Refresh Page</Button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
