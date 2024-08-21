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
import { firstNameAtom, lastNameAtom, facilityAcknowledgementAtom, companyNameAtom, contactPhoneAtom, contactPasswordAtom, entryDateAtom, addressAtom,  contactEmailAtom, avatarAtom, userRoleAtom, passwordAtom } from '../../context/FacilityAuthProvider'
import { Signin } from '../../utils/useApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FacilityLogin({ navigation }) {  
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [companyName, setCompanyName] = useAtom(companyNameAtom);
  const [contactPhone, setContactPhone] = useAtom(contactPhoneAtom);
  const [contactPassword, setContactPassword] = useAtom(contactPasswordAtom);
  const [entryDate, setEntryDate] = useAtom(entryDateAtom);
  const [contactEmail, setContactEmail] = useAtom(contactEmailAtom);
  const [avatar, setAvatar] = useAtom(avatarAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [address, setAddress]= useAtom(addressAtom);
  const [password, setPassword] = useAtom(passwordAtom);
  const [facilityAcknowledgement, setFacilityAcknowledgement] = useAtom(facilityAcknowledgementAtom);
  // const navigation = useNavigation(false);
  const theme = useTheme();
  // const { auth, setAuth } = AuthState();
  // const { isAuthenticated } = auth || {};
  const [ credentials, setCredentials ] = useState({
    contactEmail: '',
    password: '',
    userRole: 'Facilities',
  })
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const getCredentials = async() => {
      const emails = (await AsyncStorage.getItem('facilityEmail')) || '';
      const password = (await AsyncStorage.getItem('facilityPassword')) || '';
      setCredentials({...credentials, contactEmail: emails, password: password});
    }
    getCredentials();
  }, [])

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

  const handleSignInNavigate = () => {
    if (credentials.contactEmail === '') {
      showAlert('email')
    }
    else if (credentials.password === '') {
      showAlert('password')
    }
    else {
      navigation.navigate('FacilityPermission');
    }
  }

  const handleSignUpNavigate = () => {
    navigation.navigate('FacilitySignUp');
  }

  const handleSubmit = async () => {
    try {
      const response = await Signin(credentials, 'facilities');
      console.log('SignIn Successful: ', response);
      if (!response.error) {
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setContactEmail(response.user.contactEmail);
        setContactPassword(response.user.contactPassword);
        setContactPhone(response.user.contactPhone);
        setEntryDate(response.user.entryDate);
        setCompanyName(response.user.companyName);
        setAddress(response.user.address);
        setAvatar(response.user.avatar);
        setUserRole(response.user.userRole);
        setFacilityAcknowledgement(response.user.facilityAcknowledgeTerm)
        setPassword(response.user.password);
        if (checked) {
          await AsyncStorage.setItem('facilityEmail', credentials.contactEmail);
          await AsyncStorage.setItem('facilityPassword', credentials.password);
        }
        if (response.user.facilityAcknowledgeTerm) {
          navigation.navigate("FacilityProfile");
        } else {
          handleSignInNavigate("FacilityPermission");
        }
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
              FACILITIES
            </HButton>
            <Text style={[styles.subtitle, { color: '#2a53c1', width: '90%', textAlign: 'center'}]}>Register or Enter your email address and password to login.</Text>
          </View>
          <View style={styles.authInfo}>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Email Address </Text>
              <TextInput
                style={{ backgroundColor: 'white', height: 40, marginBottom: 10, borderWidth: 1, borderColor: 'hsl(0, 0%, 86%)'}}
                placeholder=""
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={e => handleCredentials('contactEmail', e)}
                value={credentials.contactEmail || ''}
              />
            </View>
            <View style={styles.password}>
              <View style={{flexDirection: 'row', alignItems: 'bottom'}}>
                <Text style={styles.subtitle}> Password </Text>
                <TouchableOpacity
                  onPress={() => console.log('Navigate to forget password')}>
                  <Text
                    style={[styles.subtitle, { color: '#2a53c1'}]}
                    onPress={() => navigation.navigate('FacilityForgotPwd')}>
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
            onPress={() => navigation.navigate('Home')}
            style={styles.drinksButton}>
            Main Home
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
    borderWidth: 3,
    borderColor: 'white',
    // borderRadius: 10,
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
