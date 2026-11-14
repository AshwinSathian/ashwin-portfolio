#!/usr/bin/env bash
# Builds the site's two font files from @fontsource-variable (OFL), Latin only and trimmed to what the site shows:
#   bricolage-grotesque.woff2  the one face for headings and text: weights 400-800, optical-size axis kept (small text gets sturdier letterforms)
#   jetbrains-mono.woff2       code blocks only: weight 400-600, Basic Latin plus the few signs code uses
# Output is committed in src/fonts. Needs python3 and network once (a throwaway venv with fonttools and brotli).
# Run from the repo root when the face or the character set changes, then `npm test` checks the pages still fit the set.
# Each file also gets a .codepoints.json beside it: the glyphs really in the cut (pyftsubset drops ones the face lacks).
set -euo pipefail
FONTS=node_modules/@fontsource-variable
OUT=src/fonts
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
python3 -m venv "$TMP/v"; "$TMP/v/bin/pip" install -q fonttools brotli
FT="$TMP/v/bin"

cut() { # source axis-limits unicodes features output
  "$FT/fonttools" varLib.instancer "$1" $2 -o "$TMP/n.woff2" >/dev/null
  "$FT/pyftsubset" "$TMP/n.woff2" --unicodes="$3" --layout-features="$4" --flavor=woff2 --output-file="$5"
  "$FT/python" - "$5" <<'PY'
import json, sys
from fontTools.ttLib import TTFont
f = TTFont(sys.argv[1])
json.dump(sorted(f.getBestCmap()), open(sys.argv[1].replace(".woff2", ".codepoints.json"), "w"))
PY
  ls -l "$5" | awk '{print "wrote", $9, $5, "bytes"}'
}

# Basic Latin plus the signs the site uses: © · × é ñ ü, dashes, curly quotes, bullet, ellipsis, minus. Arrows are drawn (src/components/Arrow.astro).
# Every extra accented letter costs bytes on the first paint; tests/fonts.test.mjs fails when a page needs a character that is not here, so add it then and rerun.
TEXT="U+0020-007E,U+00A0,U+00A9,U+00B7,U+00D7,U+00E9,U+00F1,U+00FC,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+2212"
cut "$FONTS/bricolage-grotesque/files/bricolage-grotesque-latin-opsz-normal.woff2" "wght=400:800" "$TEXT" "kern,mark,mkmk,ccmp,locl,tnum,pnum" "$OUT/bricolage-grotesque.woff2"
# No ligatures in code (the site sets font-variant-ligatures: none), so the liga/calt tables are dropped.
cut "$FONTS/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2" "wght=400:600" "U+0020-007E,U+00A0,U+00B7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2190,U+2192" "kern,mark,mkmk,ccmp" "$OUT/jetbrains-mono.woff2"
