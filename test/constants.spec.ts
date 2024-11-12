import { ERROR_TYPE, SPOTIFY_CONTENT_TYPE, STATUS, TRANSPARENT_COLOR, TYPE } from '~/constants';

describe('ERROR_TYPE', () => {
  it('should have all options', () => {
    expect(ERROR_TYPE).toMatchSnapshot();
  });
});

describe('SPOTIFY_CONTENT_TYPE', () => {
  it('should have all options', () => {
    expect(SPOTIFY_CONTENT_TYPE).toMatchSnapshot();
  });
});

describe('STATUS', () => {
  it('should have all options', () => {
    expect(STATUS).toMatchSnapshot();
  });
});

describe('TRANSPARENT_COLOR', () => {
  it('should have all options', () => {
    expect(TRANSPARENT_COLOR).toBe('rgba(0, 0, 0, 0)');
  });
});

describe('TYPE', () => {
  it('should have all options', () => {
    expect(TYPE).toMatchSnapshot();
  });
});
