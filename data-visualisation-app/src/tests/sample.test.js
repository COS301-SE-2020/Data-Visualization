const asum = require('../helpers/sample');

test('adding 1 to 2 is then 3', () => {
    expect(asum(1, 2)).toBe(3);
});