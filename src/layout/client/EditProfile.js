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
import { Signup } from '../../utils/useApi';
import MSubNavbar from '../../components/MSubNavbar';
import RNFS from 'react-native-fs'
import { useAtom } from 'jotai';
import { 
  firstNameAtom, 
  lastNameAtom, 
  emailAtom, 
  titleAtom, 
  userRoleAtom, 
  birthdayAtom, 
  entryDateAtom, 
  phoneNumberAtom, 
  addressAtom, 
  socialSecurityNumberAtom, 
  photoImageAtom, 
  driverLicenseAtom,
  socialCardAtom,
  physicalExamAtom,
  ppdAtom,
  mmrAtom,
  healthcareLicenseAtom,
  resumeAtom,
  covidCardAtom,
  blsAtom
 } from '../../context/ClinicalAuthProvider';
import { Update } from '../../utils/useApi';

export default function EditProfile({ navigation }) {

  const theme = useTheme();
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  const [entryDate, setEntryDate] = useAtom(entryDateAtom);
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const [photoImage, setPhotoImage] = useAtom(photoImageAtom);
  const [title, setTitle] = useAtom(titleAtom);
  const [birthdays, setBirthdays] = useAtom(birthdayAtom);
  const [socialSecurityNumber, setSocialSecurityNumber] = useAtom(socialSecurityNumberAtom);
  const [driverLicense, setDriverLicense] = useAtom(driverLicenseAtom); 
  const [socialCard, setSocialCard] = useAtom(socialCardAtom);
  const [physicalExam, setPhysicalExam] = useAtom(physicalExamAtom); 
  const [ppd, setPPD] = useAtom(ppdAtom);
  const [mmr, setMMR] = useAtom(mmrAtom); 
  const [healthcareLicense, setHealthcareLicense] = useAtom(healthcareLicenseAtom);
  const [resume, setResume] = useAtom(resumeAtom); 
  const [covidCard, setCovidCard] = useAtom(covidCardAtom);
  const [bls, setBls] = useAtom(blsAtom); 
  //--------------------------------------------Credentials-----------------------------
  const [ credentials, setCredentials ] = useState({
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    title: title,
    birthday: birthdays,
    socialSecurityNumber: socialSecurityNumber,
    address: address,
    photoImage: photoImage,
    userRole: userRole,
    driverLicense:driverLicense, 
    socialCard: socialCard,
    physicalExam: physicalExam, 
    ppd: ppd, 
    mmr: mmr, 
    healthcareLicense: healthcareLicense, 
    resume: resume, 
    covidCard: covidCard, 
    bls: bls
  })

  const handleCredentials = (target, e) => {
    if (target !== "streetAddress" && target !== "streetAddress2" && target !== "city" && target !== "state" && target !== "zip") {
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

  //-------------------------------------------Date Picker---------------------------------------
  const [birthday, setBirthday] = useState(new Date());
  const [showCalender, setShowCalendar] = useState(false);
  const handleDayChange = (target, day) => {
    setBirthday(day);
    handleCredentials(target, day);
  }

  //-------------------------------------------File Upload----------------------------

  const pickFile = async (name) => {
    try {
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
      handleCredentials(name, {content: `data:${res.type};base64,${fileContent}`, type: fileType, name: res[0].name});
      console.log(`File ${name} converted to base64:`, `data:${res.type};base64,${fileContent}`);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Handle other errors
      }
    }
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
    handleCredentials('phoneNumber', formattedNumber);
  };

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
    console.log('password');
    if (credentials.email === '' || 
      credentials.firstName === '' || 
      credentials.lastName ==='' || 
      credentials.phoneNumber ==='' || 
      credentials.title ==='' || 
      credentials.birthday ==='' || 
      credentials.socialSecurityNumber ==='' || 
      credentials.address.streetAddress ==='' || 
      credentials.address.city ==='' || 
      credentials.address.state ==='' || 
      credentials.address.zip ==='') {
        showAlerts('all gaps')
    }
    else {
      // navigation.navigate('MyHome');
      try {
        console.log('update------------>')
        // console.log('credentials: ', credentials);
        const response = await Update(credentials, 'clinical');
        console.log('Signup successful: ', response)
        setFirstName(response.user.firstName);
        setLastName(response.user.lastName);
        setBirthdays(response.user.birthday);
        setPhoneNumber(response.user.phoneNumber);
        setEmail(response.user.email);
        setTitle(response.user.title);
        setPhotoImage(response.user.photoImage);
        setUserRole(response.user.userRole);
        setDriverLicense(response.user.driverLicense);
        setSocialCard(response.user.socialCard);
        setPhysicalExam(response.user.physicalExam);
        setPPD(response.user.ppd);
        setMMR(response.user.mmr);
        setHealthcareLicense(response.user.healthcareLicense);
        setResume(response.user.resume);
        setCovidCard(response.user.covidCard);
        setBls(response.user.bls);
        console.log('successfully Updated')
        navigation.navigate("MyProfile")
      } catch (error) {
        console.error('Update failed: ', error)
      }
    }
  }

  const handleRemove = (name) => {
    handleCredentials(name, '');
    // setPhotoName('');
  }
  return (
    <View style={styles.container}>
      <StatusBar 
        translucent backgroundColor="transparent"
      />
      <MHeader navigation={navigation}/>
      <MSubNavbar navigation={navigation} name={"Caregiver"}/>
      <ScrollView style = {styles.scroll}    
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style={styles.authInfo}>
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
                  onChangeText={e => handleCredentials('email', e)}
                  value={credentials.email || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Phone <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  value={credentials.phoneNumber}
                  style={[styles.input, {width: '100%'}]}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  placeholder={credentials.phoneNumber}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> SSN <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder={credentials.socialSecurityNumber}
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="numeric" // Set the keyboardType to "numeric"
                  onChangeText={e => handleCredentials('socialSecurityNumber', e)}
                  value={credentials.socialSecurityNumber || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Date of Birth <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'column', width: '100%', gap: 5}}>
                <TouchableOpacity onPress={() => {setShowCalendar(true), console.log(showCalender)}} style={{width: '100%', height: 50, zIndex: 10}}>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '100%', position: 'absolute', zIndex: 0}]}
                  placeholder=""
                  value={birthday.toDateString()}
                  editable={false}
                />
                
                {/* <Button title="Select Birthday" onPress={() => setShowCalendar(true)} /> */}
                {showCalender && 
                <>
                  <DatePicker
                    date={birthday}
                    onDateChange={(day) => handleDayChange('birthday', day)}
                    mode="date" // Set the mode to "date" to allow year and month selection
                    androidVariant="native"
                  />
                  <Button title="confirm" onPress={(day) =>{setShowCalendar(!showCalender);}} />
                </>
                }
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Caregiver Address <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{flexDirection: 'column', width: '100%', gap: 5}}>
                <View style={{width: '100%', marginBottom: 10}}>
                  <TextInput
                    style={[styles.input, {width: '100%', marginBottom: 0}]}
                    placeholder=""
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={e => handleCredentials('streetAddress', e)}
                    value={credentials.address.streetAddress || ''}
                  />
                  <Text>Street Address</Text>
                </View>
                <View style={{width: '100%', marginBottom: 10}}>
                  <TextInput
                    style={[styles.input, {width: '100%', marginBottom: 0}]}
                    placeholder=""
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={e => handleCredentials('streetAddress2', e)}
                    value={credentials.address.streetAddress2 || ''}
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
              <Text style={styles.subtitle}> Title <Text style={{color: 'red'}}>*</Text> </Text>
              <View style={{position: 'relative', width: '100%', gap: 5, height: 50}}>
                <TouchableOpacity onPress = {()=>setShowModal(true)}
                  style={{height: 40, zIndex: 1}}
                >
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '100%', position: 'absolute', zIndex: 0}]}
                  placeholder="First"
                  editable= {false}
                  // onChangeText={e => handleCredentials('firstName', e)}
                  value={credentials.title != ''?credentials.title : 'Select Title ...' }
                />
                {showModal && <Modal
                  Visible={false}
                  transparent= {true}
                  animationType="slide"
                  onRequestClose={() => {
                    setShowModal(!showModal);
                  }}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.calendarContainer}>
                      <Text style={styles.subtitle} onPress={()=>handleItemPress('')}>Select Title...</Text>
                      <Text style={styles.subtitle} onPress={()=>handleItemPress('CNA')}>CNA</Text>
                      <Text style={styles.subtitle} onPress={()=>handleItemPress('LPN')}>LPN</Text>
                      <Text style={styles.subtitle} onPress={()=>handleItemPress('RN')}>RN</Text>
                    </View>
                  </View>
                </Modal>}
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Pic. (Optional)</Text>
              {credentials.photoImage.type === "image" ? credentials.photoImage.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.photoImage.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('photoImage')}
                >remove</Text>
              </View>:
              credentials.photoImage.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.photoImage.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('photoImage')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('photoImage')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.photoImage.name || ''}
                />
              </View>
            </View>
            <View style={styles.bottomBar}/>
          </View>
          <View style={styles.authInfo}>
            <View style={styles.profileTitleBg}>
              <Text style={styles.profileTitle}>MY DOCUMENTS</Text>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Driver's License</Text>
              {credentials.driverLicense.type === "image" ?credentials.driverLicense.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.driverLicense.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('driverLicense')}
                >remove</Text>
              </View>
              :
              credentials.driverLicense.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.driverLicense.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('driverLicense')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('driverLicense')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.driverLicense.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Social Security Card</Text>
              {credentials.socialCard.type === "image" ? credentials.socialCard.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.socialCard.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {()=>handleRemove('socialCard')}
                >remove</Text>
              </View>
              :
              credentials.socialCard.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.socialCard.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('socialCard')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('socialCard')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.socialCard.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Physical Exam</Text>
              {credentials.physicalExam.type === "image" ? credentials.physicalExam.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.physicalExam.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {()=>handleRemove('physicalExam')}
                >remove</Text>
              </View>:
              credentials.physicalExam.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.physicalExam.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('physicalExam')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('physicalExam')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.physicalExam.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> PPD (TB Test)</Text>
              {credentials.ppd.type==="image" ? credentials.ppd.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.ppd.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('ppd')}
                >remove</Text>
              </View>
              :
              credentials.ppd.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.ppd.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('ppd')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('ppd')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.ppd.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> MMR (Immunizations)</Text>
              {credentials.mmr.type === "image" ? credentials.mmr.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.mmr.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('mmr')}
                >remove</Text>
              </View>
              :
              credentials.mmr.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.mmr.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('mmr')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('mmr')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.mmr.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Healthcare License</Text>
              {credentials.healthcareLicense.type === "image" ? credentials.healthcareLicense.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.healthcareLicense.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {()=>handleRemove('healthcareLicense')}
                >remove</Text>
              </View>
              :
              credentials.healthcareLicense.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.healthcareLicense.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('healthcareLicense')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('healthcareLicense')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.healthcareLicense.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Resume</Text>
              {credentials.resume.type === "image" ? credentials.resume.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.resume.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('resume')}
                >remove</Text>
              </View>
              :
              credentials.resume.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.resume.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('resume')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('resume')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.resume.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> COVID Card</Text>
              {credentials.covidCard.type === "image" ? credentials.covidCard.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.covidCard.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {()=>handleRemove('covidCard')}
                >remove</Text>
              </View>
              :
              credentials.covidCard.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.covidCard.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('covidCard')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('covidCard')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.covidCard.name || ''}
                />
              </View>
            </View>
            <View style={styles.email}>
              <Text style={styles.subtitle}> BLS(CPR card)</Text>
              {credentials.bls.type === "image" ? credentials.bls.content &&
              <View style={{marginBottom: 10}}>
                <Image
                  style={{ width: 100, height: 100,  }}
                  source={{ uri: `${credentials.bls.content}` }}
                />
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('bls')}
                >remove</Text>
              </View>
              :
              credentials.bls.type === "pdf" &&<View style={{marginBottom: 10}}>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                >{credentials.bls.name} &nbsp;&nbsp;</Text>
                <Text style={{color: '#0000ff', textDecorationLine: 'underline'}}
                  onPress = {() => handleRemove('bls')}
                >remove</Text>
              </View>}
              
              <View style={{flexDirection: 'row', width: '100%'}}>
                <TouchableOpacity title="Select File" onPress={()=>pickFile('bls')} style={styles.chooseFile}>
                  <Text style={{fontWeight: '400', padding: 0, fontSize: 14}}>Choose File</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, {width: '70%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={credentials.bls.name || ''}
                />
              </View>
              <Text style={[styles.subtitle, {lineHeight: 40}]}> W - 9 {'\n'}
                Standard State Criminal{'\n'}
                Drug Test{'\n'}
                Hep B (shot or declination){'\n'}
                Flu (shot or declination){'\n'}
                CHRC 102 Form{'\n'}
                CHRC 103 Form{'\n'}
              </Text>
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handleSubmit }>
                Submit
              </HButton>
            </View>
          </View>
        </View>
        <Text style={{textDecorationLine: 'underline', color: '#2a53c1', marginBottom: 100, marginLeft: '10%'}}
          onPress={handleBack}
        >
          Back to 🏚️ Caregiver Profile
        </Text>
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
