import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Animated, StyleSheet, ScrollView, StatusBar, Easing, TouchableOpacity } from 'react-native';
import { Text, PaperProvider, DataTable, useTheme } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { useAtom } from 'jotai';
import { firstNameAtom, lastNameAtom, userRoleAtom } from '../../context/AdminAuthProvider';
import AHeader from '../../components/Aheader';
// import MapView from 'react-native-maps';

export default function AdminHome ({ navigation }) {
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
        <AHeader currentPage={3} navigation={navigation} style={{zIndex: 10}}/>
        <SubNavbar navigation={navigation} name={"AdminLogin"} style={{zIndex: 0}}/>
        <ScrollView style={{width: '100%', marginTop: 119}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topView}>
            <Animated.View style={[styles.backTitle, {backgroundColor}]}>
              <Text style={styles.title}>CAREGIVER PROFILE & DOCS</Text>
            </Animated.View>
            <View style={styles.bottomBar}/>
          </View>
            {
              userInfo.map((item, index) => 
                <View key={index} style={{flexDirection: 'row', width: '90%', marginLeft: '10%'}}>
                  <Text style={[styles.titles, item.title == "Name" ? {fontWeight: 'bold'} : '']}>{item.title}</Text>
                  <Text style={[
                    styles.content, 
                    item.title == "Phone" || item.title == "Email" ? {color: '#2a53c1', textDecorationLine:'underline', width: '100%'} : {}
                  ]}>{item.content}</Text>
                </View>
              )
            }
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
    width: '40%'
  },
  content: {
    fontSize: 16,
    width: '60%',
    lineHeight: 40,
  },
});
  