import React, { useState, useEffect, useRef } from 'react';
import { TouchableWithoutFeedback, FlatList, Dimensions, Modal, TextInput, View, Image, Animated, StyleSheet, ScrollView, StatusBar, Easing, TouchableOpacity } from 'react-native';
import { Text, PaperProvider, DataTable, useTheme, Button } from 'react-native-paper';
import images from '../../assets/images';
import { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { Table, Row, Rows } from 'react-native-table-component';
import { useAtom } from 'jotai';
import { firstNameAtom, emailAtom, userRoleAtom, entryDateAtom, phoneNumberAtom, addressAtom } from '../../context/ClinicalAuthProvider';
// import MapView from 'react-native-maps';
import * as Progress from 'react-native-progress';
import { Jobs, Update, Clinician } from '../../utils/useApi';
import { Dropdown } from 'react-native-element-dropdown';
import AHeader from '../../components/Aheader';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

export default function AllJobShiftListing({ navigation }) {

  //---------------------------------------Animation of Background---------------------------------------
  const [backgroundColor, setBackgroundColor] = useState('#0000ff'); // Initial color
  let colorIndex = 0;
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random color
      if (colorIndex >= 0.9) {
        colorIndex = 0;
      } else {
        colorIndex += 0.1;
      }

      const randomColor = colorIndex == 0 ? `#00000${Math.floor(colorIndex * 256).toString(16)}` : `#0000${Math.floor(colorIndex * 256).toString(16)}`;
      setBackgroundColor(randomColor);
      // console.log(randomColor)
    }, 500); // Change color every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const tableHead = [
    'Entry Date',
    'Nurse',
    'JobId',
    'JobNum -#.',
    'Location',
    'Shift Date',
    'Shift Time',
    'Bid',
    'Awarded',
    'Job Status',
    'Job Rating',
  ];
  // const tableData = [
  //   [ '07/23/2024', 'Mariah Smith', '(716) 292-2405', 'LPN', '	mariahsmith34@gmail.com', 'View Here', 'View Here', 'activate', '', '', '', 'Reset'],
  //   [ '07/23/2024', 'Mariah Smith', '(716) 292-2405', 'LPN', '	mariahsmith34@gmail.com', 'View Here', 'View Here', 'activate', '', '', '', 'Reset'],
  // ]
  const [clinicians, setClinicians] = useState([]);

  async function getData() {
    let Data = await Jobs('jobs', 'Admin');
    if(!Data) {
      setData(['No Data'])
    }
    else {
      const modifiedArray = Data.map(subarray => {
        return subarray.slice(0, -2); // Remove the last three items
      });
      console.log(modifiedArray, '\n modified Array');
      
      setData(modifiedArray)
    }
    const uniqueValues = new Set();
    const transformed = [];
    
    let clinicianData = await Clinician('clinical/clinician', 'Admin');
    const extractData = clinicianData.map(item => {
      const firstName = item[1];
      const lastName = item[2];
      return firstName ? `${firstName} ${lastName}` : null; // Combine names if they exist
    });

    // Step 2: Filter unique names
    const uniqueNames = Array.from(new Set(extractData.filter(name => name)));
    console.log(uniqueNames, extractData);
    
    
    // Iterate over each subarray
    uniqueNames.forEach(subarray => {
      const value = subarray; // Get the second element
      if (!uniqueValues.has(value)) { // Check if it's already in the Set
          uniqueValues.add(value); // Add to Set
          transformed.push({ label: value, value: value }); // Add to transformed array
      }
    });

    console.log(transformed);
    setClinicians(transformed);
    // // setTableData(Data[0].degree)
    // tableScan(Data);
  }
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []) // Empty dependency array means this runs on focus
  );

  //---------------DropDown--------------
  const pageItems = [
    {label: '10 per page', value: '1'},
    {label: '25 per page', value: '2'},
    {label: '50 per page', value: '3'},
    {label: '100 per page', value: '4'},
    {label: '500 per page', value: '5'},
    {label: '1000 per page', value: '6'},
  ]

  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: 'blue' }]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };  
  const widths = [150, 130, 100, 100, 200, 120, 100, 80, 80, 200, 80];
  const [modal, setModal] = useState(false)
  const toggleModal = () => {
    setModal(!modal);
  }
  const [cellData, setCellData] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [modalItem, setModalItem] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [label, setLabel] = useState(null);
  const [date,setDate] = useState(new Date());
  const handleCellClick = (cellData, rowIndex, cellIndex) => {
    // Handle row click event here
    console.log('Row clicked:', cellData, rowIndex, cellIndex);
    // if (cellIndex==9) {
      setCellData(cellData);
      const rowD = data[rowIndex][2];
      console.log(rowD);
      setModalItem(cellIndex);
      setLabel(cellData.toString());
      setRowData(rowD);
      if (cellIndex !== 0 || cellIndex !== 2 || cellIndex !== 7 || cellIndex !== 8 )
      {toggleModal();}
    // }
  };

  const handleDay = (day) => {
    setDate(day);
    setLabel(moment(day).format("MM/DD/YYYY"));
  }

  //---------------DropDown--------------
  const jobStatus = [
    {label: 'Available', value: '1'},
    {label: 'Awarded', value: '2'},
    {label: 'Pending Verification', value: '3'},
    {label: 'Cancelled', value: '4'},
    {label: 'Verified', value: '5'},
    {label: 'Paid', value: '6'},
  ]
  const [degree, setDegree] = useState([
    {label: 'Select...', value: 'Select...'},
    {label: 'CNA', value: 'CNA'},
    {label: 'LPN', value: 'LPN'},
    {label: 'STNA', value: 'STNA'},
  ])  
  const [location, setLocation] = useState([
    {label: 'Select...', value: 'Select...'},
    {label: 'Lancaster, NY', value: 'Lancaster, NY'},
    {label: 'Skilled Nursing Facility', value: 'Skilled Nursing Facility'},
    {label: 'Springville, NY', value: 'Springville, NY'},
    {label: 'Warsaw, NY', value: 'Warsaw, NY'},
    {label: 'Williansville', value: 'Williansville'},
  ])


  const [jobValue, setJobValue] = useState(null);
  const [isJobFocus, setJobIsFocus] = useState(false);

  const [suc, setSuc] = useState(0);
  const handlePress = async() => {
    let sendData = label;
    if (modalItem === 3 || modalItem === 10) {
      sendData = Number(sendData)
    }
    let sendingData = {}
    if (modalItem === 1) {
      sendingData = {
        jobId: rowData, // Ensure rowData is defined and contains the appropriate value
        nurse: sendData // Use sendData for jobNum
      };
    } else if (modalItem === 3) {
      sendingData = {
        jobId: rowData,
        jobNum: sendData // Use sendData for location
      };
    } else if (modalItem === 4)  {
      // Handle other modalItems as needed
      sendingData = {
        jobId: rowData,
        location: sendData // Use sendData for location
      };
    } else if (modalItem === 5)  {
      // Handle other modalItems as needed
      sendingData = {
        jobId: rowData,
        shiftDate: sendData // Use sendData for location
      };
    } else if (modalItem === 6)  {
      // Handle other modalItems as needed
      sendingData = {
        jobId: rowData,
        shiftTime: sendData // Use sendData for location
      };
    } else if (modalItem === 9)  {
      // Handle other modalItems as needed
      sendingData = {
        jobId: rowData,
        jobStatus: sendData // Use sendData for location
      };
    } else if (modalItem === 10)  {
      // Handle other modalItems as needed
      sendingData = {
        jobId: rowData,
        jobRating: sendData // Use sendData for location
      };
    }
    console.log('====================================');
    console.log(sendingData);
    console.log('====================================');
    let Data = await Update(sendingData, 'jobs');
    if(Data) setSuc(suc+1);
    else setSuc(suc);
    toggleModal();
    getData();
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent backgroundColor="transparent"
      />
      <AHeader navigation={navigation}  currentPage={1} />
      <SubNavbar navigation={navigation} name={"AdminLogin"}/>
      <ScrollView style={{ width: '100%', marginTop: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topView}>
          <Animated.View style={[styles.backTitle, { backgroundColor }]}>
            <Text style={styles.title}>COMPANY JOBS / SHIFTS</Text>
          </Animated.View>
          <View style={styles.bottomBar} />
        </View>
        <View style={{ marginTop: 30, flexDirection: 'row', width: '90%', marginLeft: '5%', gap: 10 }}>
          <TouchableOpacity style={[styles.subBtn, {}]} onPress={() => navigation.navigate('AdminJobShift')}>
            <View style={{ backgroundColor: 'white', borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <Text style={{ fontWeight: 'bold', color: '#194f69', textAlign: 'center', marginTop: 0 }}>+</Text>
            </View>
            <Text style={styles.profileTitle}>Add A New Job / Shift
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity style={[styles.subBtn, {}]} onPress={() => {
            navigation.navigate('FacilityProfile'),
              console.log("data-------", data)
          }}>
            <Text style={styles.profileTitle}>🏚️ Facilities Home</Text>
          </TouchableOpacity> */}
        </View>
        <View style={styles.profile}>
          <Text style={{ backgroundColor: '#000080', color: 'white', width: '27%' }}>TOOL TIPS:</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>When A New "Job / Shift" is added the status will appear as <Text style={{ backgroundColor: '#ffff99' }}>"AVAILABLE"</Text> & will appear on Caregivers Dashboard</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>Caregivers can "Bid" or show interest on all "Job / Shifts" - Available</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>Facilities can view all bids and award a shift to the nurse of choice, once awarded the Job / Shift will update to a stus of <Text style={{ backgroundColor: '#ccffff' }}>"AWARDED"</Text></Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>Once the Caregiver has completed the "Job / Shift" and uploads there timesheet, the status will update to <Text style={{ backgroundColor: '#ccffcc' }}>"COMPLETED"</Text></Text>
          </View>
        </View>
        <View>
          <View style={styles.body}>
            <View style={styles.bottomBar} />
            <View style={styles.modalBody}>
              <View style={[styles.profileTitleBg, { marginLeft: 0, marginTop: 30 }]}>
                <Text style={styles.profileTitle}>🖥️ FACILITY / SHIFT LISTINGS</Text>
              </View>
              <View style={styles.searchBar}>
                {/* <TextInput style={styles.searchText} /> */}
                {/* <TouchableOpacity style={styles.searchBtn}>
                  <Text>Add filters</Text>
                </TouchableOpacity> */}
              </View>
              <Dropdown
                style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={pageItems}
                // search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder={'100 per page'}
                // searchPlaceholder="Search..."
                value={value ? value : pageItems[3].value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setValue(item.value);
                  setIsFocus(false);
                }}
                renderLeftIcon={() => (
                  <View
                    style={styles.icon}
                    color={isFocus ? 'blue' : 'black'}
                    name="Safety"
                    size={20}
                  />
                )}
              />
              <ScrollView horizontal={true} style={{ width: '95%', borderWidth: 1, marginBottom: 30, borderColor: 'rgba(0, 0, 0, 0.08)' }}>
                <Table >
                  <Row
                    data={tableHead}
                    style={styles.head}
                    widthArr={[150, 130, 100, 100, 200, 120, 100, 80, 80, 200, 80]}
                    textStyle={styles.tableText}
                  />
                  {data.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={{ flexDirection: 'row' }}>
                      {rowData.map((cellData, cellIndex) => (
                        <TouchableWithoutFeedback key={cellIndex} onPress={() => handleCellClick(cellData, rowIndex, cellIndex)}>
                          <View key={cellIndex} style={[{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', paddingVertical: 10, backgroundColor: '#E2E2E2' }, {width: widths[cellIndex]}]}>
                            <Text style={[styles.tableText, {borderWidth: 0}]}>{cellData}</Text>
                          </View>
                        </TouchableWithoutFeedback> 
                      ))}
                    </View>
                  ))}
                </Table>
              </ScrollView>
            </View>
          </View>
          
          <Modal
            visible={modal}
            transparent= {true}
            animationType="slide"
            onRequestClose={() => {
              setModal(!modal);
            }}
          >
            <View style={styles.modalContainer}>
              <View style={styles.calendarContainer}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>{tableHead[modalItem]}</Text>
                  <TouchableOpacity style={{width: 20, height: 20, }} onPress={toggleModal}>
                    <Image source = {images.close} style={{width: 20, height: 20,}}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.body}>
                  <View style={styles.modalBody}>
                    {
                      (modalItem === 1) || (modalItem === 4) || (modalItem === 9) ?
                        <Dropdown
                          style={[styles.dropdown, {width: '100%'}, isFocus && { borderColor: 'blue' }]}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          inputSearchStyle={styles.inputSearchStyle}
                          iconStyle={styles.iconStyle}
                          data={
                            modalItem === 1 ? clinicians :
                            modalItem === 4 ?  location :
                            (modalItem === 9) && jobStatus
                          }
                          // search
                          maxHeight={300}
                          labelField="label"
                          valueField="value"
                          placeholder={label}
                          // searchPlaceholder="Search..."
                          value={label}
                          onFocus={() => setJobIsFocus(true)}
                          onBlur={() => setJobIsFocus(false)}
                          onChange={item => {
                            setJobValue(item.value);
                            setLabel(item.label);
                            setJobIsFocus(false);
                          }}
                          renderLeftIcon={() => (
                            <View
                              style={styles.icon}
                              color={isJobFocus ? 'blue' : 'black'}
                              name="Safety"
                              size={20}
                            />
                          )}
                        />
                      :
                      (modalItem === 3) || (modalItem === 6) || (modalItem === 10) ?
                        (<TextInput
                          style={[styles.searchText, {width: '100%', paddingTop: 0, paddingBottom: 0, textAlignVertical: 'center'}]}
                          placeholder=""
                          onChangeText={e => setLabel(e)}
                          value={label || ''}
                        />)
                      :
                      modalItem === 5 ?
                        <View style={{flexDirection: 'column', width: '100%', gap: 5, alignItems: 'center'}}>
                          <TouchableOpacity onPress={() => {setShowCalendar(true), console.log(showCalendar)}} style={{width: '100%', height: 35, paddingBottom: 0, zIndex: 1}}>
                            <TextInput
                              style={[styles.searchText, {width: '100%', paddingTop: 0, textAlignVertical: 'center', color: 'black', paddingBottom: 0, fontSize: 18}]}
                              placeholder=""
                              value={label}
                              editable={false}
                            />
                          </TouchableOpacity>
                          {showCalendar 
                            && 
                            <>
                              <DatePicker
                                date={date}
                                onDateChange={(day) => handleDay(day)}
                                mode="date" // Set the mode to "date" to allow year and month selection
                                androidVariant="native"
                              />
                              <Button title="confirm" onPress={(day) =>{setShowCalendar(!showCalendar);}} />
                            </>
                          }
                        </View>
                      :
                      <></>
                    }
                    <TouchableOpacity style={styles.button} onPress={handlePress} underlayColor="#0056b3">
                      <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
  topView: {
    marginTop: 30,
    marginLeft: '10%',
    width: '80%',
    position: 'relative'
  },
  backTitle: {
    backgroundColor: 'black',
    width: '100%',
    height: '55',
    marginTop: 10,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 500,
    color: 'black',
    top: 10
  },
  title: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    paddingVertical: 10
  },
  bottomBar: {
    marginTop: 30,
    height: 5,
    backgroundColor: '#4f70ee1c',
    width: '100%'
  },
  text: {
    fontSize: 14,
    color: 'black',
    fontWeight: '300',
    textAlign: 'center',
    marginTop: 30,
    width: '90%',
    marginLeft: '5%'
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
  profileTitleBg: {
    backgroundColor: '#BC222F',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    marginLeft: '10%',
    marginBottom: 20
  },
  profileTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  name: {
    fontSize: 14,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#22138e',
    fontWeight: 'bold',
  },
  row: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'hsl(0, 0%, 86%)',
    // height: 40,
    position: 'relative',
    backgroundColor: 'white',
    width: '100%',
  },
  evenRow: {
    backgroundColor: '#7be6ff4f', // Set the background color for even rows
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
  body: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginBottom: 30
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
    alignItems: 'flex-start',
    marginTop: 30,
    paddingLeft: '5%'
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '60%',
    borderRadius: 10,
    marginBottom: 10
  },
  searchText: {
    width: '70%',
    backgroundColor: 'white',
  },
  searchBtn: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    color: '#2a53c1',
    height: 30
  },
  filter: {
    width: '90%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  filterBtn: {
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    gap: 5
  },
  filterText: {
    color: '#2a53c1',
  },
  subBtn: {
    backgroundColor: '#194f69',
    borderColor: '#ffaa22',
    borderWidth: 2,
    borderRadius: 20,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    gap: 10,
    flexDirection: 'row'
  },
  head: {
    backgroundColor: '#7be6ff4f',
    // width: 2000,
    height: 40,
  },
  tableText: {
    // paddingHorizontal: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(0, 0, 0, 0.08)',
    height: 40,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdown: {
    height: 30,
    width: '50%',
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10
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
    height: 40,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF', // Button color
    padding: 10,    
    marginLeft: '35%',
    marginTop: 30,           // Padding inside the button
    borderRadius: 5,          // Rounded corners
    
  },
  buttonText: {
    color: 'white',            // Text color
    fontSize: 16,              // Text size
  },
  input: {
    backgroundColor: 'white', 
    height: 30, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'hsl(0, 0%, 86%)',
  },
});
