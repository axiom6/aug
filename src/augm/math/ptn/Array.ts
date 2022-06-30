
import { match, P } from 'ts-pattern';

type Input =
  | [number, '+', number]
  | [number, '-', number]
  | [number, '*', number]
  | ['-', number];

const input: Input = [3, '*', 4];

// @ts-ignore
// @ts-ignore
const output = match(input)
  .with([P._, '+', P._], ([x, , y]) => x + y)
  .with([P._, '-', P._], ([x, , y]) => x - y)
  .with([P._, '*', P._], ([x, , y]) => x * y)
  .with(['-', P._], ([, x]) => -x)
  .otherwise(() => NaN);

console.log(output);