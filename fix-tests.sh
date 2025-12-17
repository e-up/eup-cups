#!/bin/bash

# Script to fix all test files after removing IppRequestOptions and parseResponse functionality

# Function to fix test files
fix_test_file() {
  local file="$1"
  echo "Fixing $file..."
  
  # Remove all parseResponse options from method calls
  sed -i 's/, {\s*parseResponse:\s*\(true\|false\)\s*}/)/g' "$file"
  sed -i 's/, {\s*parseResponse:\s*\(true\|false\)\s*}\)/)/g' "$file"
  
  # Remove empty options objects
  sed -i 's/, {\s*}\s*)/)/g' "$file"
  
  # Update assertions that check for parsed response attributes
  sed -i '/expect(.*printerAttributes.*).toBe(true)/d' "$file"
  sed -i '/expect(.*jobAttributes.*).toBe(true)/d' "$file"
  
  echo "Fixed $file"
}

# Get all test files
TEST_FILES=$(find tests -name "*.test.ts")

# Fix each test file
for file in $TEST_FILES; do
  fix_test_file "$file"
done

echo "All tests fixed successfully!"
