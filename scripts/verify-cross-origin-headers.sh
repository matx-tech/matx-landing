#!/usr/bin/env bash
# Verify the cross-origin resource + security header policy on a deployed
# matx.ee instance.
#
# Policy under test (enforced at three layers — Next.js next.config.js
# headers(), Caddy header_down overrides, Cloudflare response-header
# transform rules; see Caddyfile and docs/security-hardening-plan.md):
#
#   HTML document (200/404)  -> COOP: same-origin, COEP: same-origin,
#                               CORP: same-origin   (strict isolation)
#   static asset   (200/404) -> CORP: cross-origin, ACAO: *, no COEP/COOP
#                               (embeddable + CORS-readable from any origin)
#   405 API error            -> isolation headers   (error-state consistency)
#
# Usage:  scripts/verify-cross-origin-headers.sh [base-url]
#         (default base-url: https://matx.ee)
# Exit 0 when every check passes; non-zero (with a FAIL line per broken
# check) otherwise.
#
# CI/CD: run against the live site after a deploy — see the
# `verify-live-headers` job in .github/workflows/ci.yml, or invoke from the
# VPS deploy script before cutover. Requires only curl + grep.

set -uo pipefail

BASE_URL="${1:-https://matx.ee}"
FAILED=0

# fetch_headers <url...> -> temporary file with response headers (lowercased)
headers_file="$(mktemp)"
fetch_headers() {
  curl -sS -D - -o /dev/null "$@" >"$headers_file"
  sed -i 's/^\([A-Za-z-]*\):/\L\1:/' "$headers_file"
}

# header_val <name> -> value of first occurrence (case-insensitive), or ''
header_val() {
  grep -i "^$1:" "$headers_file" | head -1 | tr -d '\r' | cut -d' ' -f2-
}

# expect_value <desc> <header> <expected-value|absent>
expect_value() {
  local desc="$1" name="$2" want="$3"
  local val
  val="$(header_val "$name")"
  if [ "$want" = "absent" ]; then
    if [ -z "$val" ]; then
      echo "PASS  $desc — no $name header"
    else
      echo "FAIL  $desc — $name: $val (expected absent)"
      FAILED=1
    fi
  elif [ "$val" = "$want" ]; then
    echo "PASS  $desc — $name: $val"
  else
    echo "FAIL  $desc — $name: '${val:-<missing>}' (expected $want)"
    FAILED=1
  fi
}

isolation='same-origin'
cross_origin='cross-origin'

# ── 1. HTML document 200 ─────────────────────────────────────────────
fetch_headers -H 'Accept: text/html' "$BASE_URL/"
expect_value 'HTML / (200)' cross-origin-opener-policy "$isolation"
expect_value 'HTML / (200)' cross-origin-embedder-policy "$isolation"
expect_value 'HTML / (200)' cross-origin-resource-policy "$isolation"

# ── 2. HTML document 404 (error-state isolation) ─────────────────────
fetch_headers -H 'Accept: text/html' "$BASE_URL/nonexistent-page-$RANDOM"
expect_value 'HTML 404 page' cross-origin-opener-policy "$isolation"
expect_value 'HTML 404 page' cross-origin-embedder-policy "$isolation"
expect_value 'HTML 404 page' cross-origin-resource-policy "$isolation"

# ── 3. Static asset 200 (discover a real content-hashed font) ────────
asset="$(curl -sS "$BASE_URL/" | grep -oE '/_next/static/media/[a-zA-Z0-9._-]+\.woff2' | head -1)"
if [ -n "$asset" ]; then
  fetch_headers "$BASE_URL$asset"
  expect_value "asset 200 $asset" cross-origin-resource-policy "$cross_origin"
  expect_value "asset 200 $asset" access-control-allow-origin '*'
  expect_value "asset 200 $asset" cross-origin-embedder-policy absent
  expect_value "asset 200 $asset" cross-origin-opener-policy absent
else
  echo "SKIP  asset 200 — no woff2 asset discoverable in HTML"
fi

# ── 4. Static asset 404 (error-state cross-origin headers) ───────────
fetch_headers "$BASE_URL/missing-asset-$RANDOM.png"
expect_value 'asset 404 .png' cross-origin-resource-policy "$cross_origin"
expect_value 'asset 404 .png' access-control-allow-origin '*'
expect_value 'asset 404 .png' cross-origin-embedder-policy absent
expect_value 'asset 404 .png' cross-origin-opener-policy absent

# ── 5. og:image route (extension-less generated public image) ────────
fetch_headers "$BASE_URL/opengraph-image?cb=$RANDOM"
expect_value 'opengraph-image (200)' cross-origin-resource-policy "$cross_origin"
expect_value 'opengraph-image (200)' access-control-allow-origin '*'
expect_value 'opengraph-image (200)' cross-origin-embedder-policy absent
expect_value 'opengraph-image (200)' cross-origin-opener-policy absent

# ── 6. 405 API error (non-asset error state keeps isolation) ─────────
fetch_headers "$BASE_URL/api/registration"
expect_value 'api 405 (GET /api/registration)' cross-origin-opener-policy "$isolation"
expect_value 'api 405 (GET /api/registration)' cross-origin-embedder-policy "$isolation"
expect_value 'api 405 (GET /api/registration)' cross-origin-resource-policy "$isolation"

rm -f "$headers_file"

if [ "$FAILED" -eq 0 ]; then
  echo
  echo "ALL CHECKS PASSED — cross-origin header policy verified on $BASE_URL"
else
  echo
  echo "CROSS-ORIGIN HEADER POLICY VIOLATIONS on $BASE_URL" >&2
fi
exit "$FAILED"
