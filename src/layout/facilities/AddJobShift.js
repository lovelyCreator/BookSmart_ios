import { Alert, StyleSheet, View, Image, Button, Platform, Text, ScrollView, TouchableOpacity, Modal, StatusBar, Pressable } from 'react-native';
import React, { useState } from 'react';
import images from '../../assets/images';
import { Divider, TextInput, ActivityIndicator, useTheme, Card } from 'react-native-paper';
import { AuthState, firstNameAtom, lastNameAtom, socialSecurityNumberAtom, verifiedSocialSecurityNumberAtom } from '../../context/ClinicalAuthProvider';
import { useNavigation } from '@react-navigation/native';
import HButton from '../../components/Hbutton';
import MHeader from '../../components/Mheader';
import MFooter from '../../components/Mfooter';
import PhoneInput from 'react-native-phone-input';
import SignatureCapture from 'react-native-signature-capture';
import DatePicker from 'react-native-date-picker';
import DocumentPicker from 'react-native-document-picker';
import { PostJob, Signup } from '../../utils/useApi';
import MSubNavbar from '../../components/MSubNavbar';
import SubNavbar from '../../components/SubNavbar';
import { Dropdown } from 'react-native-element-dropdown';
import RNFS from 'react-native-fs'
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAtom } from 'jotai';
import { companyNameAtom } from '../../context/FacilityAuthProvider'


