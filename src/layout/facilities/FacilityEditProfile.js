import { Alert, StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, Modal, StatusBar, Button } from 'react-native';
import React, { useState } from 'react';
import images from '../../assets/images';
import { Divider, TextInput, ActivityIndicator, useTheme, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HButton from '../../components/Hbutton';
import MHeader from '../../components/Mheader';
import MFooter from '../../components/Mfooter';
import PhoneInput from 'react-native-phone-input';
import SignatureCapture from 'react-native-signature-capture';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';
import { Signup, Update } from '../../utils/useApi';
import MSubNavbar from '../../components/MSubNavbar';
import RNFS from 'react-native-fs';
import { useAtom } from 'jotai';
import { firstNameAtom, lastNameAtom, companyNameAtom, contactPhoneAtom, contactPasswordAtom, entryDateAtom, addressAtom,  contactEmailAtom, avatarAtom, userRoleAtom, passwordAtom } from '../../context/FacilityAuthProvider'


export default function FacilityEditProfile({ navigation }) {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [companyName, setCompanyName] = useAtom(companyNameAtom);
  const [contactPhone, setContactPhone] = useAtom(contactPhoneAtom);
  const [contactPassword, setContactPassword] = useAtom(contactPasswordAtom);
  const [contactEmail, setContactEmail] = useAtom(contactEmailAtom);
  const [avatar, setAvatar] = useAtom(avatarAtom);
  const [userRole, setUserRole]= useAtom(userRoleAtom);
  const [address, setAddress]= useAtom(addressAtom);

  const theme = useTheme();

  //--------------------------------------------Credentials-----------------------------
  const [ credentials, setCredentials ] = useState({
    firstName: firstName,
    lastName: lastName,
    contactEmail: contactEmail,
    contactPassword: contactPassword,
    contactPhone: contactPhone,
    companyName: companyName,
    birthday: Date("07/24/2024"),
    socialSecurityNumber: '123123123',
    address: address,
    avatar: avatar,
  })

  const handleCredentials = (target, e) => {
    if (target !== "street" && target !== "street2" && target !== "city" && target !== "state" && target !== "zip") {
      setCredentials({...credentials, [target]: e});
    }
    else {
      setCredentials({...credentials, address: {...credentials.address, [target]: e}})
    }
    console.log(credentials);
  }

  //-------------------------------------------ComboBox------------------------
  const placeholder = {
    label: 'Select an item...',
    value: null,
  };
  const items = [
    { label: 'CNA', value: 'CNA' },
    { label: 'LPN', value: 'LPN' },
    { label: 'RN', value: 'RN' },
  ];

  const [showModal, setShowModal] = useState(false);
  const handleItemPress = (text) => {
    handleCredentials('title', text);
    setShowModal(false);
  }

  //-------------------------------------------File Upload----------------------------
  const pickFile = async () => {
    try {
      console.log("picker")
      let type = [DocumentPicker.types.images, DocumentPicker.types.pdf]; // Specify the types of files to pick (images and PDFs)
      const res = await DocumentPicker.pick({
        type: type,
      });
  
      const fileContent = await RNFS.readFile(res[0].uri, 'base64');
          // Determine the file type based on the MIME type
      let fileType;
      if (res[0].type === 'application/pdf') {
        fileType = 'pdf';
      } else if (res[0].type.startsWith('image/')) {
        fileType = 'image';
      } else {
        // Handle other file types if needed
        fileType = 'unknown';
      }
  
      handleCredentials('avatar', {content: `data:${res.type};base64,${fileContent}`, type: fileType, name: res[0].name});
      console.log("name",credentials.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Handle other errors
      }
    }
  };

  const [checked, setChecked] = useState(false);
  
  const handleToggle = () => {
    setChecked(!checked);
  };
  
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
    const formattedNumber = formatPhoneNumber(text);
    handleCredentials('contactPhone', formattedNumber);
  };
  const handleSignUpNavigate = () => {
    navigation.navigate('ClientPending');
  }

  const handleBack = () => {
    navigation.navigate('MyProfile');
  }

    //Alert
  const showAlerts = (name) => {
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

  const handleSubmit = async () => {
    if (credentials.contactEmail === '' || 
      credentials.firstName === '' || 
      credentials.lastName ==='') {
        showAlerts('all gaps')
    }
    else {
      try {
        console.log('credentials: ', credentials);
        const response = await Update(credentials, "facilities");
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setContactEmail(response.user.contactEmail);
        setContactPhone(response.user.contactPhone);
        setCompanyName(response.user.companyName);
        setAddress(response.user.address);
        setAvatar(response.user.avatar);
        console.log('Signup successful: ', response)
        navigation.navigate('FacilityProfile');
      } catch (error) {
        console.error('Signup failed: ', error)
      }
    }
  }

  const handleRemove = (name) => {
    handleCredentials(name, {type: "", content: "", name: ""});
  }
  return (
    <View style={styles.container}>
      <StatusBar 
        translucent backgroundColor="transparent"
      />
      <MHeader navigation={navigation}/>
      <MSubNavbar navigation={navigation} name={"Facilities"} />
      <ScrollView style = {styles.scroll}    
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.authInfo}>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Company Name </Text>
                <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder="Last"
                  onChangeText={e => handleCredentials('lastName', e)}
                  value={credentials.companyName || ''}
                />
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Contact Name <Text style={{color: 'red'}}>*</Text> </Text>
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
              <Text style={styles.subtitle}> Contact Email <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onChangeText={e => handleCredentials('contactEmail', e)}
                  value={credentials.contactEmail || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Contact Phone <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  value={credentials.contactPhone}
                  style={[styles.input, {width: '100%'}]}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  placeholder={credentials.contactPhone}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Address </Text>
              <View style={{flexDirection: 'column', width: '100%', gap: 5}}>
                <View style={{width: '100%', marginBottom: 10}}>
                  <TextInput
                    style={[styles.input, {width: '100%', marginBottom: 0}]}
                    placeholder=""
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={e => handleCredentials('street', e)}
                    value={credentials.address.street || ''}
                  />
                  <Text>Street Address</Text>
                </View>
                <View style={{width: '100%', marginBottom: 10}}>
                  <TextInput
                    style={[styles.input, {width: '100%', marginBottom: 0}]}
                    placeholder=""
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={e => handleCredentials('street2', e)}
                    value={credentials.address.street2 || ''}
                  />
                  <Text>Street Address2</Text>
                </View>
                <View style={{flexDirection: 'row', width: '100%', gap: 5, marginBottom: 30}}>
                  <View style={[styles.input, {width: '45%'}]}>
                    <TextInput
                      placeholder=""
                      style={[styles.input, {width: '100%', marginBottom: 0}]}
                      onChangeText={e => handleCredentials('city', e)}
                      value={credentials.address.city || ''}
                    />
                    <Text>City</Text>
                  </View>
                  <View style={[styles.input, {width: '20%'}]}>
                    <TextInput
                      placeholder=""
                      style={[styles.input, {width: '100%', marginBottom: 0}]}
                      onChangeText={e => handleCredentials('state', e)}
                      value={credentials.address.state || ''}
                    />
                    <Text>State</Text>
                  </View>
                  <View style={[styles.input, {width: '30%'}]}>
                    <TextInput
                      placeholder=""
                      style={[styles.input, {width: '100%', marginBottom: 0}]}
                      // keyboardType="numeric" // Set the keyboardType to "numeric" for zip input
                      onChangeText={e => handleCredentials('zip', e)}
                      value={credentials.address.zip || ''}
                    />
                    <Text>Zip</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Logo / Pic </Text>
              {credentials.avatar.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.avatar.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('avatar')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile()} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.avatar.name || ''}
                />
              </View>
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handleSubmit }>
                Submit
              </HButton>
            </View>
          </View>
        </View>
      </ScrollView>
      <MFooter />
    </View>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    // paddingVertical: 4,
    // paddingHorizontal: 10,
    borderRadius: 4,
    color: 'black',
    // paddingRight: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'hsl(0, 0%, 86%)',
    margin: 0,
  },
  inputAndroid: {
    fontSize: 8,
    // paddingHorizontal: 10,
    // paddingVertical: 0,
    margin: 0,
    borderRadius: 10,
    color: 'black',
    // paddingRight: 30,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'hsl(0, 0%, 86%)',
  },
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    backgroundColor: 'red',
    padding: 20,
  },
  container: {
    marginBottom: 0,
    backgroundColor: '#fffff8'
  },
  scroll: {
    marginTop: 151,
  },
  backTitle: {
    backgroundColor: 'black',
    width: '90%',
    height: 55,
    marginLeft: '5%',
    position: 'absolute',
    marginTop: 10,
    borderRadius: 10
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginLeft: '5%',
    padding: 15,
    width: '90%',
    backgroundColor: 'transparent'
  },
  bottomBar: {
    marginTop: 20,
    height: 5,
    backgroundColor: '#C0D1DD',
    width: '100%'
  },
  profileTitleBg: {
    backgroundColor: '#BC222F',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginLeft: '10%',
    marginVertical: 20
  },
  profileTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  marker: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    marginRight: 10,
    marginTop: 17
  },
  text: {
    fontSize: 14,
    color: 'hsl(0, 0%, 29%)',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24
  },
  modal: {
    width: '90%',
    borderRadius: 10,
    margin: '5%',
    // marginBottom: 100,
    borderWidth: 1,
    borderColor: 'grey',
    overflow: 'hidden',
    shadowColor: 'black', // Shadow color
    shadowOffset: { width: 0, height: 10 }, // Shadow offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 3, // Shadow radius
    elevation: 0, // Elevation for Android devices
    backgroundColor: "#e3f6ff",
  },
  intro: {
    marginTop: 30
  },
  input: {
    backgroundColor: 'white', 
    height: 30, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'hsl(0, 0%, 86%)',
  },
  subject: {
    padding: 5,
    backgroundColor: '#77f9ff9c',
    borderRadius: 2,
    borderColor: 'black',
    width: '80%',
    color: 'black',
    fontWeight: 'bold',
    marginTop: 30,
    marginLeft: '10%',
    fontSize: 20,
    borderRadius: 5,
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
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
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
    marginBottom: 50,
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
    borderWidth: 3,
    borderColor: 'white',

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
  signature: {
    flex: 1,
    width: '100%',
    height: 150,
  },
  chooseFile: {
    width: '30%', 
    height: 30, 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: 'black'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    width: '60%',
    height: '30%',
    marginLeft: '20',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: 20
  },
});
