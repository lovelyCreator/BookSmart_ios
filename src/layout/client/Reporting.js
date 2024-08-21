import React, { useState, useEffect, useRef } from 'react';
import { FlatList, Modal, TextInput, View, Image, Animated, StyleSheet, ScrollView, StatusBar, Easing, TouchableOpacity } from 'react-native';
import { Text, PaperProvider, DataTable, useTheme } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { useAtom } from 'jotai';
import { firstNameAtom, emailAtom, userRoleAtom, entryDateAtom, phoneNumberAtom, addressAtom } from '../../context/ClinicalAuthProvider';
// import MapView from 'react-native-maps';
import * as Progress from 'react-native-progress';
import { MyShift, UpdateTime, Update } from '../../utils/useApi';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import moment from 'moment';

export default function Reporting ({ navigation }) {
  //---------------------------------------Animation of Background---------------------------------------
  const [backgroundColor, setBackgroundColor] = useState('#0000ff'); // Initial color
  let colorIndex = 0;

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate a random color
      if(colorIndex >= 0.9) {
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

  const theme = useTheme();
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  const [entryDate, setEntryDate] = useAtom(entryDateAtom);
  const [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  const [address, setAddress] = useAtom(addressAtom);
  const handleNavigate = (navigateUrl) => {
    navigation.navigate(navigateUrl);
  }

  //--------------------Gathering Data from Backend--------------
  
  const [data, setData] = useState({reportData: [],dailyPay: 0, weeklyPay: 0});
  const [userInfos, setUserInfo] = useState([]);
  const [detailedInfos, setDetailedInfos] = useState([]);
  const [clocks, setClocks] = useState([]);
  const [dailyPay, setDailyPay] = useState({date: '', pay: 0});
  const [weeklyPay, setWeeklyPay] = useState({date: '', pay: 0});
  const [times, setTimes] = useState([]);
  
  async function getData() {
    let Data = await MyShift('jobs', 'Clinicians');
    console.log("date------------------------", Data);
    if (!Data) {
      setData(['No Data']);
    } else {
      setData(Data);
      let transformedData = [];
      const monthGroups = {};
      const extractVerifiedJobs = Data.reportData.filter(job => job.shiftStatus === "Verified");
      console.log(extractVerifiedJobs);
      setClocks(extractVerifiedJobs)
      
      transformedData = Data.reportData.map(({ entryDate, jobId, shiftStatus, unit, shiftDateAndTimes }, index) => ({ key: index, entryDate, jobId, jobStatus: shiftStatus, unit, shiftDateAndTimes }));
      // console.log("date------------------------", transformedData);
      transformedData.forEach(item => {
        const month = item.entryDate.split('/')[0] + "/24"; // Get the MM part
        if (!monthGroups[month]) {
          monthGroups[month] = []; // Initialize an array for the month
        }
        monthGroups[month].push(item);
      });
      // console.log("mm", data);
      // Get keys and sort them based on date
      const sortedKeys = Object.keys(monthGroups).sort((a, b) => {
        const dateA = new Date(a.split('/')[1], a.split('/')[0] - 1); // Month is 0-indexed
        const dateB = new Date(b.split('/')[1], b.split('/')[0] - 1);
        return dateB - dateA; // Sort in ascending order
      });
      // Create a sorted object based on sorted keys
      const sortedMonthGroups = {};
      sortedKeys.forEach(key => {
        sortedMonthGroups[key] = monthGroups[key];
      });
      // console.log(sortedMonthGroups, "sort");
      const mothData = Object.keys(sortedMonthGroups).map(month => ({
        month: month,
        number: String(sortedMonthGroups[month].length) // Count of entries for that month
      }));
      mothData.unshift({ "month": "Month", "number": "Count" });
      mothData.push({ "month": "Sum", "number": String(Data.reportData.length) });
      // console.log(mothData);
      const totalPayString = Data.dailyPay;
      const weeklyPayString = Data.weeklyPay;
      // console.log(Data.dailyPay, Data.weeklyPay);
      setDailyPay(totalPayString);
      setWeeklyPay(weeklyPayString);
      setUserInfo(mothData);
      setDetailedInfos(sortedMonthGroups);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []) // Empty dependency array to only run on focus
  );

  const [myShiftDate, setMyShiftDate] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const myRenderItem = ({ item, index }) => {
    return (
      <View key={index} style={[styles.row, index === 0 ? styles.evenRow : null, ]}>
        <Text style={{width: '20%', textAlign: 'center', fontWeight: 'bold'}}>{item.text1}</Text>
        <View style={{width: 1, height: '200%', backgroundColor: 'hsl(0, 0%, 86%)', position: 'absolute', left: '25%'}} />
        <Text style={[{width: '40%', textAlign: 'center'}, index == 0 ? {fontWeight: 'bold'}: {fontWeight: '400'}]}>{item.text2}</Text>
        <View style={{width: 1, height: '200%', backgroundColor: 'hsl(0, 0%, 86%)', position: 'absolute', left: '65%' }} />
        <Text style={[{width: '20%', textAlign: 'center'}, index == 0 ? {fontWeight: 'bold'}: {fontWeight: '400'}]}>{item.text3}</Text>
        <View style={{width: 1, height: '200%', backgroundColor: 'hsl(0, 0%, 86%)', position: 'absolute', left: '85%'}} />
        <Text style={[{width: '20%', textAlign: 'center'}, index == 0 ? {fontWeight: 'bold'}: {fontWeight: '400'}]}>{item.text4}</Text>
      </View>
    );
  };

  //--------------------------------------------------detailed Info-------------------------------------------------------------
  
  //------------------------------------------Search Function----------------
  const [searchTerm, setSearchTem] = useState(''); // Search term
  const [filteredData, setFilteredData] = useState([]);
  const handleSearch = (e) => {
    setSearchTem(e);
    // console.log(e, '------------');
    if (e !== '') {
      const filtered = myShiftDate.filter(item => 
        Object.values(item).some(value => 
          value.toString().toLowerCase().includes(e.toLowerCase())
        )
      );
      filtered.unshift({text1: 'Job-ID', text2: 'Job Status', text3: 'Unit', text4: 'Shift'});
      console.log("detailedData", filtered);
      setFilteredData(filtered);
    }
    else {
      let detailedData = myShiftDate;
      detailedData.unshift({text1: 'Job-ID', text2: 'Job Status', text3: 'Unit', text4: 'Shift'});
      console.log("detailedData", detailedData);
      setFilteredData(detailedData);
    }
  }

  const handleClick = (id) => {
    if (id !== 'Month' && id !== 'Sum'){
      const detailedData = detailedInfos[id].map(({jobId, jobStatus, unit, shiftDateAndTimes})=> ({"text1": jobId, "text2": jobStatus, "text3": unit, "text4": shiftDateAndTimes}))      
      setMyShiftDate(detailedData);
      detailedData.unshift({text1: 'Job-ID', text2: 'Job Status', text3: 'Unit', text4: 'Shift'});
      // console.log("detailedData", id, detailedData);
      setFilteredData(detailedData);
      toggleModal();
    }
  }
  
  const toggleModal = () => {
    setShowModal(!showModal);
  }

  const handleButtonClick = async(jobId, laborSate) => {
    const timeNow = moment(new Date()).format("MM/DD/YYYY hh:mm") // Get current time as a string
    const existingJobIndex = times.findIndex(time => time.jobId === jobId)
    let deliverArray = {};
    let index = 0;
    if (laborSate == 0) {
        // If the jobId does not exist, add a new object
        index = times.length-1;
        console.log(index, times);
        deliverArray = { jobId, laborState: 1, shiftStartTime: timeNow, shiftEndTime: '' };
        setTimes([...times, { jobId, laborState: 1, shiftStartTime: timeNow, shiftEndTime: '' }]);
    } else {
        // If the jobId exists, update the existing object's shiftEndTime and laborState
        const updatedTimes = [...times];
        updatedTimes[existingJobIndex].shiftEndTime = timeNow; // Update shiftEndTime
        updatedTimes[existingJobIndex].laborState = 2; // Update laborState to false
        setTimes(updatedTimes); // Set the updated array back to state
        index = existingJobIndex;
        deliverArray = updatedTimes[index]
    }
    console.log(times[index]);
    const update = await UpdateTime(deliverArray, 'jobs')
    if(update) {
      getData();
    }
};

  return (
      <View style={styles.container}>
        <StatusBar 
            translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <SubNavbar navigation={navigation} name={'ClientSignIn'}/>
        <ScrollView style={{width: '100%', marginTop: 140}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topView}>
            <Animated.View style={[styles.backTitle, {backgroundColor}]}>
              <Text style={styles.title}>CAREGIVER REPORTING</Text>
            </Animated.View>
            <View style={styles.bottomBar}/>
          </View>
          <View style={styles.imageButton}>
            <ImageButton title={"My Home"} onPress={() => handleNavigate('MyHome')} />
            <ImageButton title={"My Profile"} onPress={() => handleNavigate('MyProfile')} />
            <ImageButton title={"All Shift Listings"} onPress={() => handleNavigate('ShiftListing')} />
            <ImageButton title={"My Shifts"} onPress={() => handleNavigate('Shift')} />
          </View>
          <View style={styles.profile}>
            <View style={styles.profileTitleBg}>
              <Text style={styles.profileTitle}>MY SHIFTS BY MONTH</Text>
            </View>
            <Text style={styles.name}>"Click On Any Value To View Details"</Text>
            {
              userInfos.map((item, index) => 
                <View key={index} style={[styles.row, {paddingHorizontal: 0}, index === 0 || index === userInfos.length-1 ? styles.evenRow : null]}>
                  <Text style={{width: '50%', textAlign: 'center', fontWeight: 'bold'}}>{item.month}</Text>
                  <View style={{width: 1, height: 40, backgroundColor: 'hsl(0, 0%, 86%)', position: 'absolute', left: '50%'}} />
                  <Text style={[{width: '50%', textAlign: 'center'}, index == 0 || index === userInfos.length-1 ? {fontWeight: 'bold'}: {fontWeight: '400'}]} onPress={() => handleClick(item.month)}>{item.number}</Text>
                </View>
              )
            }
            {
              clocks.map((item, index) => 
                <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10,height: 40}}>
                  {
                    item.laborState === 2 ? 
                    <Text style={{backgroundColor: '#394232', padding: 10, textAlign: 'center', fontWeight: 'bold', color: 'black', borderRadius: 5}}
                    >
                      Ended
                    </Text>
                    :
                    <TouchableOpacity onPress={() => handleButtonClick(item.jobId, item.laborState)}>
                      <Text style={{backgroundColor: '#BC222F', padding: 10, textAlign: 'center', fontWeight: 'bold', borderRadius: 5, color: 'white'}}>
                        {item.laborState === 0?'Clock In': 'Clock Out'}
                      </Text>
                    </TouchableOpacity>
                  }
                  <Text style={[styles.name, {padding: 10, height: '100%',}]}>JobId: {item.jobId}</Text>
                  <View style={{height: '100%'}}>
                    <Text style={styles.name}>{item.shiftStartTime}</Text>
                    <Text style={styles.name}>{item.shiftEndTime}</Text>
                  </View>
                </View>
              )
            }
            <View style={[styles.profileTitleBg, {marginTop: 30}]}>
              <Text style={styles.profileTitle}>Daily & Weekly Pay</Text>
            </View>
            <View style={{width: '90%', marginBottom: 30}}>
              <Text style={styles.name}>{`Day:      ${dailyPay.date}     $${dailyPay.pay}`}</Text>
              <Text style={styles.name}>{`Week:  ${weeklyPay.date}  $${weeklyPay.pay}`}</Text>
            </View>
            {/* <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            /> */}
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
                  <Text style={styles.headerText}>Modal Header</Text>
                  <TouchableOpacity style={{width: 20, height: 20, }} onPress={toggleModal}>
                    <Image source = {images.close} style={{width: 20, height: 20,}}/>
                  </TouchableOpacity>
                </View>
                <View style={styles.body}>
                  <View style={styles.modalBody}>
                    <View style={styles.searchBar}>
                      <TextInput
                        style={[styles.searchText]}
                        placeholder=""
                        onChangeText={e => handleSearch(e)}
                        value={searchTerm || ''}
                      />
                      <TouchableOpacity style={styles.searchBtn}>
                        <Text>Search</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{width: '90%', marginBottom: 30}}>
                      <FlatList
                        data={filteredData}
                        renderItem={myRenderItem}
                        keyExtractor={(item) => item.id}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Modal>}
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
    width: '90%',
    marginLeft: '5%',
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
    marginBottom: 100
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
    paddingHorizontal:20,
    paddingBottom: 30
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
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '60%',
    borderRadius: 10,
    height: 30,
    marginBottom: 10,
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
  filter: {
    width: '90%',
    display:'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5,
  },
  filterBtn: { 
    backgroundColor: 'rgba(0, 0, 0, 0.08)', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems:'center',
    padding: 5,
    gap: 5,
    marginBottom: 10
  },
  filterText: {
    color: '#2a53c1',
  }
});
  