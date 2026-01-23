# Changesets

This folder is used by [Changesets](https://github.com/changesets/changesets) to manage versioning and changelogs for the Nindroid Systems monorepo.

## How to use

### Adding a changeset

When you make a change that should be documented in the changelog, run:

```bash
bun changeset
```

This will prompt you to:
1. Select which packages have changed
2. Select the type of change (major, minor, patch)
3. Write a summary of the change

### Version types

- **major**: Breaking changes
- **minor**: New features (backwards compatible)
- **patch**: Bug fixes, documentation updates

### Versioning packages

To apply all changesets and update versions:

```bash
bun version-packages
```

This will:
1. Update package.json versions
2. Update CHANGELOG.md files
3. Delete the applied changeset files

### Publishing (if needed)

```bash
bun release
```

Note: Since packages are private, this is mainly for documentation purposes.
