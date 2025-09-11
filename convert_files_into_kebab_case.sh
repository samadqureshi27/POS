#!/bin/bash

# SAFE rename script with copy-first strategy for src (excluding hooks)
# Converts file names to kebab-case
# Path: ./src

SRC_DIR="./src"
EXCLUDE_DIR="./src/lib/hooks"

# Check if src directory exists
if [ ! -d "$SRC_DIR" ]; then
    echo "Error: Source directory '$SRC_DIR' does not exist."
    exit 1
fi

# Function to convert filename to kebab-case
to_kebab_case() {
    local filename="$1"
    local extension="${filename##*.}"
    local basename="${filename%.*}"

    # Replace underscores with dashes
    local kebab=$(echo "$basename" | sed 's/_/-/g')

    # Insert dash before capitals, then lowercase everything
    kebab=$(echo "$kebab" | sed 's/\([a-z0-9]\)\([A-Z]\)/\1-\L\2/g')

    # Lowercase entire string
    kebab=$(echo "$kebab" | tr '[:upper:]' '[:lower:]')

    echo "${kebab}.${extension}"
}

# Function to check if file needs conversion
needs_conversion() {
    local filename="$1"
    # If already lowercase with optional dashes, skip
    if [[ "$filename" =~ ^[a-z0-9.-]+$ ]] && [[ ! "$filename" =~ [_] ]]; then
        return 1
    fi
    return 0
}

echo ""
echo "Starting safe conversion in src (to kebab-case, excluding hooks)..."
echo "==================================================================="

# Find all target files excluding the hooks directory
find "$SRC_DIR" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) \
     ! -path "$EXCLUDE_DIR/*" | while read -r filepath; do
    
    filename=$(basename "$filepath")

    if ! needs_conversion "$filename"; then
        echo "✅ SKIP: '$filename' (already kebab-case)"
        continue
    fi

    new_filename=$(to_kebab_case "$filename")
    new_filepath="$(dirname "$filepath")/$new_filename"
    copy_filepath="$(dirname "$filepath")/-copy_$new_filename"

    if [ "$filename" = "$new_filename" ]; then
        echo "➡️  NO CHANGE: '$filename'"
        continue
    fi

    # Step 1: Always create copy first
    cp "$filepath" "$copy_filepath"
    echo "📑 COPY CREATED: '$filename' → '-copy_$new_filename'"

    # Step 2: Remove original (safe, since copy exists)
    rm "$filepath"
    echo "🗑️  REMOVED ORIGINAL: '$filename'"

    # Step 3: Rename -copy_... → final kebab-case filename
    if [ -e "$new_filepath" ]; then
        echo "⚠️  WARNING: target '$new_filename' already exists!"
        echo "   Keeping both: '-copy_$new_filename' and '$new_filename'"
    else
        mv "$copy_filepath" "$new_filepath"
        echo "🔄 FINALIZED: '-copy_$new_filename' → '$new_filename'"
    fi
done

echo "==================================================================="
echo "✅ Conversion completed!"
echo ""
echo "🔍 Current files in src (excluding hooks):"
find "$SRC_DIR" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) \
     ! -path "$EXCLUDE_DIR/*"
