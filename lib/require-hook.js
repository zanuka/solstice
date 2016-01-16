#!/usr/bin/env node
"use strict";

// The advantage of a require hook is that
// you can start via normal Node.js

require("babel-register")({
    presets: ["es2015-node5"]
});

var solstice = require('./solstice');

var defaultDiv = document.createDocumentFragment();
var sols = new Solstice(defaultDiv);