import { useQuery } from "@tanstack/react-query";

const GITHUB_API =
  "https://api.github.com/repos/NindroidA/pluginator/releases?per_page=1";

export interface ReleaseAsset {
  name: string;
  size: number;
  browserDownloadUrl: string;
}

export interface LatestRelease {
  version: string;
  publishedAt: string;
  assets: ReleaseAsset[];
  htmlUrl: string;
}

async function fetchLatestRelease(): Promise<LatestRelease> {
  const response = await fetch(GITHUB_API, {
    headers: { Accept: "application/vnd.github.v3+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const releases = await response.json();

  if (!Array.isArray(releases) || releases.length === 0) {
    throw new Error("No releases found");
  }

  const data = releases[0];

  return {
    version: data.tag_name?.replace(/^v/, "") ?? data.name,
    publishedAt: data.published_at,
    htmlUrl: data.html_url,
    assets: (data.assets ?? []).map(
      (a: { name: string; size: number; browser_download_url: string }) => ({
        name: a.name,
        size: a.size,
        browserDownloadUrl: a.browser_download_url,
      })
    ),
  };
}

export function useLatestRelease() {
  return useQuery({
    queryKey: ["github-latest-release"],
    queryFn: fetchLatestRelease,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}
