#!/usr/bin/env bash
# cleanup.sh – safe project size reduction
# -------------------------------------------------
# 1. Prepare backup directory
mkdir -p cleanup-backup

# 2. Remove obvious temporary/metadata files
find . -type f \( -name '._*' -o -name '*~' -o -name '.DS_Store' \) -exec echo "Removing temp file:" {} \; -exec rm -f {} +

# 3. Remove build/cache artifacts that are safe to delete
rm -rf .next .vercelignore debug.log tsconfig.tsbuildinfo
rm -rf .orchids 2>/dev/null || true

# 4. Deduplicate files (excluding source, public images, node_modules, .git)
#    For each hash, keep the first occurrence (lexicographically) and move others to backup
find . -type f \! -path "./node_modules/*" \! -path "./public/images/*" \! -path "./.git/*" \! -path "./cleanup-backup/*" -exec md5sum {} + |
  sort | awk 'BEGIN{prev=""} {if($1==prev){print $2} else {prev=$1}}' |
  while IFS= read -r dup; do
    # Keep the first (lexicographically smallest) file, move others
    # Find all files with this hash
    files=$(find . -type f -exec md5sum {} + | grep "^$(basename "$dup")" | cut -d' ' -f3-)
    # Sort and keep the first
    first=$(echo "$files" | sort | head -n1)
    echo "Duplicate hash detected – keeping $first, moving others to backup"
    echo "$files" | grep -v "^$first$" | while IFS= read -r f; do
      mkdir -p "cleanup-backup$(dirname "$f")"
      mv "$f" "cleanup-backup/$f"
    done
  done

# 5. Remove any duplicate empty directories left behind
find . -type d -empty -delete

echo "Cleanup complete. Backup of removed files is in ./cleanup-backup"
