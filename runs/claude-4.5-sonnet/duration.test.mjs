import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseDuration, formatDuration } from './duration.js';

describe('parseDuration', () => {
  it('should parse single units', () => {
    assert.strictEqual(parseDuration('500ms'), 500);
    assert.strictEqual(parseDuration('45s'), 45000);
    assert.strictEqual(parseDuration('90m'), 90 * 60 * 1000);
    assert.strictEqual(parseDuration('2h'), 2 * 60 * 60 * 1000);
    assert.strictEqual(parseDuration('3d'), 3 * 24 * 60 * 60 * 1000);
  });

  it('should parse decimal values', () => {
    assert.strictEqual(parseDuration('1.5h'), 1.5 * 60 * 60 * 1000);
    assert.strictEqual(parseDuration('2.5m'), 2.5 * 60 * 1000);
    assert.strictEqual(parseDuration('0.5s'), 500);
  });

  it('should parse compound durations', () => {
    assert.strictEqual(parseDuration('1h30m'), 90 * 60 * 1000);
    assert.strictEqual(parseDuration('2d 4h'), (2 * 24 + 4) * 60 * 60 * 1000);
    assert.strictEqual(parseDuration('1h 30m 45s'), (60 * 60 + 30 * 60 + 45) * 1000);
  });

  it('should handle various whitespace', () => {
    assert.strictEqual(parseDuration('1h 30m'), 90 * 60 * 1000);
    assert.strictEqual(parseDuration('  2h  '), 2 * 60 * 60 * 1000);
    assert.strictEqual(parseDuration('1d  4h   30m'), (24 + 4) * 60 * 60 * 1000 + 30 * 60 * 1000);
  });

  it('should throw TypeError for non-strings', () => {
    assert.throws(() => parseDuration(123), TypeError);
    assert.throws(() => parseDuration(null), TypeError);
    assert.throws(() => parseDuration(undefined), TypeError);
    assert.throws(() => parseDuration({}), TypeError);
  });

  it('should throw RangeError for empty strings', () => {
    assert.throws(() => parseDuration(''), RangeError);
    assert.throws(() => parseDuration('   '), RangeError);
  });

  it('should throw RangeError for invalid formats', () => {
    assert.throws(() => parseDuration('abc'), RangeError);
    assert.throws(() => parseDuration('5x'), RangeError);
    assert.throws(() => parseDuration('h1'), RangeError);
    assert.throws(() => parseDuration('1h invalid'), RangeError);
    assert.throws(() => parseDuration('hello 2m'), RangeError);
  });
});

describe('formatDuration', () => {
  it('should format zero', () => {
    assert.strictEqual(formatDuration(0), '0ms');
  });

  it('should format single units', () => {
    assert.strictEqual(formatDuration(500), '500ms');
    assert.strictEqual(formatDuration(45000), '45s');
    assert.strictEqual(formatDuration(90 * 60 * 1000), '1h30m');
    assert.strictEqual(formatDuration(2 * 60 * 60 * 1000), '2h');
    assert.strictEqual(formatDuration(3 * 24 * 60 * 60 * 1000), '3d');
  });

  it('should format compound durations', () => {
    assert.strictEqual(formatDuration(5400000), '1h30m');
    assert.strictEqual(formatDuration((2 * 24 + 4) * 60 * 60 * 1000), '2d4h');
    assert.strictEqual(formatDuration((60 * 60 + 30 * 60 + 45) * 1000), '1h30m45s');
  });

  it('should skip zero parts', () => {
    assert.strictEqual(formatDuration(24 * 60 * 60 * 1000 + 500), '1d500ms');
    assert.strictEqual(formatDuration(60 * 60 * 1000 + 1000), '1h1s');
  });

  it('should throw RangeError for negative numbers', () => {
    assert.throws(() => formatDuration(-1), RangeError);
    assert.throws(() => formatDuration(-1000), RangeError);
  });

  it('should throw RangeError for non-finite numbers', () => {
    assert.throws(() => formatDuration(Infinity), RangeError);
    assert.throws(() => formatDuration(-Infinity), RangeError);
    assert.throws(() => formatDuration(NaN), RangeError);
  });
});

describe('round-trip', () => {
  it('should parse and format consistently', () => {
    const durations = ['1h30m', '2d4h', '45s', '500ms', '1h30m45s'];
    
    for (const duration of durations) {
      const ms = parseDuration(duration);
      const formatted = formatDuration(ms);
      const reparsed = parseDuration(formatted);
      assert.strictEqual(ms, reparsed, `Round-trip failed for ${duration}`);
    }
  });
});
