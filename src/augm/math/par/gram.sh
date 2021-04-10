#!/usr/bin/env bash
pegjs -o pub/augm/math/par/Ascii.com.js  src/augm/math/par/Ascii.pegjs
sed -n -e :a -e '1,5!{P;N;D;};N;ba'      pub/augm/math/par/Ascii.com.js > pub/augm/math/par/Ascii.non.js
cat      pub/augm/math/par/Ascii.non.js  src/augm/math/par/Ascii.esm.ex > pub/augm/math/par/Ascii.esm.js
rm       pub/augm/math/par/Ascii.non.js

