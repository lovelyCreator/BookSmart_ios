import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, PaperProvider } from 'react-native-paper';
import images from '../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../components/Hbutton'
import MFooter from '../components/Mfooter';
import MHeader from '../components/Mheader';
export default function Dashboard ({ navigation }) {
    const handleClient = () => {
        navigation.navigate('ClientSignIn')
    }
    
    const handleFacility = () => {
        navigation.navigate('FacilityLogin')
    }

  return (
      <View style={styles.container}>
        <StatusBar 
            translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <Text style={styles.text}>
          Welcome to the BookSmart App {'\n'} where you make what you deserve!
        </Text>
        <Image
          source={images.homepage}
          resizeMode="cover"
          style={styles.homepage}
        />
          <Text style={styles.text}>Are you looking to work or to hire?</Text>
          <View style={styles.buttonWrapper}>
          <HButton
            onPress={ handleClient }
            style={styles.drinksButton}>
            CLINICIAN
          </HButton>
          <HButton
            onPress={ handleFacility }
            style={styles.drinksButton}>
            FACILITY
          </HButton>
        </View>
        <MFooter />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  homepage: {
    // paddingHorizontal: 30,
    // paddingVertical: 70,
    width: 350,
    height: 300,
    marginTop: 30,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  }
});
  