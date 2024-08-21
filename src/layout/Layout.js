/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NativeRouter, Route, Routes } from 'react-router-native';
import Dashboard from './Dashboard';
import MHeader from '../components/Mheader';
import MFooter from '../components/Mfooter';
import ClientSignIn from './client/ClientSignin';
import ClientSignUp from './client/ClientSignup';
import MyHome from './client/MyHome';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyProfile from './client/MyProfile';
import ShiftListing from './client/ShiftListing';
import Shift from './client/Shift';
import Reporting from './client/Reporting';
import EditProfile from './client/EditProfile';
import AccountSettings from './client/AccountSettings';
import AdminLogin from './admin/AdminLogin';
import FacilityLogin from './facilities/FacilityLogin';
import FacilitySignUp from './facilities/FacilitySignUp';
import FacilityForgotPwd from './facilities/FacilityForgotPwd';
import FacilityPwdPending from './facilities/FacilityPwdPending';
import ClientForgotPwd from './client/ClientForgotPwd';
import ClientPending from './client/ClientPending';
import ClientFinishSignup from './client/ClientFinishSignUp';
import FacilityFinishSignup from './facilities/FacilityFinishSignUp';
import FacilityPermission from './facilities/FacilityPermission';
import FacilityProfile from './facilities/FacilityProfile';
import FacilityEditProfile from './facilities/FacilityEditProfile';
import AddJobShift from './facilities/AddJobShift';
import CompanyShift from './facilities/CompanyShift';
import AdminHome from './admin/AdminHome';
import AdminDashboard from './admin/AdminDashboard';
import AllJobShiftListing from './admin/AllJobShiftListing.js';
import AdminJobShift from './admin/AdminJobShift.js';
import AdminCompany from './admin/AdminCompany.js';
import AdminEditProfile from './admin/AdminEditProfile.js';
import AllCaregivers from './admin/AllCaregivers.js';
import AdminAllUser from './admin/AdminAllUser.js';
import AdminFacilities from './admin/AdminFacilities.js';
import CaregiverTimeSheet from './admin/CaregiverTimeSheet.js';
import Invoice from './facilities/invoice.js';
import ClientPassVerify from './client/ClientPassVerify.js';
import ClientResetPassword from './client/ClientResetPass.js';
import FacilityPassVerify from './facilities/FacilityPassVerify.js';
import FacilityResetPassword from './facilities/FacilityResetPass.js';
import AdminPassVerify from './admin/AdminPassVerify.js';
import AdminPending from './admin/AdminPending.js';
import AdminForgotPwd from './admin/AdminForgotPwd.js';
import AdminResetPassword from './admin/AdminResetPass.js';
import ClientPhone from './client/ClientPhone.js';
import ClientPhoneVerify from './client/ClientPhoneVerify.js';
const Stack = createNativeStackNavigator();

function Layout() {
  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <MHeader />,
        footer: () => <MFooter />,
      }}
    >
      <Stack.Screen 
        name= 'Home'
        component = {Dashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientSignIn'
        component = {ClientSignIn}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientSignUp'
        component = {ClientSignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'MyHome'
        component = {MyHome}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'MyProfile'
        component = {MyProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ShiftListing'
        component = {ShiftListing}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Shift'
        component = {Shift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Reporting'
        component = {Reporting}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'EditProfile'
        component = {EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AccountSettings'
        component = {AccountSettings}        
        initialParams={{ userRole: 'clinical' }}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminLogin'
        component = {AdminLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityLogin'
        component = {FacilityLogin}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilitySignUp'
        component = {FacilitySignUp}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityForgotPwd'
        component = {FacilityForgotPwd}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityPwdPending'
        component = {FacilityPwdPending}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPending'
        component = {ClientPending}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientForgotPwd'
        component = {ClientForgotPwd}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientFinishSignup'
        component = {ClientFinishSignup}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityFinishSignup'
        component = {FacilityFinishSignup}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityPermission'
        component = {FacilityPermission}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityProfile'
        component = {FacilityProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityEditProfile'
        component = {FacilityEditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AddJobShift'
        component = {AddJobShift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'CompanyShift'
        component = {CompanyShift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminHome'
        component = {AdminHome}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminDashboard'
        component = {AdminDashboard}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AllJobShiftListing'
        component = {AllJobShiftListing}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminJobShift'
        component = {AdminJobShift}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminCompany'
        component = {AdminCompany}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminEditProfile'
        component = {AdminEditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AllCaregivers'
        component = {AllCaregivers}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminAllUser'
        component = {AdminAllUser}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminFacilities'
        component = {AdminFacilities}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'CaregiverTimeSheet'
        component = {CaregiverTimeSheet}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'Invoice'
        component = {Invoice}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPassVerify'
        component = {ClientPassVerify}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientResetPassword'
        component = {ClientResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityPassVerify'
        component = {FacilityPassVerify}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'FacilityResetPassword'
        component = {FacilityResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminPassVerify'
        component = {AdminPassVerify}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminResetPassword'
        component = {AdminResetPassword}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminPending'
        component = {AdminPending}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'AdminForgotPwd'
        component = {AdminForgotPwd}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPhone'
        component = {ClientPhone}
        options={{headerShown: false}}
      />
      <Stack.Screen 
        name= 'ClientPhoneVerify'
        component = {ClientPhoneVerify}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export default Layout;
