var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// src/index.tsx
import React22, { createRef, PureComponent } from "react";
import isEqual from "@gilbarbara/deep-equal";
import memoize from "memoize-one";

// src/components/Actions.tsx
import React8 from "react";

// src/components/Devices.tsx
import React3, { useState } from "react";

// src/components/ClickOutside.tsx
import React, { useCallback, useEffect, useRef } from "react";
function ClickOutside({ children, onClick, ...rest }) {
  const containerRef = useRef(null);
  const isTouchRef = useRef(false);
  const handleClick = useCallback(
    (event) => {
      if (event.type === "touchend") {
        isTouchRef.current = true;
      }
      if (event.type === "click" && isTouchRef.current) {
        return;
      }
      const el = containerRef.current;
      if (el && !el.contains(event.target)) {
        onClick();
      }
    },
    [onClick]
  );
  useEffect(() => {
    document.addEventListener("touchend", handleClick, true);
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("touchend", handleClick, true);
      document.removeEventListener("click", handleClick, true);
    };
  });
  return /* @__PURE__ */ React.createElement("div", { ...rest, ref: containerRef }, children);
}

// src/components/icons/Devices.tsx
import React2 from "react";
function DevicesIcon(props) {
  return /* @__PURE__ */ React2.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React2.createElement(
    "path",
    {
      d: "M6.765 89.483h40.412v6.765H6.269C2.765 96.248 0 93.483 0 89.978V20.703c0-3.504 2.765-6.27 6.27-6.27h40.907v6.766H6.765v68.285zm16.327 20.702a3.4 3.4 0 0 1 3.383-3.383h20.702v6.765H26.475c-.915 0-1.72-.347-2.344-1.038a3.064 3.064 0 0 1-1.039-2.344zm46.681-95.752h51.958c3.504 0 6.269 2.765 6.269 6.269v86.596c0 3.504-2.765 6.27-6.27 6.27H69.774c-3.504 0-6.27-2.766-6.27-6.27V20.702c0-3.504 2.766-6.27 6.27-6.27zm-.496 5.842l.07 87.52 52.88-.07-.07-87.45h-52.88zm13.89 45.573c3.464-3.462 7.714-5.23 12.585-5.23 9.827 0 17.815 7.988 17.815 17.815 0 9.827-7.988 17.815-17.815 17.815-9.827 0-17.815-7.988-17.815-17.815 0-4.87 1.768-9.122 5.23-12.585zm4.124 21.045c2.381 2.381 5.195 3.582 8.46 3.582 6.598 0 12.043-5.445 12.043-12.042 0-6.597-5.445-12.043-12.042-12.043-6.597 0-12.042 5.446-12.042 12.043 0 3.266 1.2 6.08 3.581 8.46zm12.935-44.466c-1.247 1.247-2.741 1.863-4.474 1.863-3.504 0-6.27-2.765-6.27-6.269s2.766-6.27 6.27-6.27c3.504 0 6.27 2.766 6.27 6.27 0 1.72-.608 3.218-1.796 4.406z",
      fill: "currentColor"
    }
  ));
}

// src/styles.tsx
import { createElement } from "react";
import { create } from "nano-css";
import { addon as addonJSX } from "nano-css/addon/jsx.js";
import { addon as addonKeyframes } from "nano-css/addon/keyframes.js";
import { addon as addonNesting } from "nano-css/addon/nesting.js";
import { addon as addonRule } from "nano-css/addon/rule.js";
import { addon as addonStyle } from "nano-css/addon/style.js";
import { addon as addonStyled } from "nano-css/addon/styled.js";
var nano = create({ h: createElement });
addonRule(nano);
addonKeyframes(nano);
addonJSX(nano);
addonStyle(nano);
addonStyled(nano);
addonNesting(nano);
var { keyframes, put, styled } = nano;
var px = (value) => typeof value === "number" ? `${value}px` : value;
function getMergedStyles(styles) {
  return {
    activeColor: "#1cb954",
    altColor: "#ccc",
    bgColor: "#fff",
    color: "#333",
    errorColor: "#a60000",
    height: 48,
    loaderColor: "#ccc",
    loaderSize: 32,
    sliderColor: "#666",
    sliderHandleBorderRadius: "50%",
    sliderHandleColor: "#000",
    sliderHeight: 4,
    sliderTrackBorderRadius: 0,
    sliderTrackColor: "#ccc",
    trackArtistColor: "#666",
    trackNameColor: "#333",
    ...styles
  };
}

// src/components/Devices.tsx
var Wrapper = styled("div")(
  {
    "pointer-events": "all",
    position: "relative",
    zIndex: 20,
    "> div": {
      display: "flex",
      flexDirection: "column",
      padding: px(8),
      position: "absolute",
      right: `-${px(3)}`,
      button: {
        display: "block",
        padding: px(8),
        whiteSpace: "nowrap",
        "&.rswp__devices__active": {
          fontWeight: "bold"
        }
      }
    },
    "> button": {
      fontSize: px(26)
    }
  },
  ({ style }) => ({
    "> button": {
      color: style.c
    },
    "> div": {
      backgroundColor: style.bgColor,
      boxShadow: style.altColor ? `1px 1px 10px ${style.altColor}` : "none",
      [style.p]: "120%",
      button: {
        color: style.c
      }
    }
  }),
  "DevicesRSWP"
);
function Devices(props) {
  const {
    currentDeviceId,
    deviceId,
    devices,
    onClickDevice,
    open,
    playerPosition,
    styles: { activeColor, altColor, bgColor, color },
    title
  } = props;
  const [isOpen, setOpen] = useState(open);
  const handleClickSetDevice = (event) => {
    const { dataset } = event.currentTarget;
    if (dataset.id) {
      onClickDevice(dataset.id);
      setOpen(false);
    }
  };
  const handleClickToggleDevices = () => {
    setOpen((s) => !s);
  };
  return /* @__PURE__ */ React3.createElement(
    Wrapper,
    {
      "data-component-name": "Devices",
      "data-device-id": currentDeviceId,
      style: {
        altColor,
        bgColor,
        c: currentDeviceId && deviceId && currentDeviceId !== deviceId ? activeColor : color,
        p: playerPosition
      }
    },
    !!devices.length && /* @__PURE__ */ React3.createElement(React3.Fragment, null, isOpen && /* @__PURE__ */ React3.createElement(ClickOutside, { onClick: handleClickToggleDevices }, devices.map((d) => /* @__PURE__ */ React3.createElement(
      "button",
      {
        key: d.id,
        "aria-label": d.name,
        className: d.id === currentDeviceId ? "rswp__devices__active" : void 0,
        "data-id": d.id,
        onClick: handleClickSetDevice,
        type: "button"
      },
      d.name
    ))), /* @__PURE__ */ React3.createElement("button", { "aria-label": title, onClick: handleClickToggleDevices, title, type: "button" }, /* @__PURE__ */ React3.createElement(DevicesIcon, null)))
  );
}

