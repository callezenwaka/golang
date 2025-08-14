#!/bin/bash

# --- Function to display usage information ---
usage() {
    echo "Usage: $0 [up|down|down-to 0]"
    echo "  up        : Apply all pending migrations."
    echo "  down      : Revert the last applied migration."
    echo "  down-to 0 : Revert all migrations."
    exit 1
}

# --- Validate the provided argument ---
if [ -z "$1" ]; then
    echo "❌ Error: No argument provided."
    usage
fi

ACTION="$1"

# Check for valid actions
case "$ACTION" in
    "up"|"down")
        # Valid actions
        ;;
    "down-to")
        # Ensure 'down-to' is followed by '0'
        if [ "$2" != "0" ]; then
            echo "❌ Error: 'down-to' must be followed by '0'."
            usage
        fi
        ACTION="$ACTION $2" # Combine "down-to 0" into a single action string
        shift # Shift once more to consume the '0'
        ;;
    *)
        echo "❌ Error: Invalid action '$ACTION'."
        usage
        ;;
esac

# --- Load environment variables from .env file ---
# This handles comments and empty lines in the .env file more gracefully
if [ -f .env ]; then
    echo "Loading environment variables from .env..."
    while IFS='=' read -r key value; do
        if [[ ! "$key" =~ ^# && -n "$key" ]]; then # Ignore comments and empty lines
            export "$key=$value"
        fi
    done < .env
else
    echo "⚠️ Warning: .env file not found. Ensure DATABASE_URL is set in your environment."
fi

# --- Check if DATABASE_URL is set after loading ---
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL environment variable is not set. Please check your .env file or environment."
    exit 1
fi

# --- Modify DATABASE_URL to remove sslmode parameter ---
MODIFIED_DATABASE_URL="${DATABASE_URL%%\?*}"

# --- Run goose migrations ---
echo "Running database migrations with action: $ACTION..."
goose -dir ./sql/schema postgres "$MODIFIED_DATABASE_URL" "$ACTION"

# --- Check goose command exit status ---
if [ $? -eq 0 ]; then
    echo "✅ Database migrations applied successfully for action '$ACTION'!"
else
    echo "❌ Error applying database migrations for action '$ACTION'."
    exit 1
fi