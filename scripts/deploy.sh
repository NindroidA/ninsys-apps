#!/usr/bin/env bash
# ============================================
# Nindroid Systems - Deploy Script
# ============================================
#
# Pushes changes to main, triggering the
# deploy workflow via GitHub Actions.
#
# The deploy workflow auto-detects which apps
# changed and only builds/deploys those.
#
# Usage:
#   ./scripts/deploy.sh                    # Interactive — prompts for commit message
#   ./scripts/deploy.sh -m "fix: stuff"    # Non-interactive — uses provided message
#   ./scripts/deploy.sh --skip-commit      # Skip commit, just push
#   ./scripts/deploy.sh --force-all        # Force build/deploy all apps
#
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
DIM='\033[2m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}→${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}!${NC} $*"; }
fail()  { echo -e "${RED}✗${NC} $*"; exit 1; }
dim()   { echo -e "${DIM}  $*${NC}"; }

# ---- App registry ----
APPS=("cogworks" "pluginator")
APP_PATHS_cogworks="apps/cogworks/ packages/ui/"
APP_PATHS_pluginator="apps/pluginator/ packages/ui/"

# ---- Parse args ----
COMMIT_MSG=""
SKIP_COMMIT=false
FORCE_ALL=false

while [[ $# -gt 0 ]]; do
  case $1 in
    -m|--message)
      COMMIT_MSG="$2"
      shift 2
      ;;
    --skip-commit)
      SKIP_COMMIT=true
      shift
      ;;
    --force-all)
      FORCE_ALL=true
      shift
      ;;
    -h|--help)
      echo "Usage: ./scripts/deploy.sh [-m \"commit message\"] [--skip-commit] [--force-all]"
      echo ""
      echo "Options:"
      echo "  -m, --message    Commit message (skips prompt)"
      echo "  --skip-commit    Skip commit step, just push"
      echo "  --force-all      Force build and deploy all apps (bypasses change detection)"
      echo "  -h, --help       Show this help"
      exit 0
      ;;
    *)
      fail "Unknown option: $1 (use -h for help)"
      ;;
  esac
done

# ---- Preflight checks ----
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || fail "Not in a git repository"
cd "$REPO_ROOT"

CURRENT_BRANCH=$(git branch --show-current)
info "Current branch: $CURRENT_BRANCH"

# ---- Step 1: Commit (unless skipped) ----
if [ "$SKIP_COMMIT" = false ]; then
  # Check for changes
  if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    warn "No changes to commit — skipping to push"
    SKIP_COMMIT=true
  else
    echo ""
    info "Uncommitted changes:"
    git status --short
    echo ""

    # Get commit message
    if [ -z "$COMMIT_MSG" ]; then
      echo -e "${CYAN}Enter commit message (Ctrl+C to abort):${NC}"
      read -r COMMIT_MSG
      [ -z "$COMMIT_MSG" ] && fail "Empty commit message"
    fi

    # Stage and commit
    info "Staging all changes..."
    git add -A
    git commit -m "$COMMIT_MSG"
    ok "Committed: $COMMIT_MSG"
  fi
fi

# ---- Step 2: Ensure we're on main ----
if [ "$CURRENT_BRANCH" != "main" ]; then
  info "Switching to main..."
  git checkout main
  info "Merging $CURRENT_BRANCH into main..."
  git merge "$CURRENT_BRANCH" --no-edit
  ok "Merged $CURRENT_BRANCH → main"
fi

# ---- Step 3: Detect affected apps ----
echo ""
if [ "$FORCE_ALL" = true ]; then
  info "Force mode: all apps will be built and deployed"
  AFFECTED_APPS=("${APPS[@]}")
else
  # Compare against the last pushed commit
  AFFECTED_APPS=()
  for app in "${APPS[@]}"; do
    paths_var="APP_PATHS_${app}"
    changed=false
    for path in ${!paths_var}; do
      if ! git diff --quiet origin/main...HEAD -- "$path" 2>/dev/null; then
        changed=true
        break
      fi
    done
    if [ "$changed" = true ]; then
      AFFECTED_APPS+=("$app")
    fi
  done
fi

if [ ${#AFFECTED_APPS[@]} -eq 0 ]; then
  warn "No app changes detected (comparing against origin/main)"
  dim "Use --force-all to deploy anyway"
  echo ""
else
  echo -e "${CYAN}Apps that will be built & deployed:${NC}"
  for app in "${AFFECTED_APPS[@]}"; do
    echo -e "  ${GREEN}●${NC} $app"
  done
  echo ""
fi

# ---- Step 4: Push main (triggers deploy) ----
info "Pushing main..."
git push origin main
ok "Pushed main (deploy workflow triggered)"

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Deploy pipeline started!${NC}"
if [ "$FORCE_ALL" = true ]; then
  echo -e "${GREEN}  Mode:   Force all apps${NC}"
elif [ ${#AFFECTED_APPS[@]} -gt 0 ]; then
  echo -e "${GREEN}  Apps:   ${AFFECTED_APPS[*]}${NC}"
else
  echo -e "${YELLOW}  Apps:   (none detected — workflow will verify)${NC}"
fi
echo -e "${GREEN}  CI:     https://github.com/NindroidA/ninsys-apps/actions${NC}"
echo -e "${GREEN}============================================${NC}"
