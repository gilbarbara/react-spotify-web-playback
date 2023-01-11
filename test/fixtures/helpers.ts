export const domRect = {
  slider: {
    bottom: 50,
    height: 6,
    left: 0,
    right: 0,
    top: 0,
    width: 1024,
  },
  volume: {
    bottom: 50,
    height: 50,
    left: 900,
    right: 0,
    top: 0,
    width: 6,
  },
};

export function setBoundingClientRect(type: 'slider' | 'volume') {
  // @ts-ignore
  Element.prototype.getBoundingClientRect = () => domRect[type];
}
