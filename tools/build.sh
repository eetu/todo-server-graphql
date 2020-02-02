#!/bin/bash

# Exit bash if any command fails
set -e

# Install with dev dependencies, build service, purge dev dependencies
npm install --only=dev
npm run build
npm prune --production
