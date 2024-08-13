"use client"

import {createContext} from 'react';


export const MyContext = createContext();

export const MyProvider = ({ children }) => {

   const CLIENT_URL = "http://localhost:3000";


  return (
    <MyContext.Provider
      value={{
        CLIENT_URL
      }}
    >
      {children}
    </MyContext.Provider>
  );
};