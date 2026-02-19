import { CodeBlock, DocsLayout, FilePathDisplay } from "@/components/docs";
import { Badge, Card } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import {
	AlertTriangle,
	Check,
	ChevronDown,
	ChevronRight,
	Copy,
	Database,
	FileJson,
	Folder,
	FolderOpen,
	Key,
	Palette,
	Server,
} from "lucide-react";
import { useState } from "react";

// JSON code examples
const DIRECTORY_STRUCTURE = `~/.pluginator/
├── config.json          # Main configuration
├── custom-registry.json # Add your own plugins
├── custom-sources.json  # Configure API keys & custom sources
├── servers/             # Server-specific data (auto-managed)
├── backups/             # Backup storage
├── cache/               # Cache files (auto-managed)
└── logs/                # Log files`;

const CONFIG_MINIMAL = `{
  "PROD_SERVER_PATH": "/home/minecraft/production/plugins",
  "TEST_SERVER_PATH": "/home/minecraft/test/plugins"
}`;

const CONFIG_FULL = `{
  "MINECRAFT_VERSION": "1.20.4",
  "SERVER_TYPE": "paper",
  "PROD_SERVER_PATH": "/home/minecraft/production/plugins",
  "TEST_SERVER_PATH": "/home/minecraft/test/plugins",
  "MAX_BACKUPS": 10,
  "THEME": "ocean",
  "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
}`;

const CUSTOM_REGISTRY_EXAMPLE = `{
  "version": "1.0",
  "plugins": [
    {
      "id": "my-custom-plugin",
      "name": "My Custom Plugin",
      "description": "A private plugin I maintain",
      "category": "utility",
      "sources": [
        {
          "type": "github",
          "identifier": "myorg/my-plugin"
        }
      ]
    },
    {
      "id": "private-economy",
      "name": "Private Economy Plugin",
      "description": "Custom economy for my server",
      "category": "economy",
      "sources": [
        {
          "type": "jenkins",
          "identifier": "economy-plugin",
          "baseUrl": "https://ci.myserver.com"
        }
      ]
    }
  ]
}`;

const SOURCE_GITHUB = `{
  "type": "github",
  "identifier": "owner/repository"
}`;

const SOURCE_SPIGOT = `{
  "type": "spigot",
  "identifier": "12345"
}`;

const SOURCE_MODRINTH = `{
  "type": "modrinth",
  "identifier": "project-slug"
}`;

const SOURCE_HANGAR = `{
  "type": "hangar",
  "identifier": "Author/ProjectName"
}`;

const SOURCE_CURSEFORGE = `{
  "type": "curseforge",
  "identifier": "12345"
}`;

const SOURCE_JENKINS = `{
  "type": "jenkins",
  "identifier": "job-name",
  "baseUrl": "https://ci.example.com"
}`;

const SOURCE_WEB = `{
  "type": "web",
  "identifier": "https://example.com/plugin-manifest.json"
}`;

const CUSTOM_SOURCES_EXAMPLE = `{
  "version": "1.0",
  "overrides": {
    "curseforge": {
      "apiKey": "$cf_xxxxxxxx"
    },
    "github": {
      "token": "ghp_xxxxxxxxxxxx"
    }
  },
  "custom": [
    {
      "id": "private-jenkins",
      "type": "jenkins",
      "baseUrl": "https://builds.myserver.com",
      "auth": {
        "username": "ci-user",
        "apiToken": "xxxxxxxx"
      }
    }
  ],
  "disabled": ["curseforge", "hangar"]
}`;

const THEME_EXAMPLE = `{
  "THEME": "ocean"
}`;

// Schema table data
const CONFIG_SCHEMA = [
	{
		field: "PLUGINATOR_DEBUG",
		type: "number",
		default: "0",
		description: "Debug level (0=off, 1=basic, 2=verbose)",
	},
	{
		field: "MINECRAFT_VERSION",
		type: "string",
		default: '"1.21"',
		description: "Target Minecraft version for compatibility",
	},
	{
		field: "SERVER_TYPE",
		type: "string",
		default: '"paper"',
		description: "Server software (paper, spigot, purpur, etc.)",
	},
	{
		field: "PROD_SERVER_PATH",
		type: "string",
		default: '""',
		description: "Path to production server's plugins folder",
	},
	{
		field: "TEST_SERVER_PATH",
		type: "string",
		default: '""',
		description: "Path to test server's plugins folder",
	},
	{
		field: "BACKUP_DIR",
		type: "string",
		default: '"~/.pluginator/backups"',
		description: "Where to store backups",
	},
	{
		field: "MAX_BACKUPS",
		type: "number",
		default: "5",
		description: "Maximum backups to keep per server",
	},
	{
		field: "THEME",
		type: "string",
		default: '"default"',
		description: "UI theme (default, ocean, forest, sunset)",
	},
	{
		field: "AUTO_UPDATE_CHECK",
		type: "boolean",
		default: "true",
		description: "Automatically check for plugin updates",
	},
	{
		field: "UPDATE_CHECK_INTERVAL",
		type: "number",
		default: "21600",
		description: "Seconds between auto-checks (default 6 hours)",
	},
	{
		field: "CURSEFORGE_API_KEY",
		type: "string",
		default: '""',
		description: "API key for CurseForge (optional)",
	},
	{
		field: "GITHUB_TOKEN",
		type: "string",
		default: '""',
		description: "GitHub token for higher rate limits (optional)",
	},
];

