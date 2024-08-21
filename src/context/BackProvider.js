import React from 'react';
import { Provider, atom } from 'jotai';

export const invoiceFetchAtom = atom([]);
export const verifyPhoneAtom = atom('');
export const deviceNumberAtom = atom('');

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  return (
    <Provider>
      <AuthContext.Provider value = {{}}>
        {children}
      </AuthContext.Provider>
    </Provider>
  );
};

export default AuthProvider;
