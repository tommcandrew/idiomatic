import React, { useState, createContext, useEffect } from "react";

const DeviceContext = createContext();

export const DeviceContextProvider = props => {
  const [device, setDevice] = useState(null);
  const [windowSize, setWindowSize] = useState(getWidth());

  useEffect(() => {
    window.addEventListener("resize", e => {
      setWindowSize(getWidth());
    });
  }, []);

  useEffect(() => {
    if (windowSize > 1264) {
      setDevice("desktop");
    } else if (windowSize < 1264 && windowSize > 800) {
      setDevice("tablet");
    } else {
      setDevice("mobile");
    }
  }, [windowSize]);

  function getWidth() {
    const width = window.innerWidth;
    return width;
  }

  return (
    <DeviceContext.Provider value={{ device }}>
      {props.children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