// src/components/Volume.tsx
import React7, { useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";
import pkg from "react-use";
import RangeSlider from "@gilbarbara/react-range-slider";

// src/components/icons/VolumeHigh.tsx
import React4 from "react";
function VolumeHigh(props) {
  return /* @__PURE__ */ React4.createElement(
    "svg",
    {
      "data-component-name": "VolumeHigh",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 128 128",
      width: "1em",
      ...props
    },
    /* @__PURE__ */ React4.createElement(
      "path",
      {
        d: "M0 85.869V40.38h21.24l39.41-22.743v90.974L21.24 85.87H0zm53.069 9.627V30.754L23.285 47.963H7.581v30.324h15.704L53.07 95.496zM92.355 18.86l4.889-5.723c13.772 12.64 21.94 30.407 21.94 49.724 0 19.318-8.168 37.085-21.94 49.725l-4.89-5.724c12.104-11.208 19.318-26.89 19.318-44 0-17.112-7.214-32.793-19.317-44.002zM75.303 38.835l4.889-5.724c5.246 5.008 9.062 11.209 11.149 18.542a41.69 41.69 0 0 1 1.55 11.21c0 11.506-4.77 22.12-12.7 29.75l-4.888-5.723c6.26-6.26 10.076-14.786 10.076-24.028 0-9.241-3.697-17.767-10.076-24.027z",
        fill: "currentColor"
      }
    )
  );
}

// src/components/icons/VolumeLow.tsx
import React5 from "react";
function VolumeLow(props) {
  return /* @__PURE__ */ React5.createElement(
    "svg",
    {
      "data-component-name": "VolumeLow",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 128 128",
      width: "1em",
      ...props
    },
    /* @__PURE__ */ React5.createElement(
      "path",
      {
        d: "M0 85.606V40.12h21.24l39.41-22.744v90.975L21.24 85.606H0zm53.069 9.627V30.492L23.285 47.7H7.581v30.325h15.704L53.07 95.233zm22.234-56.66l4.889-5.725c5.246 5.009 9.062 11.21 11.149 18.543a41.69 41.69 0 0 1 1.55 11.209c0 11.507-4.77 22.12-12.7 29.751l-4.888-5.724c6.26-6.26 10.076-14.786 10.076-24.027 0-9.242-3.697-17.768-10.076-24.028z",
        fill: "currentColor"
      }
    )
  );
}

// src/components/icons/VolumeMute.tsx
import React6 from "react";
function VolumeMute(props) {
  return /* @__PURE__ */ React6.createElement(
    "svg",
    {
      "data-component-name": "VolumeMute",
      height: "1em",
      preserveAspectRatio: "xMidYMid",
      viewBox: "0 0 128 128",
      width: "1em",
      ...props
    },
    /* @__PURE__ */ React6.createElement(
      "path",
      {
        d: "M127.993 83.387l-5.278 5.279-20.53-20.559L81.62 88.672l-5.233-5.292 20.55-20.522L76.38 42.3l5.248-5.248 20.557 20.558 20.522-20.551L128 42.293l-20.565 20.565 20.558 20.53zM0 85.607V40.118h21.24l39.41-22.744v90.975L21.24 85.606H0zm53.069 9.626V30.492L23.285 47.7H7.581v30.325h15.704L53.07 95.233z",
        fill: "currentColor"
      }
    )
  );
}

// src/components/Volume.tsx
var { usePrevious } = pkg;
var Wrapper2 = styled("div")(
  {
    "pointer-events": "all",
    position: "relative",
    zIndex: 20,
    "> div": {
      display: "flex",
      flexDirection: "column",
      padding: px(12),
      position: "absolute",
      right: `-${px(3)}`
    },
    "> button": {
      fontSize: px(26)
    },
    "@media (max-width: 1023px)": {
      display: "none"
    }
  },
  ({ style }) => ({
    "> button": {
      color: style.c
    },
    "> div": {
      backgroundColor: style.bgColor,
      boxShadow: style.altColor ? `1px 1px 10px ${style.altColor}` : "none",
      [style.p]: "120%"
    }
  }),
  "VolumeRSWP"
);
function Volume(props) {
  const {
    playerPosition,
    setVolume: setVolume2,
    styles: { altColor, bgColor, color },
    title,
    volume
  } = props;
  const [isOpen, setIsOpen] = useState2(false);
  const [volumeState, setVolumeState] = useState2(volume);
  const timeoutRef = useRef2();
  const previousVolume = usePrevious(volume);
  useEffect2(() => {
    if (previousVolume !== volume && volume !== volumeState) {
      setVolumeState(volume);
    }
  }, [previousVolume, volume, volumeState]);
  const handleClick = () => {
    setIsOpen((s) => !s);
  };
  const handleChangeSlider = ({ y }) => {
    const currentvolume = Math.round(y) / 100;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setVolume2(currentvolume);
    }, 250);
    setVolumeState(currentvolume);
  };
  const handleAfterEnd = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };
  let icon = /* @__PURE__ */ React7.createElement(VolumeHigh, null);
  if (volume === 0) {
    icon = /* @__PURE__ */ React7.createElement(VolumeMute, null);
  } else if (volume <= 0.5) {
    icon = /* @__PURE__ */ React7.createElement(VolumeLow, null);
  }
  return /* @__PURE__ */ React7.createElement(
    Wrapper2,
    {
      "data-component-name": "Volume",
      "data-value": volume,
      style: { altColor, bgColor, c: color, p: playerPosition }
    },
    isOpen && /* @__PURE__ */ React7.createElement(ClickOutside, { onClick: handleClick }, /* @__PURE__ */ React7.createElement(
      RangeSlider,
      {
        axis: "y",
        className: "volume",
        onAfterEnd: handleAfterEnd,
        onChange: handleChangeSlider,
        styles: {
          options: {
            thumbBorder: `2px solid ${color}`,
            thumbBorderRadius: 12,
            thumbColor: bgColor,
            thumbSize: 12,
            padding: 0,
            rangeColor: altColor || "#ccc",
            trackColor: color,
            width: 6
          }
        },
        y: volume * 100,
        yMax: 100,
        yMin: 0
      }
    )),
    /* @__PURE__ */ React7.createElement(
      "button",
      {
        "aria-label": title,
        onClick: !isOpen ? handleClick : void 0,
        title,
        type: "button"
      },
      icon
    )
  );
}

// src/components/Actions.tsx
var Wrapper3 = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: px(10),
    "pointer-events": "none",
    "> div + div": {
      marginLeft: px(10)
    },
    "@media (max-width: 1023px)": {
      bottom: 0,
      position: "absolute",
      right: 0,
      width: "auto"
    }
  },
  ({ style }) => ({
    height: px(style.h)
  }),
  "ActionsRSWP"
);
function Actions(props) {
  const {
    currentDeviceId,
    deviceId,
    devices,
    isDevicesOpen,
    locale,
    onClickDevice,
    playerPosition,
    setVolume: setVolume2,
    styles,
    volume
  } = props;
  return /* @__PURE__ */ React8.createElement(Wrapper3, { "data-component-name": "Actions", style: { h: styles.height } }, currentDeviceId && /* @__PURE__ */ React8.createElement(
    Volume,
    {
      playerPosition,
      setVolume: setVolume2,
      styles,
      title: locale.volume,
      volume
    }
  ), /* @__PURE__ */ React8.createElement(
    Devices,
    {
      currentDeviceId,
      deviceId,
      devices,
      onClickDevice,
      open: isDevicesOpen,
      playerPosition,
      styles,
      title: locale.devices
    }
  ));
}

