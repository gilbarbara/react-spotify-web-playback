import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

declare let window: any;

Enzyme.configure({ adapter: new Adapter() });

window.skipEventLoop = () => {
  return new Promise((resolve) => setImmediate(resolve));
};

const react = document.createElement('div');
react.id = 'react';
react.style.height = '100vh';
document.body.appendChild(react);

window.requestAnimationFrame = (callback: () => void) => {
  setTimeout(callback, 0);
};

window.matchMedia = () => ({
  addListener: () => undefined,
  matches: false,
  removeListener: () => undefined,
});
