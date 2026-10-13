const UNITS = [
  ['d', 86_400_000],
  ['h', 3_600_000],
  ['m', 60_000],
  ['s', 1_000],
  ['ms', 1],
];

const UNIT_MS = Object.fromEntries(UNITS);

// `ms` must be tried before a single `m` or `s`.
const TOKEN = /(\d+(?:\.\d+)?)(ms|[dhms])/y;

/**
 * Parse a compact duration string into milliseconds.
 * Units: d, h, m, s, ms. Whitespace is allowed between parts.
 * @param {string} str
 * @returns {number}
 */
export function parseDuration(str) {
  if (typeof str !== 'string') {
    throw new TypeError('duration must be a string');
  }

  const input = str.trim();
  if (input.length === 0) {
    throw new RangeError('duration must not be empty');
  }

  let total = 0;
  let index = 0;

  while (index < input.length) {
    TOKEN.lastIndex = index;
    const match = TOKEN.exec(input);
    if (!match) {
      throw new RangeError(`invalid duration: ${str}`);
    }

    total += Number(match[1]) * UNIT_MS[match[2]];
    index = TOKEN.lastIndex;

    while (index < input.length && /\s/.test(input[index])) {
      index += 1;
    }
  }

  if (!Number.isFinite(total)) {
    throw new RangeError(`invalid duration: ${str}`);
  }

  return total;
}

/**
 * Format milliseconds as a compact duration (d/h/m/s/ms), largest unit first.
 * Zero parts are omitted. Zero itself is "0ms".
 * @param {number} ms
 * @returns {string}
 */
export function formatDuration(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) {
    throw new RangeError('duration must be a non-negative finite number');
  }

  if (ms === 0) {
    return '0ms';
  }

  let remaining = ms;
  let result = '';

  for (let i = 0; i < UNITS.length - 1; i += 1) {
    const [label, size] = UNITS[i];
    const qty = Math.floor(remaining / size);
    if (qty > 0) {
      result += `${qty}${label}`;
      remaining -= qty * size;
    }
  }

  if (remaining > 0) {
    result += `${formatNumber(remaining)}ms`;
  }

  return result;
}

function formatNumber(n) {
  if (Number.isInteger(n)) {
    return String(n);
  }
  return n.toFixed(9).replace(/0+$/, '').replace(/\.$/, '');
}
