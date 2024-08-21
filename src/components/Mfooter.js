import React, { useEffect, useState } from 'react';

import { View, Image, StyleSheet, StatusBar, Text, KeyboardAvoidingView } from 'react-native';
import images from '../assets/images';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AuthState } from '../context/ClinicalAuthProvider';
// import { getRatingDataByUserID } from '../utils/api';

export default function MFooter(props) {
  const theme = useTheme();
  // const { auth } = AuthState();
  // const { isAuthenticated } = auth || {};
  // const [filterData, setFilterData] = useState([]);
  // const [suggestionRating, setSuggestionRating] = useState({});
  // const [loadingState, setLoadingState] = useState(true);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     getRatingDataByUserID().then(response => {
  //       setSuggestionRating(response.suggestionRating);
  //       setFilterData(response.locations);
  //       setLoadingState(false);
  //     });
  //   }
  // }, [isAuthenticated]);

  return (
    <View style={styles.shadow}>
      {/* <StatusBar hidden={true} /> */}
      <View style={styles.bottomStyle}></View>
      <Text style={styles.text}>Support by Email: support@whybookdub.com{'\n'}
        Support by Text: 716.997.9990
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: '#13032f',
    bottom: 0,
    width: '100%',
    position: 'absolute',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '700',
  },
  bottomStyle: {
    width: '100%',
    height: 5,
    backgroundColor: "#BC222F"
  },
  logo: {
    width: 70,
    height: 59,
  },
});
