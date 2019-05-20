import Enzyme, { shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.shallow = shallow;
global.mount = mount;
global.render = render;
global.skipEventLoop = () => {
  return new Promise(resolve => setImmediate(resolve));
};

const react = document.createElement('div');
react.id = 'react';
react.style.height = '100vh';
document.body.appendChild(react);

window.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

window.matchMedia = () => ({
  addListener: () => undefined,
  matches: false,
  removeListener: () => undefined,
});
