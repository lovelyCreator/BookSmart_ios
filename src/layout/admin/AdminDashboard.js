import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet, ScrollView, StatusBar, Easing, TouchableOpacity } from 'react-native';
import { Text, PaperProvider, DataTable, useTheme } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import AHeader from '../../components/Aheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { Table, Row, Rows } from 'react-native-table-component';
import { GetDashboardData } from '../../utils/useApi';
import { useAtom } from 'jotai';
import { firstNameAtom, lastNameAtom, userRoleAtom } from '../../context/AdminAuthProvider';
import { useFocusEffect } from '@react-navigation/native';
// import MapView from 'react-native-maps';

export default function AdminDashboard ({ navigation }) {
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
  
  const [myJobInfo, setMyJobInfo] = useState({
    totalJob: 0,
    totalAvailable: 0,
    totalAwarded: 0,
    totalCompleted: 0,
    totalCanceled: 0,
  })

  const [jobInfo, setJobInfo] = useState([
    {title: 'TOT. - JOBS / SHIFTS', content: myJobInfo.totalJob},
    {title: 'TOT. - AVAILABLE', content: myJobInfo.totalAvailable},
    {title: 'TOT. - AWARDED', content: myJobInfo.totalAwarded},
    {title: 'TOT. - COMPLETED', content: myJobInfo.totalCompleted},
    {title: 'TOT. - CANCELED', content: myJobInfo.totalCanceled},
  ])

  const [data, setData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [tableData2, setTableData2] = useState([]);
  const [tableData3, setTableData3] = useState([]);
  const [sum1,setSum1] = useState(0);
  const [sum2, setSum2] = useState(0);
  const [sum3,setSum3] = useState(0);
  
  async function getData() {
    let Data = await GetDashboardData('jobs', 'Admin');
    if(!Data) {
      setData(['No Data'])
    }
    else {
      setData(Data) 
      const newTableData1 = Data.job.map(item => [item._id, item.count]);
      setTableData1(newTableData1); // Update state
      const newTableData2 = Data.nurse.map(item => [item._id, item.count]);
      setTableData2(newTableData2); // Update state
      const newTableData3 = Data.cal.map(item => [item._id, item.count]);
      setTableData3(newTableData3); // Update state
      console.log('--------------------------', newTableData1);
      let s1=0;
      let s2=0;
      let s3=0;
      Data.job.map((item, index) => {
        s1 += item.count;
      })
      Data.nurse.map((item, index) => {
        s2 += item.count;
      })
      Data.cal.map((item, index) => {
        s3 += item.count;
      })
      setSum1(s1)
      setSum2(s2)
      setSum3(s3)
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, []) // Empty dependency array means this runs on focus
  );


  const tableDatas = [
    {
      title: 'JOBS / SHIFTS BY STATUS',
      header: [
        'Job Status',
        'Count',
      ],
      data: tableData1,
      final: ['Sum',sum1],
    },
    {
      title: 'JOBS / SHIFTS BY NURSE',
      header: [
        'Nurse',
        'Count',
      ],
      data: tableData2,
      final: ['Sum',sum2],
    },
    {
      title: 'JOBS / SHIFTS BY MONTH',
      header: [
        'Month',
        'Count',
      ],
      data: tableData3,
      final: ['Sum',sum3],
    }
  ]

  const theme = useTheme();
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastNameAtom] = useAtom(lastNameAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);

  const userInfo = [
    {title: 'Name', content: firstName + " "+lastName},
    {title: 'User Roles', content: userRole},
  ]
  

  return (
      <View style={styles.container}>
        <StatusBar 
            translucent backgroundColor="transparent"
        />
        <AHeader navigation={navigation} currentPage={0} />
        <SubNavbar navigation={navigation} name={"AdminLogin"}/>
        <ScrollView style={{width: '100%', marginTop: 140}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topView}>
            <Animated.View style={[styles.backTitle, {backgroundColor}]}>
              <Text style={styles.title}>ADMIN DASHBOARD</Text>
            </Animated.View>
            <View style={styles.bottomBar}/>
          </View>
          <View style={{paddingVertical: 40, backgroundColor: '#c6c5c5', marginTop: 20, width: '80%', marginLeft: '10%', borderRadius: 10}}>
            {
              jobInfo.map((item, index) => 
                <View key={index} style={{flexDirection: 'column', alignItems: 'center'}}>
                  <Text style={styles.titles}>{item.title}</Text>
                  <Text style={styles.content}>
                    {item.content}
                  </Text>
                </View>
              )
            }
          </View>
          {tableDatas.map((item, index)=> 
            <View key={index} style={{paddingVertical: 40, backgroundColor: '#c6c5c5', marginTop: 20, width: '80%', marginLeft: '10%', borderRadius: 10, display: 'flex', alignItems:'center'}}>
              <View style={styles.profileTitleBg}>
                <Text style={styles.profileTitle}>{item.title}</Text>
              </View>
              <Text style={styles.Italic}>"Click On Any Value To View Details"</Text>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)', width: 300, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                  <Row
                    data={item.header}
                    style={styles.head}
                    widthArr={[200,80]}
                    textStyle={styles.tableText}
                  />
                  <Rows
                    data={item.data}
                    widthArr={[200,80]}
                    style = {{backgroundColor: '#E2E2E2', color: 'black'}}
                    textStyle = {styles.tableText}
                  />
                  <Row
                    data={item.final}
                    style={styles.head}
                    widthArr={[200,80]}
                    textStyle={styles.tableText}
                  />
                </Table>
              </View>
            </View>
          )}
          <View style = {{height: 100}}/>
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
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center'
  },
  backTitle: {
    backgroundColor: 'black',
    width: '90%',
    height: '55',
    marginLeft: '5%',
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
  titles: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 40,
    textAlign: 'center',
    color: 'white',
    padding: 5,
    width: '60%',
    backgroundColor: "#2243f3", 
    borderRadius: 10
  },
  content: {
    fontSize: 16,
    lineHeight: 40,
  },
  profileTitleBg: {
    backgroundColor: '#BC222F',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '80%',
    // marginLeft: '10%',
    marginBottom: 20
  },
  profileTitle: {
    fontWeight: 'bold',
    color: 'white',
  },
  Italic: {
    fontStyle: 'italic',
    color: '#0000ff',
    // marginLeft: '10%',
    marginBottom: 20, 
  },
  head: {
    backgroundColor: '#7be6ff4f',
    // width: 2000,
    height: 40,
  },
  tableText: {
    paddingHorizontal: 10,
    fontWeight: 'bold',
    width: '100%',
    color: 'black',
    textAlign: 'center'
  }
});
  