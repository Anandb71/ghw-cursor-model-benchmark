/**
 * Parse a duration string into milliseconds.
 * @param {string} str - Duration string like "1h30m", "2d 4h", "45s", "1.5h", "90m", "500ms"
 * @returns {number} Total milliseconds
 * @throws {TypeError} If input is not a string
 * @throws {RangeError} If input is empty or invalid
 */
export function parseDuration(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Duration must be a string');
  }

  const trimmed = str.trim();
  if (trimmed === '') {
    throw new RangeError('Duration string cannot be empty');
  }

  const units = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  // Match complete duration strings - must contain only valid duration parts
  // The regex matches one or more duration components separated by optional whitespace
  const fullPattern = /^(\d+(?:\.\d+)?)\s*(ms|[dhms])(?:\s*(\d+(?:\.\d+)?)\s*(ms|[dhms]))*$/;
  
  if (!fullPattern.test(trimmed)) {
    throw new RangeError('Invalid duration format');
  }

  // Now extract all the individual components
  const regex = /(\d+(?:\.\d+)?)\s*(ms|[dhms])/g;
  
  let totalMs = 0;
  let match;

  while ((match = regex.exec(trimmed)) !== null) {
    const value = parseFloat(match[1]);
    const unit = match[2];
    totalMs += value * units[unit];
  }

  return totalMs;
}

/**
 * Format milliseconds into a compact duration string.
 * @param {number} ms - Milliseconds to format
 * @returns {string} Formatted duration like "1h30m", "2d4h30m", "0ms"
 * @throws {RangeError} If input is negative or non-finite
 */
export function formatDuration(ms) {
  if (typeof ms !== 'number' || !isFinite(ms)) {
    throw new RangeError('Duration must be a finite number');
  }

  if (ms < 0) {
    throw new RangeError('Duration cannot be negative');
  }

  if (ms === 0) {
    return '0ms';
  }

  const units = [
    { unit: 'd', value: 24 * 60 * 60 * 1000 },
    { unit: 'h', value: 60 * 60 * 1000 },
    { unit: 'm', value: 60 * 1000 },
    { unit: 's', value: 1000 },
    { unit: 'ms', value: 1 }
  ];

  let remaining = ms;
  const parts = [];

  for (const { unit, value } of units) {
    if (remaining >= value) {
      const count = Math.floor(remaining / value);
      parts.push(`${count}${unit}`);
      remaining -= count * value;
    }
  }

  return parts.join('');
}
