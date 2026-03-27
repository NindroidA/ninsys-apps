import { Badge, Button, Card, Input } from "@ninsys/ui/components";
import { FadeIn } from "@ninsys/ui/components/animations";
import { cn } from "@ninsys/ui/lib";
import { inflate } from "pako";
import {
  ChevronDown,
  ChevronUp,
  FileArchive,
  Search,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface ArchiveMetadata {
  guildId: string;
  guildName: string;
  exportDate: string;
  system: string;
  entryCount: number;
  version: string;
}

interface ArchiveEntry {
  id: number | string;
  type: string;
  createdBy?: string;
  createdAt?: string;
  closedAt?: string;
  closedBy?: string;
  typeId?: string;
  threadId?: string;
  channelId?: string;
  title?: string;
  content?: string;
  username?: string;
  action?: string;
  [key: string]: unknown;
}

interface ArchiveData {
  format: string;
  metadata: ArchiveMetadata;
  archivedTickets?: ArchiveEntry[];
  archivedApplications?: ArchiveEntry[];
  memoryItems?: ArchiveEntry[];
  announcementLogs?: ArchiveEntry[];
  auditLogs?: ArchiveEntry[];
  baitLogs?: ArchiveEntry[];
}

function getAllEntries(data: ArchiveData): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];
  const addEntries = (arr: ArchiveEntry[] | undefined, type: string) => {
    if (!arr) return;
    for (const entry of arr) {
      entries.push({ ...entry, type });
    }
  };
  addEntries(data.archivedTickets, "ticket");
  addEntries(data.archivedApplications, "application");
  addEntries(data.memoryItems, "memory");
  addEntries(data.announcementLogs, "announcement");
  addEntries(data.auditLogs, "audit");
  addEntries(data.baitLogs, "bait");
  return entries.sort((a, b) => {
    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return db - da;
  });
}

const TYPE_COLORS: Record<string, string> = {
  ticket: "bg-blue-500/15 text-blue-500 border-blue-500/20",
  application: "bg-purple-500/15 text-purple-500 border-purple-500/20",
  memory: "bg-green-500/15 text-green-500 border-green-500/20",
  announcement: "bg-amber-500/15 text-amber-500 border-amber-500/20",
  audit: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  bait: "bg-red-500/15 text-red-500 border-red-500/20",
};

function EntryCard({
  entry,
  expanded,
  onToggle,
}: {
  entry: ArchiveEntry;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card className="px-4 py-3">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center gap-3 text-left"
      >
        <Badge
          variant="outline"
          className={cn(
            "text-[10px] capitalize border",
            TYPE_COLORS[entry.type] ?? ""
          )}
        >
          {entry.type}
        </Badge>
        <span className="text-sm font-medium flex-1 truncate">
          {entry.title ?? entry.typeId ?? entry.action ?? `#${entry.id}`}
        </span>
        {entry.username && (
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {entry.username}
          </span>
        )}
        {entry.createdAt && (
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {new Date(entry.createdAt).toLocaleDateString()}
          </span>
        )}
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border text-sm space-y-1">
          {Object.entries(entry)
            .filter(([k]) => k !== "type" && k !== "id")
            .map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <span className="text-muted-foreground w-32 flex-shrink-0 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}:
                </span>
                <span className="font-mono text-xs break-all">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value ?? "—")}
                </span>
              </div>
            ))}
        </div>
      )}
    </Card>
  );
}

export function ArchiveViewerPage() {
  const [data, setData] = useState<ArchiveData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      let json: string;
      if (file.name.endsWith(".gz")) {
        const decompressed = inflate(new Uint8Array(buffer));
        json = new TextDecoder().decode(decompressed);
      } else {
        json = new TextDecoder().decode(buffer);
      }
      const parsed = JSON.parse(json) as ArchiveData;
      if (!parsed.format?.startsWith("cogworks-archive")) {
        setError("Invalid archive format. Expected a Cogworks archive file.");
        return;
      }
      setData(parsed);
    } catch (e) {
      setError(
        `Failed to read archive: ${
          e instanceof Error ? e.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const entries = useMemo(() => (data ? getAllEntries(data) : []), [data]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (typeFilter !== "all" && entry.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        const searchable = JSON.stringify(entry).toLowerCase();
        if (!searchable.includes(q)) return false;
      }
      return true;
    });
  }, [entries, typeFilter, search]);

  const entryTypes = useMemo(() => {
    const types = new Set(entries.map((e) => e.type));
    return ["all", ...types];
  }, [entries]);

  return (
    <div className="min-h-screen py-12 sm:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <FadeIn>
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 gradient-text">
              Archive Viewer
            </h1>
            <p className="text-muted-foreground">
              Upload a Cogworks archive file to view its contents. Everything
              stays in your browser.
            </p>
          </div>

          {!data ? (
            <div className="space-y-4">
              {/* Upload area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <FileArchive className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-sm font-medium mb-2">
                  Drop a{" "}
                  <code className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">
                    .cogworks-archive.json.gz
                  </code>{" "}
                  file here
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  or click to browse
                </p>
                <label>
                  <input
                    type="file"
                    accept=".gz,.json"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </span>
                  </Button>
                </label>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="ml-3 text-sm text-muted-foreground">
                    Reading archive...
                  </span>
                </div>
              )}

              {error && (
                <Card className="p-4 border-destructive/30 bg-destructive/5">
                  <p className="text-sm text-destructive">{error}</p>
                </Card>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Metadata header */}
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {data.metadata.guildName}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Exported{" "}
                      {new Date(data.metadata.exportDate).toLocaleDateString()}{" "}
                      · {data.metadata.entryCount} entries · v
                      {data.metadata.version}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setData(null);
                      setSearch("");
                      setTypeFilter("all");
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entryTypes
                    .filter((t) => t !== "all")
                    .map((t) => {
                      const count = entries.filter((e) => e.type === t).length;
                      return (
                        <Badge
                          key={t}
                          variant="outline"
                          className={cn(
                            "text-xs capitalize border",
                            TYPE_COLORS[t] ?? ""
                          )}
                        >
                          {t}: {count}
                        </Badge>
                      );
                    })}
                </div>
              </Card>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search entries..."
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {entryTypes.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors",
                        typeFilter === t
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Entry count */}
              <p className="text-xs text-muted-foreground">
                Showing {filteredEntries.length} of {entries.length} entries
              </p>

              {/* Entries */}
              <div className="space-y-2">
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border rounded-lg">
                    <p className="text-muted-foreground">
                      No entries match your filters.
                    </p>
                  </div>
                ) : (
                  filteredEntries
                    .slice(0, 100)
                    .map((entry) => (
                      <EntryCard
                        key={`${entry.type}-${entry.id}`}
                        entry={entry}
                        expanded={expandedId === `${entry.type}-${entry.id}`}
                        onToggle={() =>
                          setExpandedId(
                            expandedId === `${entry.type}-${entry.id}`
                              ? null
                              : `${entry.type}-${entry.id}`
                          )
                        }
                      />
                    ))
                )}
                {filteredEntries.length > 100 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Showing first 100 of {filteredEntries.length} entries. Use
                    filters to narrow results.
                  </p>
                )}
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
