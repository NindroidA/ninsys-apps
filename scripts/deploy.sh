#!/usr/bin/env bash
# ============================================
# Nindroid Systems - Deploy Script
# ============================================
#
# Pushes current changes through the pipeline:
#   main (CI) → production (deploy)
#
# Usage:
#   ./scripts/deploy.sh                    # Interactive — prompts for commit message
#   ./scripts/deploy.sh -m "fix: stuff"    # Non-interactive — uses provided message
#   ./scripts/deploy.sh --skip-commit      # Skip commit, just merge & push
#
# ============================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}→${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${YELLOW}!${NC} $*"; }
fail()  { echo -e "${RED}✗${NC} $*"; exit 1; }

# ---- Parse args ----
COMMIT_MSG=""
SKIP_COMMIT=false

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
    -h|--help)
      echo "Usage: ./scripts/deploy.sh [-m \"commit message\"] [--skip-commit]"
      echo ""
      echo "Options:"
      echo "  -m, --message    Commit message (skips prompt)"
      echo "  --skip-commit    Skip commit step, just merge main → production and push"
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
    warn "No changes to commit — skipping to merge & push"
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
  if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "production" ]; then
    info "Merging $CURRENT_BRANCH into main..."
    git merge "$CURRENT_BRANCH" --no-edit
    ok "Merged $CURRENT_BRANCH → main"
  fi
fi

# ---- Step 3: Push main (triggers CI) ----
info "Pushing main..."
git push origin main
ok "Pushed main (CI will run)"

# ---- Step 4: Update production ----
info "Switching to production..."
git checkout production

info "Merging main into production..."
git merge main --no-edit
ok "Merged main → production"

# ---- Step 5: Push production (triggers deploy) ----
info "Pushing production..."
git push origin production
ok "Pushed production (deploy workflow triggered)"

# ---- Step 6: Return to main ----
git checkout main
echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}  Deploy pipeline started!${NC}"
echo -e "${GREEN}  CI:     https://github.com/NindroidA/ninsys-apps/actions${NC}"
echo -e "${GREEN}============================================${NC}"
