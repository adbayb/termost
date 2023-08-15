#!/usr/bin/env node

const { join } = require("node:path");

const pkg = require("../package.json");

require(join("../", pkg.main));
