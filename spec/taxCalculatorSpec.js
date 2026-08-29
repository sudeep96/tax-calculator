const { calculateTax } = require('../src/taxCalculator');

describe('taxCalculator.calculateTax', () => {

  it('returns 0 tax for zero income', () => {
    expect(calculateTax(0)).toBe(0);
  });

  it('returns 0 tax for income entirely below the first threshold ($5,000)', () => {
    // $5,000 is inside the $0 - $10,000 bracket, which is taxed at 0%
    expect(calculateTax(5000)).toBe(0);
  });

  it('correctly taxes income that falls in the middle bracket ($25,000)', () => {
    // $10,000 @ 0%   = 0
    // $15,000 @ 10%  = 1500   (25,000 - 10,000 = 15,000)
    expect(calculateTax(25000)).toBe(1500);
  });

  it('correctly taxes income that falls in the highest bracket ($100,000)', () => {
    // $10,000 @ 0%   = 0
    // $30,000 @ 10%  = 3000
    // $45,000 @ 20%  = 9000
    // $15,000 @ 30%  = 4500
    // total          = 16500
    expect(calculateTax(100000)).toBe(16500);
  });

  it('handles the boundary condition at exactly $40,000 (end of the second bracket)', () => {
    // $10,000 @ 0%  = 0
    // $30,000 @ 10% = 3000
    expect(calculateTax(40000)).toBe(3000);
  });

  it('throws an error for negative income instead of returning a bogus result', () => {
    expect(() => calculateTax(-500)).toThrowError('Invalid income: cannot be negative');
  });

  it('correctly taxes another valid mid-to-upper income ($60,000)', () => {
    // $10,000 @ 0%  = 0
    // $30,000 @ 10% = 3000
    // $20,000 @ 20% = 4000   (60,000 - 40,000 = 20,000)
    expect(calculateTax(60000)).toBe(7000);
  });

});
