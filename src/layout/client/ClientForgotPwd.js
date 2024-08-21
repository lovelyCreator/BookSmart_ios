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
import { ForgotPassword } from '../../utils/useApi';


export default function ClientForgotPwd ({ navigation }) {
  const [email, setEmail] = useAtom(emailAtom);
  const handleNavigate = (navigateUrl) => {
      navigation.navigate(navigateUrl);
  }

  const [credentials, setCredentials] = useState(
    {
      email: '',
    }
  );

  const handleCredentials = (target, e) => {
    setCredentials({...credentials, [target]: e})
    console.log(credentials)
  }

  const handleSubmit = async () => {
    console.log('email: ', email)
    const response = await ForgotPassword(credentials, 'clinical');
    console.log(response)
    if (!response.error) {
      console.log('success');
      setEmail(credentials.email);      
      console.log(credentials.email);
      
      navigation.navigate('ClientPassVerify')
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
            <Text style={styles.subject}> Forgot Password? </Text>
            <Text style={[styles.subtitle,{textAlign: 'left', width: '90%', fontWeight: '400'}]}> Enter your email address below and we will send you a link to reset your password. </Text>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Email Address </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={e => handleCredentials('email', e)}
                  value={credentials.email || ''}
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
  