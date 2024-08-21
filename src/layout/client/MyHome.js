import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, PaperProvider, DataTable } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import ImageButton from '../../components/ImageButton';
import { useAtom } from 'jotai';
import { firstNameAtom, emailAtom, userRoleAtom, caregiverAtom } from '../../context/ClinicalAuthProvider';


export default function MyHome ({ navigation }) {
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [email, setEmail] = useAtom(emailAtom);
  const [userRole, setUserRole] = useAtom(userRoleAtom);
  const [caregiver, setCaregiver] = useAtom(caregiverAtom);
  const handleNavigate = (navigateUrl) => {
      navigation.navigate(navigateUrl);
  }

  const userInfo = [
    {title: 'Name', content: firstName},
    {title: 'Email', content: email},
    {title: 'User Roles', content: userRole},
    {title: 'Caregiver', content: caregiver},
  ]

  // const userInfo = [
  //   {title: 'Name', content: "Dale"},
  //   {title: 'Email', content: "dalewong008@gmail.com"},
  //   {title: 'User Roles', content: 'Clinicians'},
  //   {title: 'Caregiver', content: ''},
  // ]

  return (
      <View style={styles.container}>
        <StatusBar 
            translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <SubNavbar navigation={navigation} name={'ClientSignIn'}/>
        <ScrollView style={{width: '100%', marginTop: 139}}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topView}>
            <Image
              source={images.mark}
              resizeMode="cover"
              style={styles.mark}
            />
            <View style={styles.bottomBar}/>
          </View>
          <View style={styles.imageButton}>
            <ImageButton title={"My Profile"} onPress={() => handleNavigate('MyProfile')} />
            <ImageButton title={"All Shift Listings"} onPress={() => handleNavigate('ShiftListing')} />
            <ImageButton title={"My Shifts"} onPress={() => handleNavigate('Shift')} />
            <ImageButton title={"My Reporting"} onPress={() => handleNavigate('Reporting')} />
          </View>
          <View style={styles.profile}>
            {
              userInfo.map((item, index) => 
                <View key={index} style={{flexDirection: 'row'}}>
                  <Text style={styles.titles}>{item.title}</Text>
                  <Text style={[
                    styles.content, 
                    item.title == "Name" ? {fontWeight: 'bold'} : 
                    item.title == "Email" ? {color: '#2a53c1', textDecorationLine:'underline'} : {}
                  ]}>{item.content}</Text>
                </View>
              )
            }
          </View>
          <Image
            source={images.homepage}
            resizeMode="cover"
            style={styles.homepage}
          />
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
    marginTop: 50,
    marginLeft: '10%',
    width: '80%',
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center'
  },
  mark: {
    width:225,
    height: 68,
    marginBottom: 30
  },
  bottomBar: {
    height: 5,
    backgroundColor: '#C0D1DD',
    width: '100%'
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
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
    marginLeft: '5%'
  },
  homepage: {
    // paddingHorizontal: 30,
    // paddingVertical: 70,
    marginLeft: '15%',
    width: 250,
    height: 200,
    marginTop: 30,
    marginBottom: 100
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
  }
});
  