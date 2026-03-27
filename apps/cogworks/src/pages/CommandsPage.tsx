import { SEO } from "@/components/SEO";
import { CommandCard } from "@/components/cogworks";
import type { ApiCommand } from "@/hooks/useCommands";
import { useCommands } from "@/hooks/useCommands";
import { Input } from "@ninsys/ui/components";
import { FadeIn, StaggerContainer } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

/** Flatten subcommandGroups into a flat subcommands list for the CommandCard */
function flattenSubcommands(cmd: ApiCommand) {
  const subs: { name: string; description: string; usage: string }[] = [];

  for (const sub of cmd.subcommands ?? []) {
    subs.push({
      name: sub.name,
      description: sub.description,
      usage: sub.usage || `/${cmd.name} ${sub.name}`,
    });
  }

  for (const group of cmd.subcommandGroups ?? []) {
    for (const sub of group.subcommands ?? []) {
      subs.push({
        name: `${group.name} ${sub.name}`,
        description: sub.description,
        usage: sub.usage || `/${cmd.name} ${group.name} ${sub.name}`,
      });
    }
  }

  return subs;
}

export function CommandsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: apiData, isLoading } = useCommands();

  const commands = apiData?.commands ?? [];
  const categories = apiData?.categories
    ? ["All", ...apiData.categories]
    : ["All"];

  const filteredCommands = useMemo(() => {
    return commands.filter((cmd) => {
      const matchesSearch =
        search === "" ||
        cmd.name.toLowerCase().includes(search.toLowerCase()) ||
        cmd.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || cmd.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [commands, search, selectedCategory]);

  return (
    <div className="min-h-screen py-20">
      <SEO
        title="Commands"
        description="Browse all Cogworks slash commands — setup, tickets, applications, XP, starboard, bait channel, and admin tools."
        path="/commands"
      />
      <div className="container mx-auto px-4">
        {/* Header */}
        <FadeIn className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Command Reference
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse all available commands. Click on any command to see detailed
            usage information.
          </p>
        </FadeIn>

        {/* Loading / Error states */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {!isLoading && commands.length === 0 && (
          <FadeIn className="text-center py-20 max-w-md mx-auto">
            <p className="text-muted-foreground mb-2">
              We're having trouble loading commands right now.
            </p>
            <p className="text-sm text-muted-foreground">
              Please check back in a moment.
            </p>
          </FadeIn>
        )}

        {/* Search, Filters, Commands */}
        {!isLoading && commands.length > 0 && (
          <>
            <FadeIn className="max-w-4xl mx-auto mb-8">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative max-w-sm">
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
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted hover:bg-muted/80 text-muted-foreground"
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
                  <p className="text-muted-foreground">
                    No commands found matching your search.
                  </p>
                </FadeIn>
              ) : (
                <StaggerContainer key={selectedCategory} className="space-y-4">
                  {filteredCommands.map((cmd) => {
                    const subcommands =
                      "subcommandGroups" in cmd
                        ? flattenSubcommands(cmd as ApiCommand)
                        : (
                            cmd as unknown as {
                              subcommands?: {
                                name: string;
                                description: string;
                                usage: string;
                              }[];
                            }
                          ).subcommands ?? [];

                    return (
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
                          subcommands={subcommands}
                        />
                      </motion.div>
                    );
                  })}
                </StaggerContainer>
              )}
            </div>

            {/* Stats */}
            <FadeIn className="mt-12 text-center text-sm text-muted-foreground">
              Showing {filteredCommands.length} of {commands.length} commands
            </FadeIn>
          </>
        )}
      </div>
    </div>
  );
}
