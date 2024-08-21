import React, { useEffect, useState } from 'react';

import { View, Image, StyleSheet, StatusBar, Text } from 'react-native';
import images from '../assets/images';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AuthState } from '../context/ClinicalAuthProvider';
// import { getRatingDataByUserID } from '../utils/api';

export default function MHeader({props, navigation, name}) {
  const theme = useTheme();
  const handleNavigate = () => {
    navigation.navigate(name)
  }
  return (
    <Card style={styles.shadow} onPress={ handleNavigate }>
      {/* <StatusBar hidden={true} /> */}
      <View style ={{}}>
        <View style={{height: 0, width: 30, borderBottomWidth: 1, }}/>
      </View>
      <Text style={styles.text}>BookSmart™</Text>
      <View style={styles.bottomStyle}></View>
    </Card>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: '#13032f',
    width: '100%',
    top: 0,
    position:'absolute',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingVertical: 10,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  bottomStyle: {
    width: '100%',
    height: 5,
    backgroundColor: "#BC222F"
  },
});