const THEMES = [
	{ name: "default", description: "Dark theme with blue accents", colors: ["#1e1e2e", "#89b4fa"] },
	{ name: "ocean", description: "Blue and teal color scheme", colors: ["#0d1b2a", "#00b4d8"] },
	{ name: "forest", description: "Green color scheme", colors: ["#1a2f1a", "#4caf50"] },
	{ name: "sunset", description: "Warm orange color scheme", colors: ["#2d1f1f", "#ff7043"] },
];

interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = false }: CollapsibleSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="border border-border rounded-lg overflow-hidden">
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors text-left"
			>
				<span className="font-medium">{title}</span>
				{isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
			</button>
			{isOpen && <div className="p-4 border-t border-border">{children}</div>}
		</div>
	);
}

interface SourceTabProps {
	active: string;
	onSelect: (tab: string) => void;
}

const SOURCE_TABS = [
	{ id: "github", label: "GitHub" },
	{ id: "spigot", label: "Spigot" },
	{ id: "modrinth", label: "Modrinth" },
	{ id: "hangar", label: "Hangar" },
	{ id: "curseforge", label: "CurseForge" },
	{ id: "jenkins", label: "Jenkins" },
	{ id: "web", label: "Web" },
];

function SourceTabs({ active, onSelect }: SourceTabProps) {
	return (
		<div className="flex flex-wrap gap-2 mb-4">
			{SOURCE_TABS.map((tab) => (
				<button
					type="button"
					key={tab.id}
					onClick={() => onSelect(tab.id)}
					className={cn(
						"px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
						active === tab.id
							? "bg-primary text-primary-foreground"
							: "bg-muted hover:bg-muted/80 text-muted-foreground",
					)}
				>
					{tab.label}
				</button>
			))}
		</div>
	);
}

function SourceContent({ sourceType }: { sourceType: string }) {
	const sources: Record<string, { code: string; hint: string }> = {
		github: {
			code: SOURCE_GITHUB,
			hint: 'The identifier is the repository path from the GitHub URL. Example: For https://github.com/EssentialsX/Essentials, use "EssentialsX/Essentials"',
		},
		spigot: {
			code: SOURCE_SPIGOT,
			hint: 'The identifier is the resource ID from the SpigotMC URL. Example: For spigotmc.org/resources/vault.34315/, use "34315"',
		},
		modrinth: {
			code: SOURCE_MODRINTH,
			hint: 'The identifier is the project slug from Modrinth. Example: For modrinth.com/plugin/lithium, use "lithium"',
		},
		hangar: {
			code: SOURCE_HANGAR,
			hint: 'The identifier is the Author/ProjectName from Hangar. Example: For hangar.papermc.io/essentialsx/Essentials, use "essentialsx/Essentials"',
		},
		curseforge: {
			code: SOURCE_CURSEFORGE,
			hint: "The identifier is the project ID from CurseForge. Requires an API key in custom-sources.json.",
		},
		jenkins: {
			code: SOURCE_JENKINS,
			hint: "For Jenkins CI builds. Specify the job name and the base URL of your Jenkins server.",
		},
		web: {
			code: SOURCE_WEB,
			hint: "For self-hosted plugins with a web manifest. The identifier is the full URL to the manifest JSON.",
		},
	};

	const source = sources[sourceType];

	if (!source) {
		return <div className="text-muted-foreground">Select a source type above.</div>;
	}

	return (
		<div className="space-y-3">
			<CodeBlock code={source.code} filename={`${sourceType}-source.json`} />
			<p className="text-sm text-muted-foreground">{source.hint}</p>
		</div>
	);
}

