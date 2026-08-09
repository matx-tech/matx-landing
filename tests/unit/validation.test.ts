import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { isValidEmail } from '../../lib/validation.ts';

void describe('isValidEmail', () => {
  void test('accepts a valid email', () => {
    assert.equal(isValidEmail('mari@testkooli.ee'), true);
    assert.equal(isValidEmail('mari.tamm+regex@sub.example.org'), true);
  });

  void test('rejects empty and whitespace-only input', () => {
    assert.equal(isValidEmail(''), false);
    assert.equal(isValidEmail('   '), false);
    assert.equal(isValidEmail(undefined), false);
  });

  void test('rejects emails longer than 254 chars', () => {
    const local = 'a'.repeat(250);
    assert.equal(isValidEmail(`${local}@example.com`), false);
    assert.equal(isValidEmail(`${'a'.repeat(242)}@example.com`), true);
  });

  void test('rejects an email containing a pipe', () => {
    assert.equal(isValidEmail('mari|tamm@testkooli.ee'), false);
  });

  void test('rejects an email containing whitespace', () => {
    assert.equal(isValidEmail('mari @testkooli.ee'), false);
    assert.equal(isValidEmail('mari@ testkooli.ee'), false);
    assert.equal(isValidEmail('mari@test\nkooli.ee'), false);
  });

  void test('rejects multi-@ addresses', () => {
    assert.equal(isValidEmail('mari@tehniline@testkooli.ee'), false);
  });

  void test('rejects missing @, missing dot, and dot-only domain', () => {
    assert.equal(isValidEmail('mari.testkooli.ee'), false);
    assert.equal(isValidEmail('mari@testkooli'), false);
    assert.equal(isValidEmail('mari@testkooli.'), false);
    assert.equal(isValidEmail('@testkooli.ee'), false);
  });
});
