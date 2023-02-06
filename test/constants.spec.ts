import { STATUS, TYPE } from '../src';

describe('STATUS', () => {
  it('should have all options', () => {
    expect(STATUS).toMatchSnapshot();
  });
});

describe('TYPE', () => {
  it('should have all options', () => {
    expect(TYPE).toMatchSnapshot();
  });
});