export default function AddJobShift({ navigation }) {

  const theme = useTheme();
  //-----------------------------------Degree DropDown----------------------------
  
  const [degree, setDegree] = useState([
    {label: 'Select...', value: 'Select...'},
    {label: 'CNA', value: 'CNA'},
    {label: 'LPN', value: 'LPN'},
    {label: 'STNA', value: 'STNA'},
  ])

  const [facility, setFacility] = useAtom(companyNameAtom);

  const [degreeValue, setDegreeValue] = useState(null);
  const [isDegreeFocus, setIsDegreeFocus] = useState(false);

  const renderLabel = () => {
    if (degreeValue || isDegreeFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }, {width: 100}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const [isAddDegree, setIsAddDegree] = useState(false);
  const handleAddDegree = () => {
    setIsAddDegree(!isAddDegree)
  }

  //-----------------------------------Unit DropDown----------------------------
  
  const [location, setLocation] = useState([
    {label: 'Select...', value: 'Select...'},
    {label: 'Lancaster, NY', value: 'Lancaster, NY'},
    {label: 'Skilled Nursing Facility', value: 'Skilled Nursing Facility'},
    {label: 'Springville, NY', value: 'Springville, NY'},
    {label: 'Warsaw, NY', value: 'Warsaw, NY'},
    {label: 'Williansville', value: 'Williansville'},
  ])

  const [locationValue, setLocationValue] = useState(null);
  const [isLocationFocus, setIsLocationFocus] = useState(false);

  const renderLocationLabel = () => {
    if (locationValue || isLocationFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }, {width: 100}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  const [isAddLocation, setIsAddLocation] = useState(false);
  const handleAddLocation = () => {
    setIsAddLocation(!isAddLocation)
  }
  //--------------------------------------------Credentials-----------------------------
  const [ credentials, setCredentials ] = useState({
    jobNum: '',
    degree: '',
    shiftTime: "",
    shiftDate: '',
    location: '',
    payRate: '',
    bonus: '',
    facility: facility
  })

  const handleCredentials = (target, e) => {
    if (target === "streetAddress" || target === "streetAddress2" || target === "city" || target === "state" || target === "zip") {
      setCredentials({...credentials, address: {...credentials.address, [target]: e}})
    }
    else if (target === "timeFrom" || target === "dateFrom" || target === "dateTo" || target === "timeTo") {
      console.log('success')
      setCredentials({...credentials, shiftsDateAndTimes: {...credentials.shiftsDateAndTimes, [target]: e}})
    }
    else {
      setCredentials({...credentials, [target]: e});
    }
    console.log(credentials);
  }

  //-------------------------------------CheckBox-----------------------------
  const [checked, setChecked] = useState(false);
  
  const handleToggle = () => {
    setChecked(!checked);
  };
  const [check, setCheck] = useState(false);
  
  const handleCheckToggle = () => {
    setCheck(!check);
  };

  //-------------------------------------CheckBox2-----------------------------
  const [isChecked, setIsChecked] = useState(false);

  const handleIsToggle = () => {
    setIsChecked(!isChecked);
  };
  const [isCheck, setIsCheck] = useState(false);
  
  const handleIsCheckToggle = () => {
    setIsCheck(!isCheck);
  };
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
  //-------------------------------------------Modal-------------------------
  const [showModal, setShowModal] = useState(false);
  const handleItemPress = () => {
    // handleCredentials('title', text);
    setShowModal(!showModal);
  }
  const toggleModal = () => {
    setShowModal(!showModal);
  }

  //-------------------------------------------Date Picker---------------------------------------
  const [shiftFromDay, setShiftFromDay] = useState(new Date());
  const [showCalender, setShowCalendar] = useState(false);
  const handleDayChange = (target, day) => {
    handleCredentials(target, moment(day).format("MM/DD/YYYY"));
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
    if (credentials.shift === '') {
        showAlerts('Shift')
    }
    else if (credentials.shiftDate === '') {
      showAlerts('Shift Date')
    }
    else {
      try {
        console.log('credentials: ', credentials);
        const response = await PostJob(credentials, 'jobs');
        console.log('Signup successful: ', response)
        navigation.navigate('CompanyShift');
      } catch (error) {
        console.error('Job Shift failed: ', error)
      }
    }
  }
  const [item, setItem] = useState('');
  const [title, setTitle] = useState('degree')
  const handleItemChange = (e) => {
    setItem(e);
  }

  const handleModal = (title, item) => {
    if (title === 'degree'){
      console.log('degree', item)
      setDegree([...degree, {label: item, value: item}])
    }
    else if (title === 'location') {
      console.log('location', item)
      setLocation([...location, {label: item, value: item},])
    }
    setShowModal(!showModal)
    setItem('')
  }

  return (
    <View style={styles.container}>
      <StatusBar 
        translucent backgroundColor="transparent"
      />
      <MHeader navigation={navigation}/>
      <SubNavbar navigation={navigation} name={"FacilityLogin"} />
      <ScrollView style = {styles.scroll}    
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.modal}>
          <View style= {{width: '60%', marginLeft: '20%', marginTop: 20}}>
            <Text style={styles.headBar}>
              Add A New Job / Shift
            </Text>
          </View>
          <View style={styles.authInfo}>
            <View>
              <Text style={styles.subtitle}> Job Num. -# </Text>
              <TextInput
                style={[styles.input, {width: '100%'}]}
                placeholder=""
                onChangeText={e => handleCredentials('jobNum', e)}
                value={credentials.jobNum || ''}
              />
            </View>
            <View>
              <Text style={styles.subtitle}> Degree/Discipline </Text>
              <Dropdown
                style={[styles.dropdown, isDegreeFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={degree}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'100 per page'}
                // searchPlaceholder="Search..."
                value={degreeValue ? degreeValue : degree[0].value}
                onFocus={() => setIsDegreeFocus(true)}
                onBlur={() => setIsDegreeFocus(false)}
                onChange={item => {
                  setDegreeValue(item.value);
                  setIsDegreeFocus(false);
                  handleCredentials('degree', item.label)
                }}
                renderLeftIcon={() => (
                  <View
                    style={styles.icon}
                    color={isDegreeFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <TouchableOpacity style={styles.addItems} onPress={() => {handleItemPress(); setTitle('degree')}}>
                <Image source={images.plus} style={{width: 15, height: 15}} />
                <Text style={[styles.text, {color: '#2a53c1', marginTop: 0}]}>Add a new options</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.subtitle}> Shift <Text style={{color: 'red'}}>*</Text> </Text>
                <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder=""
                  onChangeText={e => handleCredentials('shiftTime', e)}
                  value={credentials.shiftTime || ''}
                />
            </View>
            <View>
              <Text style={styles.subtitle}> Shift Date <Text style={{color: 'red'}}>*</Text> </Text>
              
              <View style={{flexDirection: 'column', width: '100%', gap: 5, position: 'relative'}}>
                <TouchableOpacity onPress={() => {setShowCalendar(true), console.log(showCalender)}} style={{width: '100%', height: 40, zIndex: 1}}>
                </TouchableOpacity><TextInput
                    style={[styles.input, {width: '100%', position: 'absolute', zIndex: 0}]}
                    placeholder=""
                    value={credentials.shiftDate}
                    editable={false}
                  />
                {showCalender && 
                <>
                  <DatePicker
                    date={shiftFromDay}
                    onDateChange={(day) => handleDayChange('shiftDate', day)}
                    mode="date" // Set the mode to "date" to allow year and month selection
                    androidVariant="native"
                  />
                  <Button title="confirm" onPress={(day) =>{setShowCalendar(!showCalender);}} />
                </>
                }
              </View>
            </View>
            <View>
              <Text style={styles.subtitle}> Location </Text>
              <Dropdown
                style={[styles.dropdown, isLocationFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={location}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'100 per page'}
                // searchPlaceholder="Search..."
                value={locationValue ? locationValue : location[0].value}
                onFocus={() => setIsLocationFocus(true)}
                onBlur={() => setIsLocationFocus(false)}
                onChange={item => {
                  setLocationValue(item.value);
                  setIsLocationFocus(false);
                  handleCredentials('location', item.label);
                }}
                renderLeftIcon={() => (
                  <View
                    style={styles.icon}
                    color={isLocationFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <TouchableOpacity style={styles.addItems} onPress={() => {handleItemPress(); setTitle('location')}}>
                <Image source={images.plus} style={{width: 15, height: 15}} />
                <Text style={[styles.text, {color: '#2a53c1', marginTop: 0}]}>Add a new options</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.subtitle}> Pay Rate </Text>
              <TextInput
                style={[styles.input, {width: '100%'}]}
                placeholder=""
                onChangeText={e => handleCredentials('payRate', e)}
                value={credentials.payRate || ''}
              />
            </View>
            <View>
              <Text style={styles.subtitle}> Bonus </Text>
              <TextInput
                style={[styles.input, {width: '100%'}]}
                placeholder=""
                onChangeText={e => handleCredentials('bonus', e)}
                value={credentials.bonus || ''}
              />
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handleSubmit }>
                Submit
              </HButton>
            </View>
          </View>
        </View>
      </ScrollView>
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
            <View style={styles.header}>
              <Text style={styles.headerText}>Add a new option</Text>
              <TouchableOpacity style={{width: 20, height: 20, }} onPress={toggleModal}>
                <Image source = {images.close} style={{width: 20, height: 20,}}/>
              </TouchableOpacity>
            </View>
            <View style={styles.body}>
              <View style={styles.modalBody}>
                <View style={styles.searchBar}>
                  <TextInput
                    style={[styles.input, {width: '100%'}]}
                    placeholder=""
                    onChangeText={e => handleItemChange(e)}
                    value={item || ''}
                  />
                  {/* <TouchableOpacity style={styles.searchBtn}>
                    <Text>Submit</Text>
                  </TouchableOpacity> */}
                  <Button title="Submit" onPress={() => handleModal(title, item) } />
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>}
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
  container: {
    marginBottom: 0,
    backgroundColor: '#fffff8'
  },
  scroll: {
    marginTop: 140,
  },
  headBar: {
    textAlign: 'center',
    backgroundColor: '#BC222F',
    color: 'white',
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 18,
    fontWeight: 'bold'
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    height: '20%,',
    padding: 20,
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: 'red',
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
  dropdown: {
    height: 30,
    width: '100%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    color: 'black'
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 30,
    fontSize: 16,
  },
  addItems: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10
  },
  middleText: {
    fontSize: 14,
    margin: 0,
    lineHeight: 16,
    color: 'black'
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkmark: {
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 30,
    elevation: 5,
    width: '80%',
    // height: '43%',
    marginLeft: '20',
    flexDirection: 'flex-start',
    borderWidth: 3,
    borderColor: '#7bf4f4',
  },
  modalBody: {
    // backgroundColor: 'rgba(79, 44, 73, 0.19)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center',
    margin: 10,
    width: '90%'
  },
  searchText: {
    width: '70%',
    backgroundColor: 'white',
    height: 30,
  },
  searchBtn: {
    width: '30%',
    display: 'flex',
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    color: '#2a53c1',
    height: 30
  },
});
