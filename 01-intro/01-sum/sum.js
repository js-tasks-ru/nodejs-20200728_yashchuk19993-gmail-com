function sum(a, b) {
  if (typeof a !== typeof b && typeof a !== 'number') throw new TypeError('TypeError');

  return a + b;
}

module.exports = sum;
