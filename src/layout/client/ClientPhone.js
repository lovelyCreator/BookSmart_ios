import React, { useEffect, useState } from 'react';
import { Alert, View, TextInput, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, PaperProvider, DataTable } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import { useAtom } from 'jotai';
import { emailAtom } from '../../context/ClinicalAuthProvider';
import { verifyPhoneAtom, deviceNumberAtom } from '../../context/BackProvider';
import { PhoneSms } from '../../utils/useApi';


export default function ClientPhone ({ navigation }) {
  const [verifyPhone, setVerifyPhone] = useAtom(verifyPhoneAtom);
  const [device, setDevice] = useAtom(deviceNumberAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const handleNavigate = (navigateUrl) => {
      navigation.navigate(navigateUrl);
  }

  const [credentials, setCredentials] = useState(
    {
      phoneNumber: '',
    }
  );
  
  const handleCredentials = (target, e) => {
    console.log(target, e, '-----------');
    
    setCredentials({...credentials, [target]: e})
    console.log(credentials)
  }


  //------------------------------------------Phone Input----------------
  const formatPhoneNumber = (input) => {
    // Remove all non-numeric characters from the input
    const cleaned = input.replace(/\D/g, '');

    // If the cleaned input has 1 or 2 characters, return it as is
    if (cleaned.length === 1 || cleaned.length === 2) {
        return cleaned;
    }

    // Apply the desired phone number format
    let formattedNumber = '';
    if (cleaned.length >= 3) {
        formattedNumber = `(${cleaned.slice(0, 3)})`;
    }
    if (cleaned.length > 3) {
        formattedNumber += ` ${cleaned.slice(3, 6)}`;
    }
    if (cleaned.length > 6) {
        formattedNumber += `-${cleaned.slice(6, 10)}`;
    }
    return formattedNumber;
  };
  const handlePhoneNumberChange = (text) => {
    console.log(text)
    const formattedNumber = formatPhoneNumber(text);
    console.log(formattedNumber);
    handleCredentials('phoneNumber', formattedNumber);
  };

  const handleSubmit = async () => {
    // console.log('email: ', email)
    if (credentials.phoneNumber) {
      const response = await PhoneSms({phoneNumber: credentials.phoneNumber, email: email}, 'clinical');
      console.log(response)
      if (!response.error) {
        console.log('success');
        setVerifyPhone(credentials.phoneNumber);      
        console.log(credentials.phoneNumber);
        
        navigation.navigate('ClientPhoneVerify')
      }
      else {
        Alert.alert(
          'Failed!',
          `${response.error}`,
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('OK pressed')
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  }
  const handleBack = () => {
    navigation.navigate('ClientSignIn');
  }
  return (
      <View style={styles.container}>
        <StatusBar 
          translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <View style={{width: '100%', height: '60%', marginTop: 110, justifyContent:'center', alignItems: 'center', display: 'flex'}}
        >
          <View style={styles.authInfo}>
            <Text style={styles.subject}> 2FA Authentication </Text>
            <Text style={[styles.subtitle,{textAlign: 'left', width: '90%', fontWeight: '400'}]}> Enter your phone number below and we will send you a verify code to login the site. </Text>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Phone Number </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  placeholder=""
                  value={credentials.phoneNumber}
                  style={[styles.input, {width: '100%'}]}
                  onChangeText={(e) =>handlePhoneNumberChange(e)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handleSubmit }>
                Submit
              </HButton>
            </View>
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
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'white', 
    height: 30, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'hsl(0, 0%, 86%)',
    paddingVertical: 5
  },
  subject: {
    borderRadius: 2,
    borderColor: 'black',
    width: '90%',
    color: 'black',
    marginTop: 30,
    fontSize: 24,
    borderRadius: 5,
  },
  email: {
    width: '90%',
  },
  authInfo: {
    display:'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    marginTop: 140
  },
  btn: {flexDirection: 'column',
    gap: 20,
    marginBottom: 30,
    width: '90%'
  },
  subBtn: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#447feb',
    color: 'black',
    fontSize: 16,
  },
});
  