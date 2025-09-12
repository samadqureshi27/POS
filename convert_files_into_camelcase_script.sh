#!/bin/bash

# SAFE rename script with copy-first strategy (always copy → remove → finalize)
# Path: ./src/lib/hooks

HOOKS_DIR="./src/lib/hooks"

# Check if hooks directory exists
if [ ! -d "$HOOKS_DIR" ]; then
    echo "Error: Hooks directory '$HOOKS_DIR' does not exist."
    exit 1
fi

# Function to convert filename to camelCase
to_camel_case() {
    local filename="$1"
    local extension="${filename##*.}"
    local basename="${filename%.*}"

    local camelcase=$(echo "$basename" | sed 's/[-_]\([a-zA-Z]\)/\U\1/g')
    camelcase=$(echo "$camelcase" | sed 's/^./\l&/')

    echo "${camelcase}.${extension}"
}

# Function to check if file needs conversion
needs_conversion() {
    local filename="$1"
    if [[ "$filename" =~ ^[a-z] ]] && [[ ! "$filename" =~ [_-] ]]; then
        return 1
    fi
    return 0
}

echo ""
echo "Starting safe conversion (always copy → remove → finalize)..."
echo "============================================================"

find "$HOOKS_DIR" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) | while read -r filepath; do
    filename=$(basename "$filepath")

    if ! needs_conversion "$filename"; then
        echo "✅ SKIP: '$filename' (already camelCase)"
        continue
    fi

    new_filename=$(to_camel_case "$filename")
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

    # Step 3: Rename -copy_... → final camelCase filename
    if [ -e "$new_filepath" ]; then
        echo "⚠️  WARNING: target '$new_filename' already exists!"
        echo "   Keeping both: '-copy_$new_filename' and '$new_filename'"
    else
        mv "$copy_filepath" "$new_filepath"
        echo "🔄 FINALIZED: '-copy_$new_filename' → '$new_filename'"
    fi
done

echo "============================================================"
echo "✅ Conversion completed!"
echo ""
echo "🔍 Current files:"
ls -la "$HOOKS_DIR" | grep -E '\.(js|ts|jsx|tsx)$'
