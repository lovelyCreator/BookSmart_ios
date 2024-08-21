import { Alert, Animated, Easing, StyleSheet, Pressable, View, Text, ScrollView, TouchableOpacity, Modal, StatusBar, Button } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import images from '../../assets/images';
import { TextInput, useTheme, } from 'react-native-paper';
import { AuthState, firstNameAtom, lastNameAtom, socialSecurityNumberAtom, verifiedSocialSecurityNumberAtom } from '../../context/ClinicalAuthProvider';
import { useNavigation } from '@react-navigation/native';
import HButton from '../../components/Hbutton';
import MHeader from '../../components/Mheader';
import MFooter from '../../components/Mfooter';
import PhoneInput from 'react-native-phone-input';
import SignatureCapture from 'react-native-signature-capture';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'
import { Signup } from '../../utils/useApi';

export default function FacilitySignUp({ navigation }) {
  //---------------------------------------Animation of Background---------------------------------------
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    const increaseAnimation = Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const decreaseAnimation = Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true,
    });

    const sequenceAnimation = Animated.sequence([increaseAnimation, decreaseAnimation]);

    Animated.loop(sequenceAnimation).start();
  }, [fadeAnim]);

  const theme = useTheme();

  //--------------------------------------------Credentials-----------------------------
  const [credentials, setCredentials] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    contactEmail: '',
    password: '',
    contactPhone: '',
    address: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
    },
    avatar: {
      type: '',
      content: '',
      name: ''
    },
    password: '',
    contactPassword: '',
    signature: '',
    userRole: 'Facilities'
  })

  const handleCredentials = (target, e) => {
    if (target !== "street" && target !== "street2" && target !== "city" && target !== "state" && target !== "zip") {
      setCredentials({ ...credentials, [target]: e });
    }
    else {
      setCredentials({ ...credentials, address: { ...credentials.address, [target]: e } })
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
  const [selectedValue, setSelectedValue] = useState('Selected Value...');

  const handleTitle = (target, e) => {
    handleCredentials(target, e);
    setSelectedValue(e)
  }
  const [showModal, setShowModal] = useState(false);
  const handleItemPress = (text) => {
    handleCredentials('title', text);
    setShowModal(!showModal);
  }
  const handleTitles = () => {
    setShowModal(!showModal);
  }

  //-------------------------------------------Date Picker---------------------------------------
  const [birthday, setBirthday] = useState(new Date());
  const [showCalender, setShowCalendar] = useState(false);
  const handleDayChange = (target, day) => {
    setBirthday(day);
    handleCredentials(target, day);
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

      handleCredentials('avatar', { content: `data:${res.type};base64,${fileContent}`, type: fileType, name: res[0].name });
      console.log("name", credentials.name);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Handle other errors
      }
    }
  };

  //--------------------------------------------password--------------------------
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //Alert
  const showAlert = () => {
    Alert.alert(
      'Warning!',
      "The Password doesn't matched. Please try again.",
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

  const handlePassword = () => {
    if (password !== confirmPassword) {
      showAlert();
    }
    else {
      handleCredentials('password', password);
    }
  }

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
    console.log(text);
    
    const formattedNumber = formatPhoneNumber(text);
    console.log(formattedNumber);
    
    handleCredentials('contactPhone', formattedNumber);
  };
  const handleSignUpNavigate = () => {
    navigation.navigate('FacilityPending');
  }

  const handleBack = () => {
    navigation.navigate('FacilityLogin');
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
    handlePassword();
    if (credentials.contactEmail === '' ||
      credentials.firstName === '' ||
      credentials.lastName === '' ||
      credentials.contactPhone === '' ||
      credentials.password === ''
    ) {
      showAlerts('all gaps')
    }
    else {
      try {
        console.log('credentials: ', credentials);
        const response = await Signup(credentials, "facilities");
        console.log('Signup successful: ', response)
        navigation.navigate('FacilityFinishSignup');
      } catch (error) {
        console.error('Signup failed: ', error)
      }
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar
        translucent backgroundColor="transparent"
      />
      <MHeader navigation={navigation} />
      <ScrollView style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.intro}>
            <View style={styles.backTitle} />
            <Animated.View
              style={[styles.backTitle, { opacity: fadeAnim, backgroundColor: '#0f00c4' },]
              }>
            </Animated.View>
            <Text style={styles.title}>FACILITIES REGISTER HERE!</Text>
          </View>
          <View style={styles.authInfo}>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Company Name </Text>
              <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>
                <TextInput
                  style={[styles.input, { width: '100%' }]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={e => handleCredentials('companyName', e)}
                  value={credentials.companyName || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Contact Name <Text style={{ color: 'red' }}>*</Text> </Text>
              <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>
                <TextInput
                  style={[styles.input, { width: '50%' }]}
                  placeholder="First"
                  onChangeText={e => handleCredentials('firstName', e)}
                  value={credentials.firstName || ''}
                />
                <TextInput
                  style={[styles.input, { width: '50%' }]}
                  placeholder="Last"
                  onChangeText={e => handleCredentials('lastName', e)}
                  value={credentials.lastName || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Contact Email <Text style={{ color: 'red' }}>*</Text> </Text>
              <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>
                <TextInput
                  style={[styles.input, { width: '100%' }]}
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
              <Text style={styles.subtitle}> Contact Phone <Text style={{ color: 'red' }}>*</Text> </Text>
              <View style={{ flexDirection: 'row', width: '100%', gap: 5 }}>
                <TextInput
                  value={credentials.contactPhone}
                  style={[styles.input, {width: '100%'}]}
                  onChangeText={e => handlePhoneNumberChange(e)}
                  keyboardType="phone-pad"
                  placeholder=""
                />
              </View>
            </View>
            <View style={styles.password}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{
                  backgroundColor: 'yellow',
                  marginBottom: 10,
                  // width: 140, 
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'black'
                }}>
                  Create Password
                </Text>
                <Text style={{ color: 'red' }}>*</Text>
              </View>
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
                style={[styles.input, { width: '100%' }]}
                placeholder="Password"
                onChangeText={e => setPassword(e)}
                value={password || ''}
              />
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={true}
                style={[styles.input, { width: '100%' }]}
                placeholder="Confirm Password"
                onChangeText={e => setConfirmPassword(e)}
                onSubmitEditing={handlePassword} // This handles the "Enter" key press event
                value={confirmPassword || ''}
              />
              <Text style={[styles.subtitle, { fontStyle: 'italic', fontSize: 14 }]}> "Create your password to access the platform" </Text>
            </View>
            <View style={styles.password}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{
                  marginBottom: 10,
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: 'black'
                }}>
                  Enter Password Again
                </Text>
              </View>
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                // secureTextEntry={true}
                style={[styles.input, { width: '100%' }]}
                placeholder=""
                onChangeText={e => handleCredentials('contactPassword', e)}
                value={credentials.contactPassword || ''}
              />
              <Text style={[styles.subtitle, { fontSize: 14, fontWeight: '400' }]}> Send yourself a copy of your login information! ( optional ) </Text>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Address </Text>
              <View style={{ flexDirection: 'column', width: '100%', gap: 5 }}>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <TextInput
                    style={[styles.input, { width: '100%', marginBottom: 0 }]}
                    placeholder=""
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={e => handleCredentials('street', e)}
                    value={credentials.address.street || ''}
                  />
                  <Text>Street Address</Text>
                </View>
                <View style={{ width: '100%', marginBottom: 10 }}>
                  <TextInput
                    style={[styles.input, { width: '100%', marginBottom: 0 }]}
                    placeholder=""
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={e => handleCredentials('street2', e)}
                    value={credentials.address.street2 || ''}
                  />
                  <Text>Street Address2</Text>
                </View>
                <View style={{ flexDirection: 'row', width: '100%', gap: 5, marginBottom: 30 }}>
                  <View style={[styles.input, { width: '45%' }]}>
                    <TextInput
                      placeholder=""
                      style={[styles.input, { width: '100%', marginBottom: 0 }]}
                      onChangeText={e => handleCredentials('city', e)}
                      value={credentials.address.city || ''}
                    />
                    <Text>City</Text>
                  </View>
                  <View style={[styles.input, { width: '20%' }]}>
                    <TextInput
                      placeholder=""
                      style={[styles.input, { width: '100%', marginBottom: 0 }]}
                      onChangeText={e => handleCredentials('state', e)}
                      value={credentials.address.state || ''}
                    />
                    <Text>State</Text>
                  </View>
                  <View style={[styles.input, { width: '30%' }]}>
                    <TextInput
                      placeholder=""
                      style={[styles.input, { width: '100%', marginBottom: 0 }]}
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
              <Text style={styles.subtitle}> Logo / Pic</Text>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <TouchableOpacity title="Select File" onPress={pickFile} style={styles.chooseFile}>
                  <Text style={{ fontWeight: '400', padding: 0, fontSize: 14 }}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { width: '70%' }]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.avatar.name || ''}
                />
              </View>
              <Text> "optional"</Text>
            </View>

            <View style={[styles.btn, { marginTop: 20 }]}>
              <HButton style={styles.subBtn} onPress={handleSubmit}>
                Submit
              </HButton>
            </View>

            <Text style={{ textDecorationLine: 'underline', color: '#2a53c1', marginBottom: 100 }}
              onPress={handleBack}
            >
              Back to 🏚️ Facilities Home
            </Text>
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
    backgroundColor: 'rgba(155, 155, 155, 0.61))'
  },
  scroll: {
    marginTop: 97,
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
    backgroundColor: '#ffffffa8',
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
    fontSize: 18,
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

  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 130
  },
  btn: {
    flexDirection: 'column',
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
