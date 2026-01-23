import { CommandCard } from "@/components/cogworks";
import { commandCategories, commands } from "@/data/commands";
import { Input } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function CommandsPage() {
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");

	const filteredCommands = useMemo(() => {
		return commands.filter((cmd) => {
			const matchesSearch =
				search === "" ||
				cmd.name.toLowerCase().includes(search.toLowerCase()) ||
				cmd.description.toLowerCase().includes(search.toLowerCase());

			const matchesCategory = selectedCategory === "All" || cmd.category === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [search, selectedCategory]);

	return (
		<div className="min-h-screen py-20">
			<div className="container mx-auto px-4">
				{/* Header */}
				<FadeIn className="text-center mb-12">
					<h1 className="text-4xl sm:text-5xl font-bold mb-4">Command Reference</h1>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						Browse all available commands. Click on any command to see detailed usage information.
					</p>
				</FadeIn>

				{/* Search and Filters */}
				<FadeIn className="max-w-4xl mx-auto mb-8">
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search */}
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Search commands..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-10"
							/>
						</div>

						{/* Category Filter */}
						<div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
							{commandCategories.map((category) => (
								<button
									key={category}
									type="button"
									onClick={() => setSelectedCategory(category)}
									className={cn(
										"px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
										selectedCategory === category
											? "bg-primary text-primary-foreground"
											: "bg-muted hover:bg-muted/80 text-muted-foreground",
									)}
								>
									{category}
								</button>
							))}
						</div>
					</div>
				</FadeIn>

				{/* Commands List */}
				<div className="max-w-4xl mx-auto">
					{filteredCommands.length === 0 ? (
						<FadeIn className="text-center py-12">
							<p className="text-muted-foreground">No commands found matching your search.</p>
						</FadeIn>
					) : (
						<StaggerContainer key={selectedCategory} className="space-y-4">
							{filteredCommands.map((cmd) => (
								<motion.div
									key={cmd.name}
									variants={{
										hidden: { opacity: 0, y: 10 },
										visible: { opacity: 1, y: 0 },
									}}
								>
									<CommandCard
										name={cmd.name}
										description={cmd.description}
										usage={cmd.usage}
										category={cmd.category}
										permissions={cmd.permissions}
										examples={cmd.examples}
										subcommands={cmd.subcommands}
									/>
								</motion.div>
							))}
						</StaggerContainer>
					)}
				</div>

				{/* Stats */}
				<FadeIn className="mt-12 text-center text-sm text-muted-foreground">
					Showing {filteredCommands.length} of {commands.length} commands
				</FadeIn>
			</div>
		</div>
	);
}
