#!/usr/bin/env bash
pegjs -o pub/math/par/Ascii.com.js  src/math/par/Ascii.pegjs
sed -n -e :a -e '1,5!{P;N;D;};N;ba' pub/math/par/Ascii.com.js > pub/math/par/Ascii.non.js
cat      pub/math/par/Ascii.non.js  src/math/par/Ascii.esm.ex > pub/math/par/Ascii.esm.js
rm       pub/math/par/Ascii.non.js

