#!/usr/bin/env bash
pegjs -o ../par/Ascii.com.js ../par/Ascii.pegjs
cat      ../par/Ascii.com.js Ascii.esm > ../../../pub/math/par/Ascii.esm.js
