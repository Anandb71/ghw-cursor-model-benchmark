import assert from 'node:assert/strict';
import { test } from 'node:test';
import { formatDuration, parseDuration } from './duration.js';

const DAY = 86_400_000;
const HOUR = 3_600_000;
const MINUTE = 60_000;
const SECOND = 1_000;

test('parseDuration converts common duration strings to milliseconds', () => {
  assert.equal(parseDuration('1h30m'), HOUR + 30 * MINUTE);
  assert.equal(parseDuration('2d 4h'), 2 * DAY + 4 * HOUR);
  assert.equal(parseDuration('45s'), 45 * SECOND);
  assert.equal(parseDuration('1.5h'), 1.5 * HOUR);
  assert.equal(parseDuration('90m'), 90 * MINUTE);
  assert.equal(parseDuration('500ms'), 500);
});

test('parseDuration allows whitespace between parts and sums any order', () => {
  assert.equal(parseDuration('  2d   4h  '), 2 * DAY + 4 * HOUR);
  assert.equal(parseDuration('30m1h'), HOUR + 30 * MINUTE);
  assert.equal(parseDuration('1d2h3m4s5ms'), DAY + 2 * HOUR + 3 * MINUTE + 4 * SECOND + 5);
  assert.equal(parseDuration('1.5h2.5m'), 1.5 * HOUR + 2.5 * MINUTE);
});

test('parseDuration throws TypeError for non-strings', () => {
  for (const value of [123, 1.5, null, undefined, true, {}, [], Symbol('1h')]) {
    assert.throws(() => parseDuration(value), TypeError);
  }
});

test('parseDuration throws RangeError for empty or invalid input', () => {
  for (const value of ['', '   ', 'abc', '5x', 'h1', '1', '1h30', '1 h', '1H', '1.5.2h', '-1h']) {
    assert.throws(() => parseDuration(value), RangeError);
  }
});

test('formatDuration returns a compact string, largest units first, skipping zeros', () => {
  assert.equal(formatDuration(5_400_000), '1h30m');
  assert.equal(formatDuration(0), '0ms');
  assert.equal(formatDuration(500), '500ms');
  assert.equal(formatDuration(45 * SECOND), '45s');
  assert.equal(formatDuration(2 * DAY + 4 * HOUR), '2d4h');
  assert.equal(formatDuration(DAY + 2 * HOUR + 3 * MINUTE + 4 * SECOND + 5), '1d2h3m4s5ms');
  assert.equal(formatDuration(HOUR + SECOND), '1h1s');
});

test('formatDuration throws RangeError for negative or non-finite numbers', () => {
  for (const value of [-1, -0.5, NaN, Infinity, -Infinity, '1h', null, undefined]) {
    assert.throws(() => formatDuration(value), RangeError);
  }
});

test('formatDuration and parseDuration round-trip compact values', () => {
  for (const ms of [0, 1, 500, 1000, 1500, 5_400_000, 2 * DAY + 4 * HOUR]) {
    assert.equal(parseDuration(formatDuration(ms)), ms);
  }
  assert.equal(formatDuration(parseDuration('1.5h')), '1h30m');
  assert.equal(formatDuration(1.5), '1.5ms');
});
