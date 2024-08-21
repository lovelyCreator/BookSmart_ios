import React from 'react';
import { Provider, atom } from 'jotai';

export const firstNameAtom = atom('');
export const lastNameAtom = atom('');
export const emailAtom = atom('');
export const phoneNumberAtom = atom('');
export const titleAtom = atom('');
export const birthdayAtom = atom(new Date());
export const socialSecurityNumberAtom = atom('');
export const verifiedSocialSecurityNumberAtom = atom('');
export const userRoleAtom = atom('');
export const entryDateAtom = atom('');
export const addressAtom = atom({
  streetAddress: '',
  streetAddress2: '',
  city: '',
  state: '',
  zip: '',
});
export const photoImageAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const passwordAtom = atom('');
export const signatureAtom = atom('');
export const caregiverAtom = atom('');
export const driverLicenseAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const socialCardAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const physicalExamAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const ppdAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const mmrAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const healthcareLicenseAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const resumeAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const covidCardAtom = atom({
  content: '',
  type: '',
  name: ''
});
export const blsAtom = atom({
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