export function UserFilesPage() {
	const [activeSource, setActiveSource] = useState("github");
	const [copiedTheme, setCopiedTheme] = useState<string | null>(null);

	const handleCopyTheme = (themeName: string) => {
		navigator.clipboard.writeText(themeName);
		setCopiedTheme(themeName);
		setTimeout(() => setCopiedTheme(null), 2000);
	};

	return (
		<DocsLayout
			title="Configuration Files"
			description="Learn how to customize Pluginator with user-editable configuration files"
		>
			<div className="space-y-12">
				{/* Quick Links */}
				<FadeIn>
					<Card className="p-4">
						<h3 className="font-medium mb-3">Quick Links</h3>
						<div className="flex flex-wrap gap-2">
							<a href="#overview" className="text-sm text-primary hover:underline">
								Overview
							</a>
							<span className="text-border">|</span>
							<a href="#config" className="text-sm text-primary hover:underline">
								Main Configuration
							</a>
							<span className="text-border">|</span>
							<a href="#registry" className="text-sm text-primary hover:underline">
								Custom Plugin Registry
							</a>
							<span className="text-border">|</span>
							<a href="#sources" className="text-sm text-primary hover:underline">
								Custom Sources
							</a>
							<span className="text-border">|</span>
							<a href="#themes" className="text-sm text-primary hover:underline">
								Themes
							</a>
							<span className="text-border">|</span>
							<a href="#tips" className="text-sm text-primary hover:underline">
								Tips
							</a>
						</div>
					</Card>
				</FadeIn>

				{/* Section 1: Overview */}
				<FadeIn>
					<section id="overview">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<FolderOpen className="h-5 w-5 text-primary" />
							</div>
							<h2 className="text-2xl font-semibold">Overview</h2>
						</div>

						<p className="text-muted-foreground mb-6">
							Pluginator stores all user data in{" "}
							<code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">
								~/.pluginator/
							</code>
							. These files override bundled defaults, allowing you to customize behavior without
							modifying the installation.
						</p>

						<CodeBlock
							code={DIRECTORY_STRUCTURE}
							language="text"
							filename="Directory Structure"
							showLineNumbers
						/>

						<div className="mt-6 p-4 rounded-lg border border-border bg-muted/30">
							<h4 className="font-medium mb-2 flex items-center gap-2">
								<Folder className="h-4 w-4 text-primary" />
								User Files vs Bundled Files
							</h4>
							<p className="text-sm text-muted-foreground mb-2">
								Pluginator ships with default configurations in its installation directory. Your
								user files in{" "}
								<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">
									~/.pluginator/
								</code>{" "}
								override these defaults. If you delete a user file, Pluginator reverts to the
								bundled default.
							</p>
							<p className="text-sm text-muted-foreground">
								On startup, Pluginator automatically regenerates any missing user files from
								bundled defaults. This means you can safely delete files to reset them — they'll
								be recreated the next time Pluginator runs.
							</p>
						</div>
					</section>
				</FadeIn>

				{/* Section 2: Main Configuration */}
				<FadeIn>
					<section id="config">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<FileJson className="h-5 w-5 text-primary" />
							</div>
							<h2 className="text-2xl font-semibold">Main Configuration</h2>
						</div>

						<p className="text-muted-foreground mb-4">
							The main configuration file controls Pluginator's core behavior, including server
							paths, update checking, and API credentials.
						</p>

						<FilePathDisplay
							path="~/.pluginator/config.json"
							platformHint="Windows: %USERPROFILE%\.pluginator\config.json"
							className="mb-6"
						/>

						{/* Schema Table */}
						<div className="overflow-x-auto mb-6">
							<table className="w-full border-collapse border border-border rounded-lg overflow-hidden">
								<thead className="bg-muted">
									<tr>
										<th className="text-left p-3 font-semibold text-sm">Option</th>
										<th className="text-left p-3 font-semibold text-sm">Type</th>
										<th className="text-left p-3 font-semibold text-sm">Default</th>
										<th className="text-left p-3 font-semibold text-sm">Description</th>
									</tr>
								</thead>
								<tbody>
									{CONFIG_SCHEMA.map((row, i) => (
										<tr
											key={row.field}
											className={cn(
												"border-t border-border",
												i % 2 === 0 ? "bg-background" : "bg-muted/30",
											)}
										>
											<td className="p-3 font-mono text-sm text-primary">{row.field}</td>
											<td className="p-3">
												<Badge variant="secondary" className="text-xs">
													{row.type}
												</Badge>
											</td>
											<td className="p-3 font-mono text-sm text-muted-foreground">{row.default}</td>
											<td className="p-3 text-sm">{row.description}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* Examples */}
						<div className="space-y-4">
							<CollapsibleSection title="Minimal Configuration (just paths)" defaultOpen>
								<CodeBlock code={CONFIG_MINIMAL} filename="config.json" showLineNumbers />
							</CollapsibleSection>

							<CollapsibleSection title="Full Configuration Example">
								<CodeBlock code={CONFIG_FULL} filename="config.json" showLineNumbers />
							</CollapsibleSection>
						</div>
					</section>
				</FadeIn>

				{/* Section 3: Custom Plugin Registry */}
				<FadeIn>
					<section id="registry">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<Database className="h-5 w-5 text-primary" />
							</div>
							<h2 className="text-2xl font-semibold">Custom Plugin Registry</h2>
						</div>

						<p className="text-muted-foreground mb-4">
							Add plugins that aren't in Pluginator's curated registry. This is useful for private
							plugins, forks, or plugins from less common sources.
						</p>

						<FilePathDisplay
							path="~/.pluginator/custom-registry.json"
							platformHint="Windows: %USERPROFILE%\.pluginator\custom-registry.json"
							className="mb-6"
						/>

						{/* Source Types */}
						<h3 className="text-lg font-medium mb-4">Source Types</h3>
						<SourceTabs active={activeSource} onSelect={setActiveSource} />
						<SourceContent sourceType={activeSource} />

						{/* Full Example */}
						<div className="mt-6">
							<CollapsibleSection title="Complete Custom Registry Example">
								<CodeBlock
									code={CUSTOM_REGISTRY_EXAMPLE}
									filename="custom-registry.json"
									showLineNumbers
								/>
							</CollapsibleSection>
						</div>
					</section>
				</FadeIn>

				{/* Section 4: Custom Sources */}
				<FadeIn>
					<section id="sources">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<Server className="h-5 w-5 text-primary" />
							</div>
							<h2 className="text-2xl font-semibold">Custom Sources</h2>
						</div>

						<p className="text-muted-foreground mb-4">
							Override default source configurations, add API keys, or configure custom source
							instances like private Jenkins servers.
						</p>

						<FilePathDisplay
							path="~/.pluginator/custom-sources.json"
							platformHint="Windows: %USERPROFILE%\.pluginator\custom-sources.json"
							className="mb-6"
						/>

						{/* Security Warning */}
						<div className="mb-6 rounded-lg bg-gradient-to-br from-yellow-500/25 via-amber-500/25 to-orange-500/25 backdrop-blur-sm border border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.2)]">
							<div className="rounded-lg p-4">
								<div className="flex items-start gap-3">
									<AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
									<div>
										<h4 className="font-medium text-yellow-500 mb-1">Security Note</h4>
										<p className="text-sm text-muted-foreground">
											Never share config files containing API keys or tokens. Add{" "}
											<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">
												custom-sources.json
											</code>{" "}
											to your{" "}
											<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">
												.gitignore
											</code>{" "}
											if using version control.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-medium">Configuration Sections</h3>

							<div className="grid gap-4">
								<Card className="p-4">
									<div className="flex items-center gap-2 mb-2">
										<Key className="h-4 w-4 text-primary" />
										<h4 className="font-medium">overrides</h4>
									</div>
									<p className="text-sm text-muted-foreground mb-3">
										Override settings for built-in sources, such as adding API keys.
									</p>
									<CodeBlock
										code={`{
  "overrides": {
    "curseforge": { "apiKey": "$cf_xxxxxxxx" },
    "github": { "token": "ghp_xxxxxxxxxxxx" }
  }
}`}
										filename="API keys example"
									/>
								</Card>

								<Card className="p-4">
									<div className="flex items-center gap-2 mb-2">
										<Server className="h-4 w-4 text-primary" />
										<h4 className="font-medium">custom</h4>
									</div>
									<p className="text-sm text-muted-foreground mb-3">
										Add additional source instances, such as a private Jenkins server.
									</p>
									<CodeBlock
										code={`{
  "custom": [
    {
      "id": "private-jenkins",
      "type": "jenkins",
      "baseUrl": "https://builds.myserver.com"
    }
  ]
}`}
										filename="Custom source example"
									/>
								</Card>

								<Card className="p-4">
									<h4 className="font-medium mb-2">disabled</h4>
									<p className="text-sm text-muted-foreground mb-3">
										Disable sources you don't want to use.
									</p>
									<CodeBlock
										code={`{
  "disabled": ["curseforge", "hangar"]
}`}
										filename="Disabled sources example"
									/>
								</Card>
							</div>

							<CollapsibleSection title="Complete Custom Sources Example">
								<CodeBlock
									code={CUSTOM_SOURCES_EXAMPLE}
									filename="custom-sources.json"
									showLineNumbers
								/>
							</CollapsibleSection>
						</div>
					</section>
				</FadeIn>

				{/* Section 5: Themes */}
				<FadeIn>
					<section id="themes">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<Palette className="h-5 w-5 text-primary" />
							</div>
							<h2 className="text-2xl font-semibold">Themes</h2>
						</div>

						<p className="text-muted-foreground mb-6">
							Pluginator includes four built-in themes. Set your preferred theme in{" "}
							<code className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono">config.json</code>.
						</p>

						<div className="grid sm:grid-cols-2 gap-4 mb-6">
							{THEMES.map((theme) => (
								<button
									key={theme.name}
									type="button"
									onClick={() => handleCopyTheme(theme.name)}
									className="text-left cursor-pointer"
								>
									<Card className="p-4 hover:border-primary/50 transition-colors">
										<div className="flex items-center gap-3">
											<div
												className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
												style={{
													background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
												}}
											/>
											<div className="flex-1 min-w-0">
												<h4 className="font-medium font-mono">{theme.name}</h4>
												<p className="text-sm text-muted-foreground">{theme.description}</p>
											</div>
											<div className="shrink-0">
												{copiedTheme === theme.name ? (
													<Check className="h-4 w-4 text-green-500" />
												) : (
													<Copy className="h-4 w-4 text-muted-foreground" />
												)}
											</div>
										</div>
									</Card>
								</button>
							))}
						</div>
						<p className="text-xs text-muted-foreground mb-4">
							Click a theme to copy its name to clipboard.
						</p>

						<CodeBlock code={THEME_EXAMPLE} filename="Set theme in config.json" />

						<p className="text-sm text-muted-foreground mt-4">
							Note: Custom themes are no longer supported as of v1.15.0. Use bundled presets only.
						</p>
					</section>
				</FadeIn>

				{/* Section 6: Tips */}
				<FadeIn>
					<section id="tips">
						<div className="flex items-center gap-3 mb-4">
							<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
								<AlertTriangle className="h-5 w-5 text-primary" />
							</div>
							<h2 className="text-2xl font-semibold">Tips & Troubleshooting</h2>
						</div>

						<div className="space-y-4">
							<Card className="p-4">
								<h4 className="font-medium mb-2">JSON Syntax</h4>
								<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
									<li>All files must be valid JSON</li>
									<li>Use double quotes for strings</li>
									<li>No trailing commas allowed</li>
									<li>Comments are NOT allowed in JSON</li>
								</ul>
							</Card>

							<Card className="p-4">
								<h4 className="font-medium mb-2">Path Formats</h4>
								<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
									<li>Use absolute paths for server directories</li>
									<li>
										<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">~</code>{" "}
										expands to your home directory
									</li>
									<li>
										Forward slashes (
										<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">/</code>) work
										on all platforms
									</li>
								</ul>
							</Card>

							<Card className="p-4">
								<h4 className="font-medium mb-2">API Keys</h4>
								<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
									<li>CurseForge requires an API key for downloads</li>
									<li>GitHub token increases rate limits from 60 to 5000/hour</li>
									<li>Never commit files with API keys to version control</li>
								</ul>
							</Card>

							<Card className="p-4">
								<h4 className="font-medium mb-2">Validation & Errors</h4>
								<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
									<li>Pluginator validates config files on startup</li>
									<li>Invalid files fall back to defaults</li>
									<li>
										Check logs in{" "}
										<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">
											~/.pluginator/logs/
										</code>{" "}
										for validation errors
									</li>
									<li>
										Use{" "}
										<a
											href="https://jsonlint.com"
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary hover:underline"
										>
											jsonlint.com
										</a>{" "}
										to validate your JSON
									</li>
								</ul>
							</Card>

							<Card className="p-4">
								<h4 className="font-medium mb-2">Reset to Defaults</h4>
								<p className="text-sm text-muted-foreground">
									To reset a configuration to defaults, simply delete the file from{" "}
									<code className="px-1 py-0.5 rounded bg-muted text-xs font-mono">
										~/.pluginator/
									</code>
									. Pluginator will use the bundled default on the next run.
								</p>
							</Card>
						</div>
					</section>
				</FadeIn>
			</div>
		</DocsLayout>
	);
}
