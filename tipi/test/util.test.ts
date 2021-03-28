import { extractPathVariableNames } from '../src/util';

describe('extractPathVariableNames', () => {
  it('Should extract all variables', () => {
    expect(extractPathVariableNames('@foo/@bar')).toStrictEqual(['foo', 'bar']);
    expect(extractPathVariableNames('/@foo/@bar')).toStrictEqual(['foo', 'bar']);
    expect(extractPathVariableNames('/@foo/@bar/')).toStrictEqual(['foo', 'bar']);
    expect(extractPathVariableNames('/foo/bar')).toStrictEqual([]);
    expect(extractPathVariableNames('/@foo@bar')).toStrictEqual(['foo@bar']);
  });
});
