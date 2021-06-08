import { Transformer } from 'ts-transformer-testing-library';
import tipiTransformer from '../src/transfomer';

const transformer = new Transformer()
  .addTransformer(tipiTransformer);

it('Should work', () => {
  const source = `let foo = 'bar'`;
  expect(transformer.transform(source).trim())
    .toEqual(source);
})