// src/components/Content.tsx
import React9 from "react";
var Wrapper4 = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    "> *": {
      width: "100%",
      "@media (min-width: 1024px)": {
        width: "33.3333%"
      }
    },
    "@media (min-width: 1024px)": {
      flexDirection: "row"
    }
  },
  ({ style }) => ({
    minHeight: px(style.h)
  }),
  "ContentRSWP"
);
function Content({ children, styles }) {
  return /* @__PURE__ */ React9.createElement(Wrapper4, { "data-component-name": "Content", style: { h: styles.height } }, children);
}

// src/components/Controls.tsx
import React14 from "react";

// src/components/icons/Next.tsx
import React10 from "react";
function Next(props) {
  return /* @__PURE__ */ React10.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React10.createElement(
    "path",
    {
      d: "M98.91 53.749L5.817 0v128L98.91 74.251v47.93h23.273V5.819H98.909z",
      fill: "currentColor"
    }
  ));
}

// src/components/icons/Pause.tsx
import React11 from "react";
function Pause(props) {
  return /* @__PURE__ */ React11.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React11.createElement("path", { d: "M41.86 128V0H8.648v128h33.21zm77.491 0V0h-33.21v128h33.21z", fill: "currentColor" }));
}

// src/components/icons/Play.tsx
import React12 from "react";
function Play(props) {
  return /* @__PURE__ */ React12.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React12.createElement("path", { d: "M119.351 64L8.65 0v128z", fill: "currentColor" }));
}

// src/components/icons/Previous.tsx
import React13 from "react";
function Previous(props) {
  return /* @__PURE__ */ React13.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React13.createElement("path", { d: "M29.09 53.749V5.819H5.819v116.363h23.273v-47.93L122.18 128V0z", fill: "currentColor" }));
}

// src/components/Controls.tsx
var Wrapper5 = styled("div")(
  {},
  ({ style }) => ({
    alignItems: "center",
    display: "flex",
    height: px(style.h),
    justifyContent: "center",
    "@media (max-width: 767px)": {
      padding: px(10)
    },
    "> div": {
      minWidth: px(style.h),
      textAlign: "center"
    },
    button: {
      alignItems: "center",
      color: style.c,
      display: "inline-flex",
      fontSize: px(16),
      height: px(48),
      justifyContent: "center",
      width: px(48),
      "&.rswp__toggle": {
        fontSize: px(28)
      }
    }
  }),
  "ControlsRSWP"
);
function Controls(props) {
  const {
    isExternalDevice,
    isPlaying,
    locale,
    nextTracks,
    onClickNext,
    onClickPrevious,
    onClickTogglePlay,
    previousTracks,
    styles: { color, height }
  } = props;
  return /* @__PURE__ */ React14.createElement(
    Wrapper5,
    {
      "data-component-name": "Controls",
      "data-playing": isPlaying,
      style: { c: color, h: height }
    },
    /* @__PURE__ */ React14.createElement("div", null, (!!previousTracks.length || isExternalDevice) && /* @__PURE__ */ React14.createElement(
      "button",
      {
        "aria-label": locale.previous,
        onClick: onClickPrevious,
        title: locale.previous,
        type: "button"
      },
      /* @__PURE__ */ React14.createElement(Previous, null)
    )),
    /* @__PURE__ */ React14.createElement("div", null, /* @__PURE__ */ React14.createElement(
      "button",
      {
        "aria-label": isPlaying ? locale.pause : locale.play,
        className: "rswp__toggle",
        onClick: onClickTogglePlay,
        title: isPlaying ? locale.pause : locale.play,
        type: "button"
      },
      isPlaying ? /* @__PURE__ */ React14.createElement(Pause, null) : /* @__PURE__ */ React14.createElement(Play, null)
    )),
    /* @__PURE__ */ React14.createElement("div", null, (!!nextTracks.length || isExternalDevice) && /* @__PURE__ */ React14.createElement("button", { "aria-label": locale.next, onClick: onClickNext, title: locale.next, type: "button" }, /* @__PURE__ */ React14.createElement(Next, null)))
  );
}

// src/components/ErrorMessage.tsx
import React15 from "react";
var Wrapper6 = styled("p")(
  {
    textAlign: "center",
    width: "100%"
  },
  ({ style }) => ({
    borderTop: `1px solid ${style.errorColor}`,
    color: style.errorColor,
    height: px(style.h),
    lineHeight: px(style.h)
  }),
  "ErrorRSWP"
);
function ErrorMessage({
  children,
  styles: { errorColor, height }
}) {
  return /* @__PURE__ */ React15.createElement(Wrapper6, { "data-component-name": "ErrorMessage", style: { errorColor, h: height } }, children);
}

// src/components/Info.tsx
import React18, { useEffect as useEffect3, useRef as useRef3, useState as useState3 } from "react";
import pkg3 from "react-use";

// src/components/icons/Favorite.tsx
import React16 from "react";
function Favorite(props) {
  return /* @__PURE__ */ React16.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React16.createElement(
    "path",
    {
      d: "M117.686 16.288c-4.297-4.297-9.22-7.266-14.924-8.907-11.33-3.36-23.518-.86-32.582 6.72l-.781.546c-.938.703-3.282 1.641-5.392 1.641-2.187 0-4.688-1.172-5.313-1.64-.39-.235-.625-.391-.86-.548-9.063-7.579-21.252-10.08-32.582-6.72C13.922 10.74 4.39 19.96 1.187 32.072c-3.204 12.19.156 25.082 9.142 34.145L54.24 117.63c2.579 2.97 5.782 4.454 9.767 4.454 3.985 0 7.189-1.485 9.767-4.454l43.912-51.413C124.484 59.42 128 50.121 128 41.213c0-8.907-3.516-18.127-10.314-24.925z",
      fill: "currentColor"
    }
  ));
}

