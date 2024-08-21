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
import { firstNameAtom, lastNameAtom, addressAtom, socialSecurityNumberAtom, entryDateAtom, birthdayAtom, phoneNumberAtom, signatureAtom, titleAtom, emailAtom, photoImageAtom, userRoleAtom, passwordAtom } from '../../context/ClinicalAuthProvider'
import { Signin } from '../../utils/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { getUniqueId, getManufacturer } from 'react-native-device-info';
import { useFocusEffect } from '@react-navigation/native';
import { deviceNumberAtom } from '../../context/BackProvider';

export default function ClientSignIn({ navigation }) {  
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [birthday, setBirthday] = useAtom(birthdayAtom);
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [signature, setSignature] = useAtom(signatureAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [photoImage, setPhotoImage] = useAtom(photoImageAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [entryDate, setEntryDate] = useAtom(entryDateAtom);
  const [socialSecurityNumber, setSocialSecurityNumber] = useAtom(socialSecurityNumberAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [deviceNum, setDeviceNum] = useAtom(deviceNumberAtom);
  // const navigation = useNavigation(false);
  const theme = useTheme();
  // const { auth, setAuth } = AuthState();
  // const { isAuthenticated } = auth || {};
  const [ credentials, setCredentials ] = useState({
    email: '',
    password: '',
    userRole: 'Clinicians',
    device: '',
  })

  
  const [uniqueId, setUniqueId] = useState('');
  const [manufacturer, setManufacturer] = useState('');

  const fetchDeviceInfo = async () => {
    console.log('getInfo')
    try {
      console.log('DeviceId');
        // Get the unique device ID
        const id = await getUniqueId();
        setUniqueId(id);
        console.log(credentials, '.....');
        
        // Get the manufacturer of the device
        const manu = await getManufacturer();
        setManufacturer(manu);
    } catch (error) {
        console.error('Error fetching device info:', error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      fetchDeviceInfo();
    }, []) // Empty dependency array means this runs on focus
  );
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
  
  const handleToggle = async () => {
    setChecked(!checked);
  };

  useEffect(() => {
    const getCredentials = async() => {
      const emails = (await AsyncStorage.getItem('clinicalEmail')) || '';
      const password = (await AsyncStorage.getItem('clinicalPassword')) || '';
      setCredentials({...credentials, email: emails, password: password});
    }
    getCredentials();
  }, [])

  const handleCredentials = (target, e) => {
    setCredentials({...credentials, [target]: e});
    // console.log(credentials);
  }

  const handleSignInNavigate = (url) => {
    if (credentials.email === '') {
      showAlert('email')
    }
    else if (credentials.password === '') {
      showAlert('password')
    }
    else {
      // navigation.navigate('MyHome');
      navigation.navigate(url);
    }
  }

  const handleSignUpNavigate = () => {
    navigation.navigate('ClientSignUp');
  }

  const handleSubmit = async () => {
    try {
      setCredentials({...credentials, ["device"]: uniqueId});
      console.log(credentials.device,uniqueId, "Deciveddd")
      const response = await Signin(credentials, 'clinical');
      console.log('SignIn Successful: ', response.phoneAuth);
      if (!response.error) {
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setBirthday(response.user.birthday);
        setPhoneNumber(response.user.phoneNumber);
        setSignature(response.user.signature);
        setEmail(response.user.email);
        setTitle(response.user.title);
        setPhotoImage(response.user.photoImage);
        setUserRole(response.user.userRole);
        setEntryDate(response.user.entryDate);
        setSocialSecurityNumber(response.user.socialSecurityNumber)
        setAddress(response.user.address)
        setPassword(response.user.password);
        setDeviceNum(uniqueId);
        if (checked) {
          await AsyncStorage.setItem('clinicalEmail', credentials.email);
          await AsyncStorage.setItem('clinicalPassword', credentials.password);
        }
        // console.log('credentials:', credentials)
        console.log(response.phoneAuth, "-----------------------------");
        
        if (response.phoneAuth) {
          console.log(response.phoneAuth);
          
          handleSignInNavigate('ClientPhone');
        }
        else {
          console.log('welcome')
          handleSignInNavigate('MyHome');
        }
        // console.log('email:', storage)
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
              source={images.mark}
              resizeMode="cover"
              style={styles.mark}
            />
            <Text style={styles.title}>WHY BOOK DUMB?</Text>
            <Image
              source={images.homepage}
              resizeMode="cover"
              style={styles.homepage}
            />
            <Text style={styles.text}>Let your licensure and certifications pay off. {'\n'}
              Get the money you deserver by signing up {'\n'}
              and becoming a freelance clinclan today!
            </Text>
          </View>
          <View style={styles.authInfo}>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Email Address </Text>
              <TextInput
                style={{ backgroundColor: 'white', height: 40, marginBottom: 10, borderWidth: 1, borderColor: 'hsl(0, 0%, 86%)'}}
                placeholder=""
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
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
                    onPress={() => navigation.navigate('ClientForgotPwd')}>
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
              <Text style={styles.middleText}>Need an account?</Text>
              <HButton style={styles.subBtn} onPress={ handleSignUpNavigate }>
                Sign Up
              </HButton>
            </View>
          </View>
        </View>
        <View style={styles.buttonWrapper}>
          <HButton
            onPress={() => navigation.navigate('AdminLogin')}
            style={styles.drinksButton}>
            Admin Login
          </HButton>
          <HButton
            onPress={() => navigation.navigate('FacilityLogin')}
            style={styles.drinksButton}>
            Facilities Home
          </HButton>
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
  },
  scroll: {
    marginTop: 97,
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
  },
  topBar: {
    width: '100%',
    height: 20,
    backgroundColor: 'hsl(0, 0%, 29%)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  intro: {
    marginTop: 30
  },
  mark: {
    width: '70%',
    height: 75,
    marginLeft: '15%',
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
    fontSize: 16,
    padding: 15,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 0

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
});
