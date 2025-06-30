#!/bin/bash
set -e # Exit immediately if a command exits with a non-zero status.

# Get the directory where the script is located to ensure it runs from the correct context.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Define the pytest command, preferring the project's virtual environment if it exists.
if [ -f "$SCRIPT_DIR/venv/bin/pytest" ]; then
    PYTEST_CMD="$SCRIPT_DIR/venv/bin/pytest"
else
    # Fallback to pytest in PATH for CI/other environments
    PYTEST_CMD="pytest"
fi

# Change to the script's directory to ensure test paths are resolved correctly.
cd "$SCRIPT_DIR"

echo "🧪 Running AI Chat Backend Tests"
echo "=================================="

# Function to run tests with coverage
run_tests_with_coverage() {
    echo "📊 Running tests with coverage..."
    $PYTEST_CMD --cov=app --cov-report=term-missing --cov-report=html
}

# Function to run tests without coverage
run_tests() {
    echo "⚡ Running tests..."
    $PYTEST_CMD
}

# Function to run specific test file
run_specific_test() {
    echo "🎯 Running specific test: $1"
    $PYTEST_CMD "$1" -v
}

# Function to run tests with verbose output
run_tests_verbose() {
    echo "🔍 Running tests with verbose output..."
    $PYTEST_CMD -v -s
}

# Check command line arguments
case "$1" in
    "coverage")
        run_tests_with_coverage
        ;;
    "verbose")
        run_tests_verbose
        ;;
    "file")
        if [ -z "$2" ]; then
            echo "❌ Please specify a test file: ./run_tests.sh file tests/test_chat.py"
            exit 1
        fi
        run_specific_test "$2"
        ;;
    "help"|"-h"|"--help")
        echo "Usage: ./run_tests.sh [option]"
        echo ""
        echo "Options:"
        echo "  (no args)   - Run tests normally"
        echo "  coverage    - Run tests with coverage report"
        echo "  verbose     - Run tests with verbose output"
        echo "  file <path> - Run a specific test file or directory"
        echo "  help        - Show this help message"
        ;;
    *)
        run_tests
        ;;
esac

echo ""
echo "✅ Tests completed!" 