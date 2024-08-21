import React, { useEffect, useState } from 'react';
import { Alert, View, TextInput, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, PaperProvider, DataTable } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { Updates } from '../../utils/useApi';
import { useAtom } from 'jotai';
import { firstNameAtom as clinicalFirstNameAtom, lastNameAtom as clinicalLastNameAtom, emailAtom as clinicalEmailAtom, passwordAtom as clinicalPasswordAtom } from '../../context/ClinicalAuthProvider';
import { firstNameAtom as adminFirstNameAtom, lastNameAtom as adminLastNameAtom, emailAtom as adminEmailAtom, passInfAtom as adminPasswordAtom } from '../../context/AdminAuthProvider';
import { firstNameAtom as facilityFirstNameAtom, lastNameAtom as facilityLastNameAtom, contactEmailAtom as facilityContactEmailAtom, passwordAtom as facilityPasswordAtom } from '../../context/FacilityAuthProvider';


export default function AccountSettings ({ route, navigation }) {
  const { userRole } = route.params;
  // console.log(userRole);
  

  const [firstName, setFirstName] = useAtom(userRole === 'clinical' ? clinicalFirstNameAtom : userRole === 'admin' ? adminFirstNameAtom : facilityFirstNameAtom);
  const [lastName, setLastName] = useAtom(userRole === 'clinical' ? clinicalLastNameAtom : userRole === 'admin' ? adminLastNameAtom : facilityLastNameAtom);
  const [email, setEmail] = useAtom(userRole === 'clinical' ? clinicalEmailAtom : userRole === 'admin' ? adminEmailAtom : facilityContactEmailAtom);
  const [password, setPassword] = useAtom(userRole === 'clinical' ? clinicalPasswordAtom : userRole === 'admin' ? adminPasswordAtom : facilityPasswordAtom);
  console.log(email, firstName, lastName);
  
  const handleNavigate = (navigateUrl) => {
      navigation.navigate(navigateUrl);
  }
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [emails, setEmails] = useState(email);
  
  // const userInfo = [
  //   {title: 'Name', content: firstName},
  //   {title: 'Email', content: email},
  //   {title: 'User Roles', content: userRole},
  //   {title: 'Caregiver', content: caregiver},
  // ]

  const [credentials, setCredentials] = useState(
    userRole !== 'facilities' ?
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: ''
    } :
    {
      firstName: firstName,
      lastName: lastName,
      contactEmail: email,
      password: ''
    }
  );

  const handleCredentials = (target, e) => {
    setCredentials({...credentials, [target]: e})
    console.log(credentials)
  }

  const handleSubmit = async () => {
    console.log('credential: ', credentials, emails);
    delete credentials.password;
    if (userRole === 'facilities') {
      if(emails !== credentials.contactEmail) {
        credentials.updateEmail = emails;
      }
    }
    else {
      if(emails !== credentials.email) {
        credentials.updateEmail = emails;
      }
    }
    let Data = await Updates(credentials, userRole);
    if (!Data.error) {
      setFirstName(credentials.firstName);
      setLastName(credentials.lastName);
      if (userRole === 'facilities') {
        setEmail(credentials.contactEmail);        
      } else {
        setEmail(credentials.email)
      }
      navigation.goBack();
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
  }

  const showAlert = (content) => {
    Alert.alert(
      'Warning!',
      content,
      [
        {
          text: 'OK',
          onPress: () => {
            setPassword('');
            setConfirmPassword('');
            console.log('OK pressed')
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const handlePasswordSubmit = async () => {
    if (password !== currentPassword ) {
      showAlert('Please enter correct Password');
    }
    else {
      if (credentials.password !== confirmPassword) {
        showAlert('Please enter correct Password');
      } else {
        // setPassword('password', password);
        let updateData = {};
        if (userRole === 'facilities') {
          updateData = {contactEmail: credentials.contactEmail, password: confirmPassword}
        }
        else {
          updateData = {email: credentials.email, password: password}
        }
        let Data = await Updates(updateData, userRole);
        if (!Data.error) {
          setPassword(confirmPassword)
          navigation.goBack();
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
      }
    }
  }

  // const handlePasswordSubmit = () => {

  // }
  return (
      <View style={styles.container}>
        <StatusBar 
          translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <SubNavbar navigation={navigation} name={"ClientSignIn"} />
        <ScrollView style={{width: '100%', marginTop: 139}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authInfo}>
            <Text style={styles.subject}> Account Settings </Text>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Name <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  style={[styles.input, {width: '50%'}]}
                  placeholder="First"
                  onChangeText={e => handleCredentials('firstName', e)}
                  value={credentials.firstName || ''}
                />
                <TextInput
                  style={[styles.input, {width: '50%'}]}
                  placeholder="Last"
                  onChangeText={e => handleCredentials('lastName', e)}
                  value={credentials.lastName || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Email <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={e => { userRole !== 'facilities' ? handleCredentials('email', e) : handleCredentials('contactEmail', e); setEmails(e)}}
                  value={userRole !== 'facilities' ? credentials.email :  credentials.contactEmail || ''}
                />
              </View>
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handleSubmit }>
                Submit
              </HButton>
            </View>
          </View>
          <View style={[styles.authInfo, {marginBottom: 100}]}>
            <Text style={[styles.subject, {marginVertical: 10, marginTop: 20}]}> Change Password </Text>
            <View style={styles.email}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{
                  marginBottom: 10, 
                  // width: 140, 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: 'black'}}> 
                  Password
                </Text>
                <Text style={{color: 'red'}}>*</Text>
              </View>
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
                style={[styles.input, {width: '100%'}]}
                placeholder=" Current Password"
                onChangeText={e => setCurrentPassword(e)}
                value={currentPassword || ''}
              />
            </View>
            <View style={styles.email}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{
                  marginBottom: 10, 
                  // width: 140, 
                  fontSize: 16, 
                  fontWeight: 'bold', 
                  color: 'black'}}> 
                  New Password
                </Text>
                <Text style={{color: 'red'}}>*</Text>
              </View>
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
                style={[styles.input, {width: '100%'}]}
                placeholder="Password"
                onChangeText={e => handleCredentials('password', e)}
                value={credentials.password || ''}
              />
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
                style={[styles.input, {width: '100%'}]}
                placeholder="Confirm Password"
                onChangeText={e => setConfirmPassword(e)}
                // onSubmitEditing={handlePassword} // This handles the "Enter" key press event
                value={confirmPassword || ''}
              />
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handlePasswordSubmit }>
                Submit
              </HButton>
            </View>
          </View>
        </ScrollView>
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
    width: '100%'
  },
  mark: {
    width:225,
    height: 68,
    marginBottom: 30
  },
  bottomBar: {
    height: 5,
    backgroundColor: '#C0D1DD',
    width: '100%'
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  imageButton: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  homepage: {
    // paddingHorizontal: 30,
    // paddingVertical: 70,
    marginLeft: '15%',
    width: 250,
    height: 200,
    marginTop: 30,
    marginBottom: 100
  },
  profile: {
    marginTop: 20,
    width: '84%',
    marginLeft: '7%',
    padding: 20,
    backgroundColor: '#c2c3c42e',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#b0b0b0',
    // elevation: 1,
    // // shadowColor: 'rgba(0, 0, 0, 0.4)',
    // // shadowOffset: { width: 1, height: 1 },
    // shadowRadius: 0,
  },
  titles: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 40,
    width: '40%'
  },
  content: {
    fontSize: 16,
    width: '60%',
    lineHeight: 40,
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
    justifyContent: 'center',
    alignItems: 'center'
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
  