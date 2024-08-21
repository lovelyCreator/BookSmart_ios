import React, { useEffect, useState } from 'react';

import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import images from '../assets/images';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { firstNameAtom as clinicalFirstNameAtom } from '../context/ClinicalAuthProvider';
import { firstNameAtom as adminFirstNameAtom } from '../context/AdminAuthProvider';
import { firstNameAtom as facilityFirstNameAtom } from '../context/FacilityAuthProvider';

// import { getRatingDataByUserID } from '../utils/api';

export default function SubNavbar({name, navigation}) {
  const theme = useTheme();
  
  let userRole = 'clinical';
  if (name === "ClientSignIn") userRole = 'clinical';
  else if (name === "AdminLogin") userRole = 'admin';
  else if (name === "FacilityLogin") userRole = 'facilities';
  // console.log( name);
  
  const [firstName, setFirstName] = useAtom(userRole === 'clinical' ? clinicalFirstNameAtom : userRole === 'admin' ? adminFirstNameAtom : facilityFirstNameAtom);
  const handleNavigate = (navigateUrl) => {
    console.log(navigateUrl, "----------------------");
    navigation.navigate(navigateUrl, {userRole: userRole});
  }
  return (
    <Card style={styles.shadow} onPress={()=> handleNavigate(name) }>
      <Text style={styles.text}>
        Logged in as&nbsp;
        <Text style={{fontWeight: 'bold'}}>{firstName}</Text>&nbsp;-&nbsp;
        <Text 
          style={{
            color: '#2a53c1', 
            textDecorationLine: 'underline'
          }}
          onPress={()=>handleNavigate('AccountSettings')}
        >
          Account Settings
        </Text>
        &nbsp;- &nbsp;
        <Text 
          style={{
            color: '#2a53c1', 
            textDecorationLine: 'underline'
          }}
          onPress={()=>handleNavigate(name)}
        >
          Log Out
        </Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: 'hsl(0, 0%, 80%)',
    top: 98,
    position:'absolute',
    width: '100%',
    flexDirection: 'row',
    justifyContent:'flex-end',
    zIndex: 0
  },
  text: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#101010',
    fontSize: 16,
    textAlign: 'right',
  },
});
