import { StyleSheet, View, Alert, Text, ScrollView, TouchableOpacity, Pressable, Image, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { CheckBox } from 'react-native-elements';
import images from '../../assets/images';
import { Divider, TextInput, ActivityIndicator, useTheme, Card } from 'react-native-paper';
import { AuthState } from '../../context/ClinicalAuthProvider';
import { useNavigation } from '@react-navigation/native';
import HButton from '../../components/Hbutton';
import MHeader from '../../components/Mheader';
import MFooter from '../../components/Mfooter';
import { useAtom } from 'jotai';
import { firstNameAtom, lastNameAtom, phoneAtom, emailAtom, photoImageAtom, userRoleAtom, companyNameAtom, addressAtom, passInfAtom } from '../../context/AdminAuthProvider'
import { Signin } from '../../utils/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminLogin({ navigation }) {  
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [photoImage, setPhotoImage] = useAtom(photoImageAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [phone, setPhone] = useAtom(phoneAtom);
  const [companyName, setCompanyName] = useAtom(companyNameAtom);
  const [address, setAddress]= useAtom(addressAtom);
  const [password, setPassword] = useAtom(passInfAtom)
  // const navigation = useNavigation(false);
  const theme = useTheme();
  // const { auth, setAuth } = AuthState();
  // const { isAuthenticated } = auth || {};
  const [ credentials, setCredentials ] = useState({
    email: '',
    password: '',
    userRole: 'Admin',
  })

  useEffect(() => {
    const getCredentials = async() => {
      const emails = (await AsyncStorage.getItem('AdminEmail')) || '';
      const password = (await AsyncStorage.getItem('AdminPassword')) || '';
      setCredentials({...credentials, email: emails, password: password});
    }
    getCredentials();
  }, []);

  const [checked, setChecked] = useState(false);

  //Alert
  const showAlert = (name) => {
    Alert.alert(
      'Warning!',
      `You have to input ${name}!`,
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
  };
  
  const handleToggle = () => {
    setChecked(!checked);
  };

  const handleCredentials = (target, e) => {
    setCredentials({...credentials, [target]: e});
    console.log(credentials);
  }

  const handleSignInNavigate = async () => {
    if (credentials.email === '') {
      showAlert('email')
    }
    else if (credentials.password === '') {
      showAlert('password')
    }
    else {
      // const response = 
      navigation.navigate('AdminHome');
    }
  }

  const handleSignUpNavigate = () => {
    navigation.navigate('ClientSignUp');
  }

  const handleSubmit = async () => {
    try {
      const response = await Signin(credentials, 'Admin');
      console.log('SignIn Successful: ', response);
      if (!response.error) {
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setAddress(response.user.address);
        setCompanyName(response.user.companyName);
        setUserRole(response.user.userRole);
        setEmail(response.user.email);
        setPhone(response.user.phone);
        setPassword(response.user.password);
        
        // setTitle(response.data.title);
        // setPhotoImage(response.user.photoImage);
        if (checked) {
          await AsyncStorage.setItem('AdminEmail', credentials.email);
          await AsyncStorage.setItem('AdminPassword', credentials.password);
        }
        handleSignInNavigate();
      }
      else {
        Alert.alert(
          'Failed!',
          `${response.error.message}`,
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
    } catch (error) {
      console.log('SignIn failed: ', error)
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar 
          translucent backgroundColor="transparent"
      />
      <MHeader navigation={navigation}/>
      <ScrollView style = {styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.topBar} />
          <View style={styles.intro}>
            <Image
              source={images.admin}
              resizeMode="contain"
              style={styles.mark}
            />
            <Text style={styles.title}>WHERE CARE MEETS CONNECTION</Text>
            <HButton
              // onPress={() => navigation.navigate('ClientSignIn')}
              style={styles.drinksButton}>
              Admin Login
            </HButton>
            <Text style={[styles.subtitle, { color: '#2a53c1', width: '90%', textAlign: 'center'}]}>Enter your email address and password to login.</Text>
          </View>
          <View style={styles.authInfo}>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Email Address </Text>
              <TextInput
                style={{ backgroundColor: 'white', height: 40, marginBottom: 10, borderWidth: 1, borderColor: 'hsl(0, 0%, 86%)'}}
                placeholder=""
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={e => handleCredentials('email', e)}
                value={credentials.email || ''}
              />
            </View>
            <View style={styles.password}>
              <View style={{flexDirection: 'row', alignItems: 'bottom'}}>
                <Text style={styles.subtitle}> Password </Text>
                <TouchableOpacity
                  onPress={() => console.log('Navigate to forget password')}>
                  <Text
                    style={[styles.subtitle, { color: '#2a53c1'}]}
                    onPress={() => navigation.navigate('AdminForgotPwd')}>
                    {'('}forgot?{')'}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={{ backgroundColor: 'white', height: 40, borderWidth: 1, borderColor: 'hsl(0, 0%, 86%)'}}
                placeholder=""
                onChangeText={e => handleCredentials('password', e)}
                secureTextEntry={true}
                value={credentials.password || ''}
              />
              <Pressable 
                onPress={handleToggle}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 10,
                  marginTop: 10
                }}>
                <View style={styles.checkbox}>
                  {checked && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.middleText}>Remember me</Text>
              </Pressable>
            </View>
            <View style={styles.btn}>
              <HButton style={styles.subBtn} onPress={ 
                handleSubmit 
                // handleSignInNavigate
              }>
                Sign In
              </HButton>
            </View>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ClientSignIn')}
            style={styles.homeBtn}
          >
            <Image source={images.homeIcon} style={{width: 20, height: 20}}/>
            <Text style={styles.homeText}>Home</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
      <MFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: 'red',
    padding: 20,
  },
  container: {
    marginBottom: 0,
    backgroundColor: '#777777'
  },
  scroll: {
    marginTop: 99,
  },
  modal: {
    width: '90%',
    borderRadius: 10,
    margin: '5%',
    borderWidth: 1,
    borderColor: 'grey',
    overflow: 'hidden',
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 3, // Shadow radius
    elevation: 0, // Elevation for Android devices
    backgroundColor: '#f2f2f2'
  },
  topBar: {
    width: '100%',
    height: 20,
    backgroundColor: 'hsl(0, 0%, 29%)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  intro: {
    marginTop: 30,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mark: {
    width: 150,
    height: 150,
  },
  homepage: {
    // paddingHorizontal: 30,
    // paddingVertical: 70,
    width: '45%',
    height: 130,
    marginTop: 10,
    marginLeft: '25%',
  },
  text: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
  },
  middleText: {
    fontSize: 16,
    margin: 0,
    lineHeight: 16,
    color: 'black'
  },
  authInfo: {
    marginLeft: 20,
    marginRight: 20,

  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 130
  },
  btn: {flexDirection: 'column',
    gap: 20,
    marginBottom: 30,
  },
  subBtn: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#447feb',
    color: 'black',
    fontSize: 16,
  },
  drinksButton: {
    fontSize: 18,
    padding: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'white',
    // borderRadius: 5
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#000',
  },
  homeBtn: {
    marginTop: 20,
    backgroundColor: 'black',
    borderRadius: 30,
    borderColor: 'white',
    borderWidth: 2,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  homeText: {
    color: 'white',
    fontSize: 18
  }
});
