#!/bin/bash
export ONLY_EXAMPLE=$1
node --experimental-vm-modules node_modules/jest/bin/jest.js tests/integration/convert.test.ts
