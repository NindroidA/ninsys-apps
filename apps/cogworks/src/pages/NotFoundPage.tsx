import { FadeIn } from "@ninsys/ui/components/animations";
import { Button } from "@ninsys/ui/components";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
	return (
		<div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
			<FadeIn>
				<h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
				<h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
				<p className="text-muted-foreground mb-8 max-w-md">
					The page you're looking for doesn't exist or has been moved. Let's get you back on track.
				</p>
				<Link to="/">
					<Button leftIcon={<Home className="h-4 w-4" />}>Back to Home</Button>
				</Link>
			</FadeIn>
		</div>
	);
}
