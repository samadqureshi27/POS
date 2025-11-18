#!/bin/bash

# Script to remove console.log, console.info, and console.debug statements
# Keeps console.error and console.warn for production error tracking

echo "Removing console.log, console.info, and console.debug statements..."

# Find all TypeScript and TSX files in src directory
find src -type f \( -name "*.ts" -o -name "*.tsx" \) | while read file; do
  # Check if file contains console.log, console.info, or console.debug
  if grep -q "console\.\(log\|info\|debug\)" "$file"; then
    echo "Processing: $file"

    # Remove console.log, console.info, console.debug statements
    # This handles single-line statements
    sed -i '/^\s*console\.\(log\|info\|debug\)(.*/d' "$file"

    # Remove inline console statements (more aggressive)
    sed -i 's/console\.\(log\|info\|debug\)([^)]*);*//g' "$file"
  fi
done

echo "Done! Please review the changes before committing."