// src/components/icons/FavoriteOutline.tsx
import React17 from "react";
function FavoriteOutline(props) {
  return /* @__PURE__ */ React17.createElement("svg", { height: "1em", preserveAspectRatio: "xMidYMid", viewBox: "0 0 128 128", width: "1em", ...props }, /* @__PURE__ */ React17.createElement(
    "path",
    {
      d: "M126.772 51.913c-1.641 6.254-4.848 11.796-9.505 16.528l-41.524 48.612c-3.096 3.585-7.039 5.392-11.765 5.392-4.726 0-8.668-1.807-11.768-5.396L10.66 68.34C6.077 63.754 2.814 58.12 1.266 52.004.418 49 0 45.775 0 42.443 0 32.631 3.808 23.4 10.737 16.472 19.61 7.597 31.993 3.833 44.055 6.293c6.015 1.267 11.383 3.881 16.17 7.883a5.834 5.834 0 0 0 3.753 1.342c1.4 0 2.658-.459 3.674-1.339 9.686-7.953 22.313-10.577 34.105-7.094 5.884 1.828 11.005 4.928 15.463 9.387 9.322 9.322 12.893 22.716 9.552 35.44zm-14.428 12.012c7.721-7.721 10.73-18.85 8.013-29.263-3.259-12.157-13.877-21.773-27.765-22.377-7.712-.374-14.583 1.94-20.726 7.016-.334.223-.49.33-.73.511a11.431 11.431 0 0 1-4.092 1.923c-1.093.273-2.062.412-3.066.412-2.319 0-5.33-1.013-6.809-1.998-.37-.247-.701-.496-1.228-.902-5.627-4.652-11.977-6.96-19.156-6.96a30.137 30.137 0 0 0-21.323 8.825c-5.7 5.776-8.834 13.336-8.834 21.331 0 8.072 3.133 15.63 8.878 21.379l41.75 48.913c1.77 2.055 3.998 3.082 6.722 3.082s4.95-1.026 6.722-3.08l41.644-48.812z",
      fill: "currentColor"
    }
  ));
}

