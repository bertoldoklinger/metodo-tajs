import { it } from '@jest/globals'

function sum (a, b, c) {
  return a + b + c

}

it('should sum 2 and 2 and the result must be 4', () => {
  expect(sum(2, 2, 2)).toBe(6)

})