export function parseDuration(str) {
  if (typeof str !== 'string') {
    throw new TypeError('Duration must be a string');
  }
  const trimmed = str.trim();
  if (trimmed === '') {
    throw new RangeError('Duration cannot be empty');
  }
  
  const regex = /^\s*(\d*\.?\d+)\s*(d|h|ms|m|s)\s*/i;
  let remaining = trimmed;
  let totalMs = 0;
  
  const multipliers = {
    d: 86400000,
    h: 3600000,
    m: 60000,
    s: 1000,
    ms: 1
  };

  while (remaining.length > 0) {
    const match = remaining.match(regex);
    if (!match) {
      throw new RangeError(`Invalid duration string: ${str}`);
    }
    const val = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    totalMs += val * multipliers[unit];
    remaining = remaining.slice(match[0].length);
  }
  
  return totalMs;
}

export function formatDuration(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) {
    throw new RangeError('Duration must be a non-negative finite number');
  }
  if (ms === 0) return '0ms';

  let remaining = ms;
  const parts = [];

  const units = [
    { unit: 'd', ms: 86400000 },
    { unit: 'h', ms: 3600000 },
    { unit: 'm', ms: 60000 },
    { unit: 's', ms: 1000 },
    { unit: 'ms', ms: 1 }
  ];

  for (let i = 0; i < units.length; i++) {
    const { unit, ms: unitMs } = units[i];
    const isLast = i === units.length - 1;
    
    if (remaining >= unitMs || (isLast && remaining > 0)) {
      let val;
      if (isLast) {
        val = remaining;
        remaining = 0;
      } else {
        val = Math.floor(remaining / unitMs);
        remaining -= val * unitMs;
      }
      
      if (val > 0) {
        parts.push(`${val}${unit}`);
      }
    }
  }

  return parts.join('');
}
