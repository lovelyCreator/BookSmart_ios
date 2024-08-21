/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import Dashboard from './src/layout/Dashboard';
import MHeader from './src/components/Mheader';
import ClientSignIn from './src/layout/client/ClientSignin';
import ClientSignUp from './src/layout/client/ClientSignup';
import { NavigationContainer } from '@react-navigation/native';
import StackRouter from './src/layout/Layout';
import { createDrawerNavigator} from '@react-navigation/drawer';
import Layout from './src/layout/Layout';
import MyHome from './src/layout/client/MyHome';
import MyProfile from './src/layout/client/MyProfile';
import ShiftListing from './src/layout/client/ShiftListing';
import Shift from './src/layout/client/Shift';
import Reporting from './src/layout/client/Reporting';
import EditProfile from './src/layout/client/EditProfile';
import AccountSettings from './src/layout/client/AccountSettings';
import AdminLogin from './src/layout/admin/AdminLogin';
import FacilityLogin from './src/layout/facilities/FacilityLogin';
import FacilitySignUp from './src/layout/facilities/FacilitySignUp';
import FacilityForgotPwd from './src/layout/facilities/FacilityForgotPwd';
import FacilityPwdPending from './src/layout/facilities/FacilityPwdPending';
import ClientPending from './src/layout/client/ClientPending';
import ClientForgotPwd from './src/layout/client/ClientForgotPwd';
import FacilityPermission from './src/layout/facilities/FacilityPermission';
import FacilityProfile from './src/layout/facilities/FacilityProfile';
import FacilityEditProfile from './src/layout/facilities/FacilityEditProfile';
import AddJobShift from './src/layout/facilities/AddJobShift';
import CompanyShift from './src/layout/facilities/CompanyShift';
import AdminHome from './src/layout/admin/AdminHome';
import AdminDashboard from './src/layout/admin/AdminDashboard';
import AllCaregivers from './src/layout/admin/AllCaregivers.js';
import AllJobShiftListing from './src/layout/admin/AllJobShiftListing.js';
import AdminJobShift from './src/layout/admin/AdminJobShift.js';
import AdminCompany from './src/layout/admin/AdminCompany.js';
import AdminEditProfile from './src/layout/admin/AdminEditProfile.js';
import AdminAllUser from './src/layout/admin/AdminAllUser.js';
import Invoice from './src/layout/facilities/invoice.js';
import BackgroundTask from './src/utils/backgroundTask.js'
import ClientPhone from './src/layout/client/ClientPhone.js';

// const Drawer = createDrawerNavigator();

function App() {

  return (
    <NavigationContainer style = {styles.sectionContainer}>
      <Layout />
      <BackgroundTask />
    </NavigationContainer>
    // <View>
    //   <ClientPhone />
    // </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    backgroundColor: '#ffffffa8'
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
