#!/usr/bin/env sh
# Build and serve the built `dist` folder using npx serve.
# Requires Node (npm/npx) installed locally.
set -e

echo "Building the app..."
npm run build

echo "Serving from ./dist on http://localhost:5000 (use Ctrl-C to stop)"
npx serve dist -l 5000