// src/spotify.ts
async function checkTracksStatus(token, tracks) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];
  return fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getDevices(token) {
  return fetch(`https://api.spotify.com/v1/me/player/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => d.json());
}
async function getPlaybackState(token) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "GET"
  }).then((d) => {
    if (d.status === 204) {
      return null;
    }
    return d.json();
  });
}
async function pause(token) {
  return fetch(`https://api.spotify.com/v1/me/player/pause`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function play(token, { context_uri, deviceId, offset = 0, uris }) {
  let body;
  if (context_uri) {
    const isArtist = context_uri.indexOf("artist") >= 0;
    let position;
    if (!isArtist) {
      position = { position: offset };
    }
    body = JSON.stringify({ context_uri, offset: position });
  } else if (Array.isArray(uris) && uris.length) {
    body = JSON.stringify({ uris, offset: { position: offset } });
  }
  return fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function previous(token) {
  return fetch(`https://api.spotify.com/v1/me/player/previous`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });
}
async function next(token) {
  return fetch(`https://api.spotify.com/v1/me/player/next`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "POST"
  });
}
async function removeTracks(token, tracks) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];
  return fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify(ids),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "DELETE"
  });
}
async function saveTracks(token, tracks) {
  const ids = Array.isArray(tracks) ? tracks : [tracks];
  return fetch(`https://api.spotify.com/v1/me/tracks`, {
    body: JSON.stringify({ ids }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function seek(token, position) {
  return fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function setDevice(token, deviceId, shouldPlay) {
  return fetch(`https://api.spotify.com/v1/me/player`, {
    body: JSON.stringify({ device_ids: [deviceId], play: shouldPlay }),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}
async function setVolume(token, volume) {
  return fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    method: "PUT"
  });
}

// src/utils.ts
import pkg2 from "exenv";
var { canUseDOM: canUseDOMBool } = pkg2;
var STATUS = {
  ERROR: "ERROR",
  IDLE: "IDLE",
  INITIALIZING: "INITIALIZING",
  READY: "READY",
  RUNNING: "RUNNING",
  UNSUPPORTED: "UNSUPPORTED"
};
var TYPE = {
  DEVICE: "device_update",
  FAVORITE: "favorite_update",
  PLAYER: "player_update",
  PROGRESS: "progress_update",
  STATUS: "status_update",
  TRACK: "track_update"
};
function getLocale(locale) {
  return {
    devices: "Devices",
    next: "Next",
    pause: "Pause",
    play: "Play",
    previous: "Previous",
    removeTrack: "Remove from your favorites",
    saveTrack: "Save to your favorites",
    title: "{name} on SPOTIFY",
    volume: "Volume",
    ...locale
  };
}
function getSpotifyLink(uri) {
  const [, type = "", id = ""] = uri.split(":");
  return `https://open.spotify.com/${type}/${id}`;
}
function getSpotifyLinkTitle(name, locale) {
  return locale.replace("{name}", name);
}
function getSpotifyURIType(uri) {
  const [, type = ""] = uri.split(":");
  return type;
}
function isNumber(value) {
  return typeof value === "number";
}
function loadSpotifyPlayer() {
  return new Promise((resolve, reject) => {
    const scriptTag = document.getElementById("spotify-player");
    if (!scriptTag) {
      const script = document.createElement("script");
      script.id = "spotify-player";
      script.type = "text/javascript";
      script.async = false;
      script.defer = true;
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => resolve();
      script.onerror = (error) => reject(new Error(`loadScript: ${error.message}`));
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}
function parseVolume(value) {
  if (!isNumber(value)) {
    return 1;
  }
  if (value > 1) {
    return value / 100;
  }
  return value;
}
function round(number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
}
function validateURI(input) {
  const validTypes = ["album", "artist", "playlist", "show", "track"];
  if (input && input.indexOf(":") > -1) {
    const [key, type, id] = input.split(":");
    if (key === "spotify" && validTypes.indexOf(type) >= 0 && id.length === 22) {
      return true;
    }
  }
  return false;
}

// src/components/Info.tsx
var { useMount, usePrevious: usePrevious2, useUnmount } = pkg3;
var Wrapper7 = styled("div")(
  {
    alignItems: "center",
    display: "flex",
    textAlign: "left",
    a: {
      display: "inline-flex",
      textDecoration: "none"
    },
    "@media (max-width: 1023px)": {
      borderBottom: "1px solid #ccc",
      display: "none",
      width: "100%"
    },
    "&.rswp__active": {
      "@media (max-width: 1023px)": {
        display: "flex"
      }
    }
  },
  ({ style }) => ({
    height: px(style.h),
    img: {
      height: px(style.h),
      width: px(style.h)
    }
  }),
  "InfoRSWP"
);
var Title = styled("div")(
  {
    paddingLeft: px(10),
    whiteSpace: "nowrap",
    p: {
      fontSize: px(14),
      lineHeight: 1.3,
      paddingRight: px(5),
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "100%",
      "&:first-child": {
        alignItems: "center",
        display: "inline-flex"
      }
    },
    span: {
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    button: {
      fontSize: "110%",
      marginLeft: px(5)
    }
  },
  ({ style }) => ({
    width: `calc(100% - ${px(style.h)})`,
    p: {
      a: {
        color: style.trackNameColor
      },
      "&:last-child": {
        a: {
          color: style.trackArtistColor
        }
      }
    },
    button: {
      color: style.c,
      "&.rswp__active": {
        color: style.activeColor
      }
    }
  })
);
function Info(props) {
  const {
    isActive,
    locale,
    onFavoriteStatusChange,
    showSaveIcon,
    styles: { activeColor, color, height, trackArtistColor, trackNameColor },
    token,
    track: { id, name, uri, image, artists = [] },
    updateSavedStatus
  } = props;
  const [isSaved, setIsSaved] = useState3(false);
  const isMounted = useRef3(false);
  const previousId = usePrevious2(id);
  const updateState = (state) => {
    if (!isMounted.current) {
      return;
    }
    setIsSaved(state);
  };
  const setStatus = async () => {
    if (!isMounted.current) {
      return;
    }
    if (updateSavedStatus && id) {
      updateSavedStatus((newStatus) => {
        updateState(newStatus);
      });
    }
    const status = await checkTracksStatus(token, id);
    const [isFavorite] = status || [false];
    updateState(isFavorite);
    onFavoriteStatusChange(isSaved);
  };
  useMount(async () => {
    isMounted.current = true;
    if (showSaveIcon && id) {
      await setStatus();
    }
  });
  useEffect3(() => {
    if (showSaveIcon && previousId !== id && id) {
      updateState(false);
      setStatus();
    }
  });
  useUnmount(() => {
    isMounted.current = false;
  });
  const handleClickIcon = async () => {
    if (isSaved) {
      await removeTracks(token, id);
      updateState(false);
    } else {
      await saveTracks(token, id);
      updateState(true);
    }
    onFavoriteStatusChange(!isSaved);
  };
  const title = getSpotifyLinkTitle(name, locale.title);
  let icon;
  if (showSaveIcon && id) {
    icon = /* @__PURE__ */ React18.createElement(
      "button",
      {
        "aria-label": isSaved ? locale.removeTrack : locale.saveTrack,
        className: isSaved ? "rswp__active" : void 0,
        onClick: handleClickIcon,
        title: isSaved ? locale.removeTrack : locale.saveTrack,
        type: "button"
      },
      isSaved ? /* @__PURE__ */ React18.createElement(Favorite, null) : /* @__PURE__ */ React18.createElement(FavoriteOutline, null)
    );
  }
  const classes = [];
  if (isActive) {
    classes.push("rswp__active");
  }
  return /* @__PURE__ */ React18.createElement(Wrapper7, { className: classes.join(" "), "data-component-name": "Info", style: { h: height } }, image && /* @__PURE__ */ React18.createElement(
    "a",
    {
      "aria-label": title,
      href: getSpotifyLink(uri),
      rel: "noreferrer",
      target: "_blank",
      title
    },
    /* @__PURE__ */ React18.createElement("img", { alt: name, src: image })
  ), !!name && /* @__PURE__ */ React18.createElement(Title, { style: { c: color, h: height, activeColor, trackArtistColor, trackNameColor } }, /* @__PURE__ */ React18.createElement("p", null, /* @__PURE__ */ React18.createElement("span", null, /* @__PURE__ */ React18.createElement(
    "a",
    {
      "aria-label": title,
      href: getSpotifyLink(uri),
      rel: "noreferrer",
      target: "_blank",
      title
    },
    name
  )), icon), /* @__PURE__ */ React18.createElement("p", { title: artists.map((d) => d.name).join(", ") }, artists.map((artist, index) => {
    const artistTitle = getSpotifyLinkTitle(artist.name, locale.title);
    return /* @__PURE__ */ React18.createElement("span", { key: artist.uri }, index ? ", " : "", /* @__PURE__ */ React18.createElement(
      "a",
      {
        "aria-label": artistTitle,
        href: getSpotifyLink(artist.uri),
        rel: "noreferrer",
        target: "_blank",
        title: artistTitle
      },
      artist.name
    ));
  }))));
}

// src/components/Loader.tsx
import React19 from "react";
var Wrapper8 = styled("div")(
  {
    margin: "0 auto",
    position: "relative",
    "> div": {
      borderRadius: "50%",
      borderStyle: "solid",
      borderWidth: 0,
      boxSizing: "border-box",
      height: 0,
      left: "50%",
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: 0
    }
  },
  ({ style }) => {
    const pulse = keyframes({
      "0%": {
        height: 0,
        width: 0
      },
      "30%": {
        borderWidth: px(8),
        height: px(style.loaderSize),
        opacity: 1,
        width: px(style.loaderSize)
      },
      "100%": {
        borderWidth: 0,
        height: px(style.loaderSize),
        opacity: 0,
        width: px(style.loaderSize)
      }
    });
    return {
      height: px(style.loaderSize),
      width: px(style.loaderSize),
      "> div": {
        animation: `${pulse} 1.15s infinite cubic-bezier(0.215, 0.61, 0.355, 1)`,
        borderColor: style.loaderColor
      }
    };
  },
  "LoaderRSWP"
);
function Loader({ styles: { loaderColor, loaderSize } }) {
  return /* @__PURE__ */ React19.createElement(Wrapper8, { "data-component-name": "Loader", style: { loaderColor, loaderSize } }, /* @__PURE__ */ React19.createElement("div", null));
}

// src/components/Player.tsx
import React20, { forwardRef } from "react";
put(".PlayerRSWP", {
  boxSizing: "border-box",
  fontSize: "inherit",
  width: "100%",
  "*": {
    boxSizing: "border-box"
  },
  button: {
    appearance: "none",
    backgroundColor: "transparent",
    border: 0,
    borderRadius: 0,
    color: "inherit",
    cursor: "pointer",
    display: "inline-flex",
    lineHeight: 1,
    padding: 0,
    ":focus": {
      outlineColor: "#000",
      outlineOffset: 3
    }
  },
  p: {
    margin: 0
  }
});
var Player = forwardRef(
  ({ children, styles: { bgColor, height }, ...rest }, ref) => {
    return /* @__PURE__ */ React20.createElement(
      "div",
      {
        ref,
        className: "PlayerRSWP",
        "data-component-name": "Player",
        style: { backgroundColor: bgColor, minHeight: px(height) },
        ...rest
      },
      children
    );
  }
);
var Player_default = Player;

// src/components/Slider.tsx
import React21 from "react";
import RangeSlider2 from "@gilbarbara/react-range-slider";
var Wrapper9 = styled("div")(
  {
    display: "flex",
    position: "relative",
    transition: "height 0.3s",
    zIndex: 10
  },
  ({ style }) => ({
    height: px(style.sliderHeight)
  }),
  "SliderRSWP"
);
function Slider(props) {
  const { isMagnified, onChangeRange, onToggleMagnify, position, styles } = props;
  const handleChangeRange = async ({ x }) => {
    onChangeRange(x);
  };
  const handleSize = styles.sliderHeight + 6;
  return /* @__PURE__ */ React21.createElement(
    Wrapper9,
    {
      "data-component-name": "Slider",
      "data-position": position,
      onMouseEnter: onToggleMagnify,
      onMouseLeave: onToggleMagnify,
      style: { sliderHeight: isMagnified ? styles.sliderHeight + 4 : styles.sliderHeight }
    },
    /* @__PURE__ */ React21.createElement(
      RangeSlider2,
      {
        axis: "x",
        className: "slider",
        onChange: handleChangeRange,
        styles: {
          options: {
            thumbBorder: 0,
            thumbBorderRadius: styles.sliderHandleBorderRadius,
            thumbColor: styles.sliderHandleColor,
            thumbSize: isMagnified ? handleSize + 4 : handleSize,
            height: isMagnified ? styles.sliderHeight + 4 : styles.sliderHeight,
            padding: 0,
            rangeColor: styles.sliderColor,
            trackBorderRadius: styles.sliderTrackBorderRadius,
            trackColor: styles.sliderTrackColor
          }
        },
        x: position,
        xMax: 100,
        xMin: 0,
        xStep: 0.1
      }
    )
  );
}

// src/index.tsx
var SpotifyWebPlayer = class extends PureComponent {
  isActive = false;
  emptyTrack = {
    artists: [],
    durationMs: 0,
    id: "",
    image: "",
    name: "",
    uri: ""
  };
  hasNewToken = false;
  player;
  playerProgressInterval;
  playerSyncInterval;
  ref = createRef();
  seekUpdateInterval = 100;
  styles;
  syncTimeout;
  getPlayOptions = memoize((data) => {
    const playOptions = {
      context_uri: void 0,
      uris: void 0
    };
    if (data) {
      const ids = Array.isArray(data) ? data : [data];
      if (!ids.every((d) => validateURI(d))) {
        console.error("Invalid URI");
        return playOptions;
      }
      if (ids.some((d) => getSpotifyURIType(d) === "track")) {
        if (!ids.every((d) => getSpotifyURIType(d) === "track")) {
          console.warn("You can't mix tracks URIs with other types");
        }
        playOptions.uris = ids.filter((d) => validateURI(d) && getSpotifyURIType(d) === "track");
      } else {
        if (ids.length > 1) {
          console.warn("Albums, Artists, Playlists and Podcasts can't have multiple URIs");
        }
        playOptions.context_uri = ids[0];
      }
    }
    return playOptions;
  });
  constructor(props) {
    super(props);
    this.state = {
      currentDeviceId: "",
      deviceId: "",
      devices: [],
      error: "",
      errorType: "",
      isActive: false,
      isInitializing: false,
      isMagnified: false,
      isPlaying: false,
      isSaved: false,
      isUnsupported: false,
      needsUpdate: false,
      nextTracks: [],
      playerPosition: "bottom",
      position: 0,
      previousTracks: [],
      progressMs: 0,
      status: STATUS.IDLE,
      track: this.emptyTrack,
      volume: parseVolume(props.initialVolume) || 1
    };
    this.styles = getMergedStyles(props.styles);
  }
  async componentDidMount() {
    var _a;
    this.isActive = true;
    const { top = 0 } = ((_a = this.ref.current) == null ? void 0 : _a.getBoundingClientRect()) || {};
    this.updateState({
      playerPosition: top > window.innerHeight / 2 ? "bottom" : "top",
      status: STATUS.INITIALIZING
    });
    if (!window.onSpotifyWebPlaybackSDKReady) {
      window.onSpotifyWebPlaybackSDKReady = this.initializePlayer;
    } else {
      this.initializePlayer();
    }
    await loadSpotifyPlayer();
  }
  async componentDidUpdate(previousProps, previousState) {
    const { currentDeviceId, deviceId, errorType, isInitializing, isPlaying, status, track } = this.state;
    const {
      autoPlay,
      offset,
      play: playProp,
      showSaveIcon,
      syncExternalDevice,
      token,
      uris
    } = this.props;
    const isReady = previousState.status !== STATUS.READY && status === STATUS.READY;
    const changedURIs = !isEqual(previousProps.uris, uris);
    const playOptions = this.getPlayOptions(uris);
    const canPlay = !!currentDeviceId && !!(playOptions.context_uri || playOptions.uris);
    const shouldPlay = changedURIs && isPlaying || !!(isReady && (autoPlay || playProp));
    if (canPlay && shouldPlay) {
      await play(token, { deviceId: currentDeviceId, offset, ...playOptions });
      if (!isPlaying) {
        this.updateState({ isPlaying: true });
      }
      if (this.isExternalPlayer) {
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 600);
      }
    } else if (changedURIs && !isPlaying) {
      this.updateState({ needsUpdate: true });
    }
    if (previousState.status !== status) {
      this.handleCallback({
        ...this.state,
        type: TYPE.STATUS
      });
    }
    if (previousState.currentDeviceId !== currentDeviceId && currentDeviceId) {
      if (!isReady) {
        this.handleCallback({
          ...this.state,
          type: TYPE.DEVICE
        });
      }
      await this.toggleSyncInterval(this.isExternalPlayer);
      await this.updateSeekBar();
    }
    if (previousState.track.id !== track.id && track.id) {
      this.handleCallback({
        ...this.state,
        type: TYPE.TRACK
      });
      if (showSaveIcon) {
        this.updateState({ isSaved: false });
      }
    }
    if (previousState.isPlaying !== isPlaying) {
      this.toggleProgressBar();
      await this.toggleSyncInterval(this.isExternalPlayer);
      this.handleCallback({
        ...this.state,
        type: TYPE.PLAYER
      });
    }
    if (token && previousProps.token !== token) {
      if (!isInitializing) {
        this.initializePlayer();
      } else {
        this.hasNewToken = true;
      }
    }
    if (previousProps.play !== playProp && playProp !== isPlaying) {
      await this.togglePlay(!track.id || changedURIs);
    }
    if (previousProps.offset !== offset) {
      await this.toggleOffset();
    }
    if (previousState.isInitializing && !isInitializing) {
      if (syncExternalDevice && !uris) {
        const player = await getPlaybackState(token);
        if (player && player.is_playing && player.device.id !== deviceId) {
          this.setExternalDevice(player.device.id);
        }
      }
    }
    if (errorType === "authentication_error" && this.hasNewToken) {
      this.hasNewToken = false;
      this.initializePlayer();
    }
  }
  async componentWillUnmount() {
    this.isActive = false;
    if (this.player) {
      this.player.disconnect();
    }
    clearInterval(this.playerSyncInterval);
    clearInterval(this.playerProgressInterval);
    clearTimeout(this.syncTimeout);
  }
  get isExternalPlayer() {
    const { currentDeviceId, deviceId, status } = this.state;
    return currentDeviceId && currentDeviceId !== deviceId || status === STATUS.UNSUPPORTED;
  }
  handleCallback(state) {
    const { callback } = this.props;
    if (callback) {
      callback(state);
    }
  }
  handleChangeRange = async (position) => {
    const { track } = this.state;
    const { callback, token } = this.props;
    let progress = 0;
    try {
      const percentage = position / 100;
      if (this.isExternalPlayer) {
        progress = Math.round(track.durationMs * percentage);
        await seek(token, progress);
        this.updateState({
          position,
          progressMs: progress
        });
      } else if (this.player) {
        const state = await this.player.getCurrentState();
        if (state) {
          progress = Math.round(state.track_window.current_track.duration_ms * percentage);
          await this.player.seek(progress);
          this.updateState({
            position,
            progressMs: progress
          });
        } else {
          this.updateState({ position: 0 });
        }
      }
      if (callback) {
        callback({
          ...this.state,
          type: TYPE.PROGRESS
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleClickTogglePlay = async () => {
    const { isActive } = this.state;
    try {
      await this.togglePlay(!this.isExternalPlayer && !isActive);
    } catch (error) {
      console.error(error);
    }
  };
  handleClickPrevious = async () => {
    try {
      if (this.isExternalPlayer) {
        const { token } = this.props;
        await previous(token);
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        await this.player.previousTrack();
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleClickNext = async () => {
    try {
      if (this.isExternalPlayer) {
        const { token } = this.props;
        await next(token);
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        await this.player.nextTrack();
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleClickDevice = async (deviceId) => {
    const { isUnsupported } = this.state;
    const { autoPlay, persistDeviceSelection, token } = this.props;
    this.updateState({ currentDeviceId: deviceId });
    try {
      await setDevice(token, deviceId);
      if (persistDeviceSelection) {
        sessionStorage.setItem("rswpDeviceId", deviceId);
      }
      if (isUnsupported) {
        await this.syncDevice();
        const player = await getPlaybackState(token);
        if (player && !player.is_playing && autoPlay) {
          await this.togglePlay(true);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  handleFavoriteStatusChange = (status) => {
    const { isSaved } = this.state;
    this.updateState({ isSaved: status });
    if (isSaved !== status) {
      this.handleCallback({
        ...this.state,
        isSaved: status,
        type: TYPE.FAVORITE
      });
    }
  };
  handlePlayerErrors = async (type, message) => {
    const { status } = this.state;
    const isPlaybackError = type === "playback_error";
    const isInitializationError = type === "initialization_error";
    let nextStatus = status;
    let devices = [];
    if (this.player && !isPlaybackError) {
      await this.player.disconnect();
      this.player = void 0;
    }
    if (isInitializationError) {
      const { token } = this.props;
      nextStatus = STATUS.UNSUPPORTED;
      ({ devices = [] } = await getDevices(token));
    }
    if (!isInitializationError && !isPlaybackError) {
      nextStatus = STATUS.ERROR;
    }
    this.updateState({
      devices,
      error: message,
      errorType: type,
      isInitializing: false,
      isUnsupported: isInitializationError,
      status: nextStatus
    });
  };
  handlePlayerStateChanges = async (state) => {
    var _a;
    try {
      if (state) {
        const {
          paused,
          position,
          track_window: {
            current_track: { album, artists, duration_ms, id, name, uri },
            next_tracks,
            previous_tracks
          }
        } = state;
        const isPlaying = !paused;
        const volume = await ((_a = this.player) == null ? void 0 : _a.getVolume()) || 100;
        const track = {
          artists,
          durationMs: duration_ms,
          id,
          image: this.setAlbumImage(album),
          name,
          uri
        };
        let trackState;
        if (position === 0) {
          trackState = {
            nextTracks: next_tracks,
            position: 0,
            previousTracks: previous_tracks,
            track
          };
        }
        this.updateState({
          error: "",
          errorType: "",
          isActive: true,
          isPlaying,
          progressMs: position,
          volume: round(volume),
          ...trackState
        });
      } else if (this.isExternalPlayer) {
        await this.syncDevice();
      } else {
        this.updateState({
          isActive: false,
          isPlaying: false,
          nextTracks: [],
          position: 0,
          previousTracks: [],
          track: {
            artists: "",
            durationMs: 0,
            id: "",
            image: "",
            name: "",
            uri: ""
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  handlePlayerStatus = async ({ device_id }) => {
    const { currentDeviceId, devices } = await this.initializeDevices(device_id);
    this.updateState({
      currentDeviceId,
      deviceId: device_id,
      devices,
      isInitializing: false,
      status: device_id ? STATUS.READY : STATUS.IDLE
    });
  };
  handleToggleMagnify = () => {
    const { magnifySliderOnHover } = this.props;
    if (magnifySliderOnHover) {
      this.updateState((previousState) => {
        return { isMagnified: !previousState.isMagnified };
      });
    }
  };
  async initializeDevices(id) {
    const { persistDeviceSelection, token } = this.props;
    const { devices } = await getDevices(token);
    let currentDeviceId = id;
    if (persistDeviceSelection) {
      const savedDeviceId = sessionStorage.getItem("rswpDeviceId");
      if (!savedDeviceId || !devices.some((d) => d.id === savedDeviceId)) {
        sessionStorage.setItem("rswpDeviceId", currentDeviceId);
      } else {
        currentDeviceId = savedDeviceId;
      }
    }
    return { currentDeviceId, devices };
  }
  initializePlayer = () => {
    const { volume } = this.state;
    const { name = "Spotify Web Player", token } = this.props;
    if (!window.Spotify) {
      return;
    }
    this.updateState({
      error: "",
      errorType: "",
      isInitializing: true
    });
    this.player = new window.Spotify.Player({
      getOAuthToken: (callback) => {
        callback(token);
      },
      name,
      volume
    });
    this.player.addListener("ready", this.handlePlayerStatus);
    this.player.addListener("not_ready", this.handlePlayerStatus);
    this.player.addListener("player_state_changed", this.handlePlayerStateChanges);
    this.player.addListener(
      "initialization_error",
      (error) => this.handlePlayerErrors("initialization_error", error.message)
    );
    this.player.addListener(
      "authentication_error",
      (error) => this.handlePlayerErrors("authentication_error", error.message)
    );
    this.player.addListener(
      "account_error",
      (error) => this.handlePlayerErrors("account_error", error.message)
    );
    this.player.addListener(
      "playback_error",
      (error) => this.handlePlayerErrors("playback_error", error.message)
    );
    this.player.connect();
  };
  setAlbumImage = (album) => {
    const width = Math.min(...album.images.map((d) => d.width || 0));
    const thumb = album.images.find((d) => d.width === width) || {};
    return thumb.url;
  };
  setExternalDevice = (id) => {
    this.updateState({ currentDeviceId: id, isPlaying: true });
  };
  setVolume = async (volume) => {
    const { token } = this.props;
    if (this.isExternalPlayer) {
      await setVolume(token, Math.round(volume * 100));
      await this.syncDevice();
    } else if (this.player) {
      await this.player.setVolume(volume);
    }
    this.updateState({ volume });
  };
  syncDevice = async () => {
    if (!this.isActive) {
      return;
    }
    const { deviceId } = this.state;
    const { token } = this.props;
    try {
      const player = await getPlaybackState(token);
      let track = this.emptyTrack;
      if (!player) {
        throw new Error("No player");
      }
      if (player.item) {
        track = {
          artists: player.item.artists,
          durationMs: player.item.duration_ms,
          id: player.item.id,
          image: this.setAlbumImage(player.item.album),
          name: player.item.name,
          uri: player.item.uri
        };
      }
      this.updateState({
        error: "",
        errorType: "",
        isActive: true,
        isPlaying: player.is_playing,
        nextTracks: [],
        previousTracks: [],
        progressMs: player.item ? player.progress_ms : 0,
        status: STATUS.READY,
        track,
        volume: parseVolume(player.device.volume_percent)
      });
    } catch (error) {
      const state = {
        isActive: false,
        isPlaying: false,
        position: 0,
        track: this.emptyTrack
      };
      if (deviceId) {
        this.updateState({
          currentDeviceId: deviceId,
          ...state
        });
        return;
      }
      this.updateState({
        error: error.message,
        errorType: "player_status",
        status: STATUS.ERROR,
        ...state
      });
    }
  };
  async toggleSyncInterval(shouldSync) {
    const { syncExternalDeviceInterval } = this.props;
    try {
      if (this.isExternalPlayer && shouldSync && !this.playerSyncInterval) {
        await this.syncDevice();
        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = window.setInterval(
          this.syncDevice,
          syncExternalDeviceInterval * 1e3
        );
      }
      if ((!shouldSync || !this.isExternalPlayer) && this.playerSyncInterval) {
        clearInterval(this.playerSyncInterval);
        this.playerSyncInterval = void 0;
      }
    } catch (error) {
      console.error(error);
    }
  }
  toggleProgressBar() {
    const { isPlaying } = this.state;
    if (isPlaying) {
      if (!this.playerProgressInterval) {
        this.playerProgressInterval = window.setInterval(
          this.updateSeekBar,
          this.seekUpdateInterval
        );
      }
    } else if (this.playerProgressInterval) {
      clearInterval(this.playerProgressInterval);
      this.playerProgressInterval = void 0;
    }
  }
  toggleOffset = async () => {
    const { currentDeviceId } = this.state;
    const { offset, token, uris } = this.props;
    if (typeof offset === "number" && Array.isArray(uris)) {
      await play(token, { deviceId: currentDeviceId, offset, uris });
    }
  };
  togglePlay = async (init = false) => {
    const { currentDeviceId, isPlaying, needsUpdate } = this.state;
    const { offset, token, uris } = this.props;
    const shouldInitialize = init || needsUpdate;
    const playOptions = this.getPlayOptions(uris);
    try {
      if (this.isExternalPlayer) {
        if (!isPlaying) {
          await play(token, {
            deviceId: currentDeviceId,
            offset,
            ...shouldInitialize ? playOptions : void 0
          });
        } else {
          await pause(token);
          this.updateState({ isPlaying: false });
        }
        this.syncTimeout = window.setTimeout(() => {
          this.syncDevice();
        }, 300);
      } else if (this.player) {
        const playerState = await this.player.getCurrentState();
        await this.player.activateElement();
        if (!playerState && !!(playOptions.context_uri || playOptions.uris) || shouldInitialize && playerState && playerState.paused) {
          await play(token, {
            deviceId: currentDeviceId,
            offset,
            ...shouldInitialize ? playOptions : void 0
          });
        } else {
          await this.player.togglePlay();
        }
      }
      if (needsUpdate) {
        this.updateState({ needsUpdate: false });
      }
    } catch (error) {
      console.error(error);
    }
  };
  updateSeekBar = async () => {
    if (!this.isActive) {
      return;
    }
    const { progressMs, track } = this.state;
    try {
      if (this.isExternalPlayer) {
        let position = progressMs / track.durationMs;
        position = Number(((Number.isFinite(position) ? position : 0) * 100).toFixed(1));
        this.updateState({
          position,
          progressMs: progressMs + this.seekUpdateInterval
        });
      } else if (this.player) {
        const state = await this.player.getCurrentState();
        if (state) {
          const progress = state.position;
          const position = Number(
            (progress / state.track_window.current_track.duration_ms * 100).toFixed(1)
          );
          this.updateState({
            position,
            progressMs: progress + this.seekUpdateInterval
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  updateState = (state = {}) => {
    if (!this.isActive) {
      return;
    }
    this.setState(state);
  };
  render() {
    const {
      currentDeviceId,
      deviceId,
      devices,
      error,
      errorType,
      isActive,
      isMagnified,
      isPlaying,
      isUnsupported,
      nextTracks,
      playerPosition,
      position,
      previousTracks,
      status,
      track,
      volume
    } = this.state;
    const { locale, name, showSaveIcon, token, updateSavedStatus } = this.props;
    const isReady = [STATUS.READY, STATUS.UNSUPPORTED].indexOf(status) >= 0;
    const isPlaybackError = errorType === "playback_error";
    const localeMerged = getLocale(locale);
    let output = /* @__PURE__ */ React22.createElement(Loader, { styles: this.styles });
    let info;
    if (isPlaybackError) {
      info = /* @__PURE__ */ React22.createElement("p", null, error);
    }
    if (isReady) {
      if (!info) {
        info = /* @__PURE__ */ React22.createElement(
          Info,
          {
            isActive,
            locale: localeMerged,
            onFavoriteStatusChange: this.handleFavoriteStatusChange,
            showSaveIcon,
            styles: this.styles,
            token,
            track,
            updateSavedStatus
          }
        );
      }
      output = /* @__PURE__ */ React22.createElement(React22.Fragment, null, info, /* @__PURE__ */ React22.createElement(
        Controls,
        {
          isExternalDevice: this.isExternalPlayer,
          isPlaying,
          locale: localeMerged,
          nextTracks,
          onClickNext: this.handleClickNext,
          onClickPrevious: this.handleClickPrevious,
          onClickTogglePlay: this.handleClickTogglePlay,
          previousTracks,
          styles: this.styles
        }
      ), /* @__PURE__ */ React22.createElement(
        Actions,
        {
          currentDeviceId,
          deviceId,
          devices,
          isDevicesOpen: isUnsupported && !deviceId,
          locale: localeMerged,
          onClickDevice: this.handleClickDevice,
          playerPosition,
          setVolume: this.setVolume,
          styles: this.styles,
          volume
        }
      ));
    } else if (info) {
      output = info;
    }
    if (status === STATUS.ERROR) {
      output = /* @__PURE__ */ React22.createElement(ErrorMessage, { styles: this.styles }, name, ": ", error);
    }
    return /* @__PURE__ */ React22.createElement(Player_default, { ref: this.ref, "data-ready": isReady, styles: this.styles }, isReady && /* @__PURE__ */ React22.createElement(
      Slider,
      {
        isMagnified,
        onChangeRange: this.handleChangeRange,
        onToggleMagnify: this.handleToggleMagnify,
        position,
        styles: this.styles
      }
    ), /* @__PURE__ */ React22.createElement(Content, { styles: this.styles }, output));
  }
};
__publicField(SpotifyWebPlayer, "defaultProps", {
  autoPlay: false,
  initialVolume: 1,
  magnifySliderOnHover: false,
  name: "Spotify Web Player",
  persistDeviceSelection: false,
  showSaveIcon: false,
  syncExternalDeviceInterval: 5,
  syncExternalDevice: false
});
var src_default = SpotifyWebPlayer;
export {
  STATUS,
  TYPE,
  src_default as default
};
//# sourceMappingURL=index.mjs.map
