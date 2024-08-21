import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';


export default function ClientFinishSignup ({ navigation }) {
  const handleBack = () => {
    navigation.navigate('ClientSignIn');
  }
  return (
      <View style={styles.container}>
        <StatusBar 
          translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <View style={{width: '100%', height: '60%', marginTop: 99, justifyContent:'center', alignItems: 'center', display: 'flex'}}
        >
          <View style={styles.authInfo}>
            <Text style={[styles.subtitle,{textAlign: 'left', width: '90%', fontWeight: '400', flexWrap: 'wrap'}]}> Your registration is complete! Click the back link to log in.</Text>
            <Text style={{textDecorationLine: 'underline', color: '#2a53c1', marginBottom: 100, textAlign: 'left', width: '90%'}}
              onPress={handleBack}
            >
              Back to 🏚️ Caregiver Home
            </Text>
          </View>
        </View>
        <MFooter />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%',
    backgroundColor: '#cccccc'
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  authInfo: {
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#F2F2F2'
  },
});
  