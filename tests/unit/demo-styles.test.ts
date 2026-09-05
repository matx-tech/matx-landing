import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';

const css = readFileSync(
  new URL('../../components/sections/demo/demo.module.css', import.meta.url),
  'utf8',
);
// Comments (e.g. this file's own header explaining the constraint) may
// legitimately mention ":root" or "[data-theme" in prose — only real
// selectors count as violations.
const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');

void describe('demo.module.css — always-light window (RISK: dark-theme leak)', () => {
  void test('declares no :root selector', () => {
    assert.equal(/:root\s*\{/.test(cssWithoutComments), false);
  });

  void test('declares no [data-theme] selector', () => {
    assert.equal(/\[data-theme/.test(cssWithoutComments), false);
  });

  void test('declares no prefers-color-scheme media query', () => {
    assert.equal(/prefers-color-scheme/.test(cssWithoutComments), false);
  });
});

void describe('demo.module.css — .err always terracotta, always captioned', () => {
  void test('.err rule sets a terracotta bottom border/line', () => {
    const errBlockMatch = css.match(/\.err(?:::after)?\s*\{[^}]*\}/g) ?? [];
    const errCss = errBlockMatch.join('\n');
    assert.equal(errBlockMatch.length > 0, true);
    assert.match(errCss, /var\(--terrakota\)/);
    assert.match(errCss, /(border-bottom|background)\s*:/);
  });

  void test('.caption has no visibility-hiding declaration', () => {
    const captionBlockMatch = css.match(/\.caption\s*\{[^}]*\}/g) ?? [];
    const captionCss = captionBlockMatch.join('\n');
    assert.equal(captionBlockMatch.length > 0, true);
    assert.equal(/display\s*:\s*none/.test(captionCss), false);
    assert.equal(/opacity\s*:\s*0\b/.test(captionCss), false);
    assert.equal(/visibility\s*:\s*hidden/.test(captionCss), false);
  });
});

void describe('demo.module.css — motion is transform-only and reduced-motion gated', () => {
  void test('no width/background-size/top inside @keyframes blocks', () => {
    const keyframeBlocks = css.match(/@keyframes[^{]*\{[\s\S]*?\n\}/g) ?? [];
    assert.equal(keyframeBlocks.length > 0, true);
    for (const block of keyframeBlocks) {
      assert.equal(/\bwidth\s*:/.test(block), false, `width found in ${block}`);
      assert.equal(/background-size\s*:/.test(block), false, `background-size found in ${block}`);
      assert.equal(/\btop\s*:/.test(block), false, `top found in ${block}`);
    }
  });

  void test('no width/background-size/top inside any transition or animation declaration', () => {
    const declLines = css.match(/^\s*(transition|animation)\s*:[^;]+;/gm) ?? [];
    assert.equal(declLines.length > 0, true);
    for (const line of declLines) {
      assert.equal(/\bwidth\b/.test(line), false, `width found in "${line.trim()}"`);
      assert.equal(
        /background-size/.test(line),
        false,
        `background-size found in "${line.trim()}"`,
      );
      assert.equal(/\btop\b/.test(line), false, `top found in "${line.trim()}"`);
    }
  });

  void test('every transform-moving animation/transition declaration lives inside a no-preference media query', () => {
    // Extract each `@media (prefers-reduced-motion: no-preference) { ... }`
    // block via brace matching, then confirm every transform-referencing
    // animation/transition declaration in the whole file appears inside one
    // of those blocks (i.e. none exist unguarded at the top level).
    function extractBalancedBlock(source: string, openBraceIndex: number): string {
      let depth = 0;
      for (let i = openBraceIndex; i < source.length; i += 1) {
        if (source[i] === '{') depth += 1;
        else if (source[i] === '}') {
          depth -= 1;
          if (depth === 0) return source.slice(openBraceIndex, i + 1);
        }
      }
      throw new Error('unbalanced braces in demo.module.css');
    }

    const noPreferenceSpans: Array<[number, number]> = [];
    const marker = /prefers-reduced-motion:\s*no-preference\)\s*\{/g;
    for (const m of css.matchAll(marker)) {
      const openBraceIndex = m.index + m[0].length - 1;
      const block = extractBalancedBlock(css, openBraceIndex);
      noPreferenceSpans.push([openBraceIndex, openBraceIndex + block.length]);
    }
    assert.equal(noPreferenceSpans.length > 0, true);

    const declPattern = /(transition|animation)\s*:[^;]*transform[^;]*;/g;
    const transformDecls = [...css.matchAll(declPattern)];
    assert.equal(transformDecls.length > 0, true);
    for (const decl of transformDecls) {
      const start = decl.index;
      const end = start + decl[0].length;
      const guarded = noPreferenceSpans.some(
        ([spanStart, spanEnd]) => start >= spanStart && end <= spanEnd,
      );
      assert.equal(guarded, true, `unguarded transform motion: "${decl[0]}"`);
    }
  });
});
