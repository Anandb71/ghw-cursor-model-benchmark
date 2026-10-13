import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDuration, formatDuration } from './duration.js';

test('parseDuration - valid inputs', () => {
  assert.equal(parseDuration('1h30m'), 5400000);
  assert.equal(parseDuration('2d 4h'), 187200000);
  assert.equal(parseDuration('45s'), 45000);
  assert.equal(parseDuration('1.5h'), 5400000);
  assert.equal(parseDuration('90m'), 5400000);
  assert.equal(parseDuration('500ms'), 500);
  assert.equal(parseDuration(' 1h   30m '), 5400000);
  assert.equal(parseDuration('1.5h30m'), 5400000 + 1800000);
  assert.equal(parseDuration('0.5d'), 43200000);
  assert.equal(parseDuration('.5h'), 1800000);
});

test('parseDuration - invalid inputs', () => {
  assert.throws(() => parseDuration(123), TypeError);
  assert.throws(() => parseDuration(null), TypeError);
  assert.throws(() => parseDuration(''), RangeError);
  assert.throws(() => parseDuration('   '), RangeError);
  assert.throws(() => parseDuration('abc'), RangeError);
  assert.throws(() => parseDuration('5x'), RangeError);
  assert.throws(() => parseDuration('h1'), RangeError);
  assert.throws(() => parseDuration('1h 30x'), RangeError);
});

test('formatDuration - valid inputs', () => {
  assert.equal(formatDuration(5400000), '1h30m');
  assert.equal(formatDuration(0), '0ms');
  assert.equal(formatDuration(187200000), '2d4h');
  assert.equal(formatDuration(45000), '45s');
  assert.equal(formatDuration(500), '500ms');
  assert.equal(formatDuration(90061001), '1d1h1m1s1ms');
  assert.equal(formatDuration(0.5), '0.5ms');
  assert.equal(formatDuration(1000.5), '1s0.5ms');
});

test('formatDuration - invalid inputs', () => {
  assert.throws(() => formatDuration(-1), RangeError);
  assert.throws(() => formatDuration(Infinity), RangeError);
  assert.throws(() => formatDuration(NaN), RangeError);
  assert.throws(() => formatDuration('123'), RangeError);
});
