import React, { createContext, useContext, useState } from 'react';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [intervalId, setIntervalId] = useState(null);

  const clearLocationInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  return (
    <LocationContext.Provider
      value={{ intervalId, setIntervalId, clearLocationInterval }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function UseLocation() {
  return useContext(LocationContext);
}
