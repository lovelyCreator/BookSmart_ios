import React from 'react';
import { Provider, atom } from 'jotai';

export const firstNameAtom = atom('');
export const lastNameAtom = atom('');
export const emailAtom = atom('');
export const companyNameAtom = atom('');
export const passInfAtom = atom('');
export const userStatusAtom = atom('');
export const phoneAtom = atom('');
export const userRoleAtom = atom('');
export const addressAtom = atom({
  street: '',
  street2: '',
  city: '',
  state: '',
  zip: '',
});
export const photoImageAtom = atom({
  content: '',
  type: '',
  name: ''
});

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
