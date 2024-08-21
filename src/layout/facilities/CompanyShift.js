import React, { useState, useEffect, useRef } from 'react';
import { VirtualizedList, FlatList, Dimensions, Modal, TextInput, View, Image, Animated, StyleSheet, ScrollView, StatusBar, Easing, TouchableOpacity } from 'react-native';
import { Text, PaperProvider, DataTable, useTheme } from 'react-native-paper';
import images from '../../assets/images';
import { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { Table, Row, Rows } from 'react-native-table-component';
import { Dropdown } from 'react-native-element-dropdown';
import { useAtom } from 'jotai';
import { firstNameAtom, emailAtom, userRoleAtom, entryDateAtom, phoneNumberAtom, addressAtom } from '../../context/ClinicalAuthProvider';
// import MapView from 'react-native-maps';
import { Jobs } from '../../utils/useApi';
import { useFocusEffect } from '@react-navigation/native';

export default function CompanyShift({ navigation }) {
  const tableHead = [
    'Degree/Discipline',
    'Entry Date',
    'Job ID',
    'Job Num. -#',
    'Location',
    'Unit',
    'Shift Dates & Times',
    'Shift',
    'View Shift/Bids',
    'Bids',
    'Job Status',
    'Hired',
    'Verify TS',
    'Rating',
    'Delete',
  ];

  const [totalPages, setTotalPages] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  //-----------------------------DropDown----------------------------
  
  const pageItems = [
    {label: '10 per page', value: '10'},
    {label: '25 per page', value: '25'},
    {label: '50 per page', value: '50'},
    {label: '100 per page', value: '100'},
    {label: '500 per page', value: '500'},
    {label: '1000 per page', value: '1000'},
  ]

  const [value, setValue] = useState(100);
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
  //---------------------------------------Animation of Background---------------------------------------
  const [backgroundColor, setBackgroundColor] = useState('#0000ff'); // Initial color
  let colorIndex = 0;

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
    }, 500); // Change color every 5 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const [data, setData] = useState([]);
  async function getData() {
    let Data = await Jobs('jobs', 'Facilities');
    if(!Data) {
      setData(['No Data'])
    }
    else {
      setData(Data)
      setFilteredData(Data);
    }
    Data.unshift(tableHead);
    setTableData(Data);
    console.log('--------------------------', Data);
    // // setTableData(Data[0].degree)
    // tableScan(Data);
  }
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []) // Empty dependency array means this runs on focus
  );
  //------------------------------------------Search Function----------------
  const [searchTerm, setSearchTem] = useState(''); // Search term
  const handleSearch = (e) => {
    setSearchTem(e);
    const Data = []
    if (data.length >1) {
      Data = data.shift(data[0]);
    }
    else {
      Data = data
    }
    
    const filtered = Data.filter(row => 
      row.some(cell => 
        cell && cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(filtered);
    filtered.unshift(tableHead);
    setTableData(tableData)
    // setFilteredData(tableHead, ...filteredData);
  }
  //----------------------------change Current page--------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const getItemsForPage = (page) => {
    const startIndex = (page-1) * value;
    const endIndex = Math.min(startIndex + value, filteredData.length);
    return filteredData.slice(startIndex, endIndex);
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
  };

  const itemsToShow = getItemsForPage(currentPage);

  //------------------------------table Component---------------------------
  const widths = [150, 100, 80, 100, 150, 70, 150, 80, 150, 80, 200, 80, 100, 80, 100];
  const RenderItem = ({ item, index }) => (
    <View key={index} style={{ backgroundColor: index !== 0 ? 'white' : '#ccffff', flexDirection: 'row' }}>
      {widths.map((width, idx) => (
        <Text key={idx} style={[styles.tableItemStyle, { width }]} onPress={() => itemChange(item, idx)}>
          {item[idx]}
        </Text>
      ))}
    </View>
  );
  
  const TableComponent = () => (
    <View style={{ borderColor: '#AAAAAA', borderWidth: 1, marginBottom: 3 }}>
      {itemsToShow.map((item, index) => (
        <RenderItem key={index} item={item} index={index} />
      ))}
    </View>
  );

  const itemChange = (item, idx) => {

  }

  //-------------------------------itemChangeDropBox==================
  const degreeItem = [
    {label: '10 per page', value: '10'},
    {label: '25 per page', value: '25'},
    {label: '50 per page', value: '50'},
    {label: '100 per page', value: '100'},
    {label: '500 per page', value: '500'},
    {label: '1000 per page', value: '1000'},
  ]
  return (
    <View style={styles.container}>
      <StatusBar
        translucent backgroundColor="transparent"
      />
      <MHeader navigation={navigation} />
      <SubNavbar navigation={navigation} name={"FacilityLogin"} />
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
          <TouchableOpacity style={[styles.subBtn, {}]} onPress={() => navigation.navigate('AddJobShift')}>
            <View style={{ backgroundColor: 'white', borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <Text style={{ fontWeight: 'bold', color: '#194f69', textAlign: 'center', marginTop: 0 }}>+</Text>
            </View>
            <Text style={styles.profileTitle}>Add A New Job / Shift
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.subBtn, {}]} onPress={() => {
            navigation.navigate('FacilityProfile'),
              console.log("data-------", data)
          }}>
            <Text style={styles.profileTitle}>🏚️ Facilities Home</Text>
          </TouchableOpacity>
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
              <View style={[styles.searchBar, {width: '60%'}]}>
                <TextInput
                  style={[styles.searchText, {height: 30}]}
                  placeholder=""
                  onChangeText={e => handleSearch(e)}
                  value={searchTerm || ''}
                />
                <TouchableOpacity style={styles.searchBtn}>
                  <Text>Search</Text>
                </TouchableOpacity>
              </View>
              <View style= {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
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
                    const len = tableData.length;
                    console.log(len, 'ddddd00000')
                    const page = Math.ceil(len / item.value);
                    setTotalPages(page);
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
              </View>
              { totalPages> 1 &&
                <View style={{display: 'flex', flexDirection: 'row', height: 30, marginBottom: 10, alignItems: 'center'}}>
                  <Text onPress={handlePrevPage} style={{width: 20}}>{currentPage>1 ? "<": " "}</Text>
                  <Text style={{width: 20}}>{" "+currentPage+" "}</Text>
                  <Text onPress={handleNextPage} style={{width: 20}}>{currentPage<totalPages ? ">" : " "}</Text>
                </View>
              }
              <ScrollView horizontal={true} style={{marginBottom: 30, width: '95%'}}>
                <TableComponent style={{width: '95%'}} data={itemsToShow} />
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
    marginBottom: 100
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
    backgroundColor: 'rgba(79, 44, 73, 0.19)',
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
    marginBottom: 10,
  },
  searchText: {
    width: '70%',
    backgroundColor: 'white',
    height: 30,
  },
  searchBtn: {
    width: '30%',
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
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
  },
  tableItemStyle: { 
    borderColor: '#AAAAAA', 
    borderWidth: 1, 
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 30
  },
  dropdown: {
    height: 40,
    width: '60%',
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
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    margin: 10,
    borderRadius: 10,
    height: 30,
    marginBottom: 10,
  },
  searchText: {
    width: '70%',
    backgroundColor: 'white',
    height: 30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0
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
