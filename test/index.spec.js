import React from 'react';
import SpotifyWebPlayer from '../src'; // eslint-disable-line import/no-unresolved

describe('SpotifyWebPlayer', () => {
  let wrapper;

  beforeAll(() => {
    wrapper = mount(<SpotifyWebPlayer />);
  });

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
