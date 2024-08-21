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

export default function CaregiverTimeSheet({ navigation }) {

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
    'Job-ID',
    'Nurse',
    'Job Shift & Time',
    'Job Status',
    'Caregiver Hours Worked',
  ];
  // const tableData = [
  //   [ '07/23/2024', 'Mariah Smith', '(716) 292-2405', 'LPN', '	mariahsmith34@gmail.com', 'View Here', 'View Here', 'activate', '', '', '', 'Reset'],
  //   [ '07/23/2024', 'Mariah Smith', '(716) 292-2405', 'LPN', '	mariahsmith34@gmail.com', 'View Here', 'View Here', 'activate', '', '', '', 'Reset'],
  // ]
  const [clinicians, setClinicians] = useState([]);

  function formatData(data) {
    return data.map(item => {
        // Parse the date and format to MM/DD/YYYY
        const date = new Date(item[0]);
        const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;

        // Combine the second and third elements
        const fullName = `${item[5]} ${item[6]}`;
        

        // Return the new structure
        return [item[2], item[1], fullName, item[9], item[12]];
    });
  }

  async function getData() {
    let Data = await Jobs('jobs', 'Admin');
    if(!Data) {
      setData(['No Data'])
    }
    else {
      const modifiedData = formatData(Data);
      console.log(modifiedData)
      // const modifiedArray = Data.map(subarray => {
      //   const newArray = [...subarray]; // Create a copy of the subarray
      //   newArray.pop(); // Remove the last item
      //   return newArray; // Return the modified subarray
      // });
      setData(modifiedData)
    }
    const uniqueValues = new Set();
    const transformed = [];

    // Iterate over each subarray
    data.forEach(subarray => {
      const value = subarray[1]; // Get the second element
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
  useEffect(() => {
    getData();
    // tableData = tableScan(Data);
  }, []);

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
  const widths = [120, 100, 150, 150, 150];
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
      const rowD = data[rowIndex][3];
      console.log(rowD);
      setModalItem(cellIndex);
      if(cellIndex==1) {
        const name = cellData.split(' ');
        setLabel({firstName: name[0], lastName: name[1]});
      }
      else {
        setLabel(cellData.toString());
      }
      setRowData(rowD);
      if (cellIndex !== 0 ) {
        toggleModal();
      }
    // }
  };

  const handleDay = (day) => {
    setDate(day);
    setLabel(moment(day).format("MM/DD/YYYY"));
  }

  //---------------DropDown--------------
  const [location, setLocation] = useState([
    {label: 'Select...', value: 'Select...'},
    {label: 'activate', value: 'activate'},
    {label: 'inactivate', value: 'inactivate'},
    {label: 'pending', value: 'pending'},
  ])

  const formatPhoneNumber = (input) => {
    // Remove all non-numeric characters from the input
    const cleaned = input.replace(/\D/g, '');

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

  const [jobValue, setJobValue] = useState(null);
  const [isJobFocus, setJobIsFocus] = useState(false);

  const [suc, setSuc] = useState(0);
  const handlePress = async() => {
    let sendData = label;
    let sendingData = {}
    if (modalItem === 1) {
      const emailData = {contactEmail: rowData}
      sendingData = {
        ...emailData, // Ensure rowData is defined and contains the appropriate value
        ...sendData // Use sendData for jobNum
      };
    } else if (modalItem === 2) {
      sendingData = {
        contactEmail: rowData,
        phoneNumber: sendData // Use sendData for location
      };
    } else if (modalItem === 3)  {
      // Handle other modalItems as needed
      sendingData = {
        contactEmail: rowData,
        updateEmail: sendData // Use sendData for location
      };
    } else if (modalItem === 4)  {
      // Handle other modalItems as needed
      sendingData = {
        contactEmail: rowData,
        userStatus: sendData // Use sendData for location
      };
    }
    console.log('====================================');
    console.log(sendingData);
    console.log('====================================');
    let Data = await Update(sendingData, 'facilities');
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
      <AHeader navigation={navigation}  currentPage={7} />
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
        </View>
        <View style={styles.profile}>
          <Text style={{ backgroundColor: '#000080', color: 'white', width: '27%' }}>TOOL TIPS:</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>Displays all Facilities within the platform.</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>Click <Text style={{fontWeight: 'bold'}}>"VIEW SHIFT"</Text> - to view all shifts associated with the facility.</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ backgroundColor: 'black', width: 4, height: 4, borderRadius: 2, marginTop: 20 }} />
            <Text style={[styles.text, { textAlign: 'left', marginTop: 10 }]}>Change status to <Text style={{ color: '#ff0000', fontWeight: 'bold' }}>"INACTIVE"</Text> to deactivate facility.</Text>
          </View>
        </View>
        <View>
          <View style={styles.body}>
            <View style={styles.modalBody}>
              <View style={[styles.profileTitleBg, { marginLeft: 0, marginTop: 30 }]}>
                <Text style={styles.profileTitle}>🖥️ ALL PLATFORM FACILITIES</Text>
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
                    widthArr={[120, 100, 150, 150, 150]}
                    textStyle={styles.tableText}
                  />
                  {data.map((rowData, rowIndex) => (
                    <View key={rowIndex} style={{ flexDirection: 'row' }}>
                      {rowData.map((cellData, cellIndex) => (
                        <TouchableWithoutFeedback key={cellIndex} onPress={() => handleCellClick(cellData, rowIndex, cellIndex)}>
                          <View key={cellIndex} style={[{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', padding: 10, backgroundColor: '#E2E2E2' }, {width: widths[cellIndex]}]}>
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
    height: 30,
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
    paddingHorizontal: 10,
    paddingTop: 10,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    borderWidth: 1, 
    borderColor: 'rgba(0, 0, 0, 0.08)',
    height: 50,
    textAlignVertical: 'center',
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
