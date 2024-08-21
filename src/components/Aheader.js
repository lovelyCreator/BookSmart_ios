import React, { useEffect, useState } from 'react';

import { View, Image, StyleSheet, StatusBar, Text, TouchableOpacity, Modal,TouchableWithoutFeedback } from 'react-native';
import images from '../assets/images';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { AuthState } from '../context/ClinicalAuthProvider';
import { useAtom } from 'jotai';
import { firstNameAtom, lastNameAtom,  } from '../context/AdminAuthProvider';
// import { getRatingDataByUserID } from '../utils/api';

export default function AHeader({currentPage, navigation}) {
  const theme = useTheme();
  const [firstName, setFirstName] = useAtom(firstNameAtom);
  const [lastName, setLastName] = useAtom(lastNameAtom);
  const handleNavigate = () => {
    navigation.navigate('ClientSignIn')
  }
  const [modal, setModal] = useState(false);
  const toggleModal = () => {
    setModal(!modal);
  }
  const handlePageNavigate = (navUrl) => {
    toggleModal();
    navigation.navigate(navUrl);
  }
  return (
    <Card style={styles.shadow} onPress={ handleNavigate }>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <TouchableOpacity style={{width: 40, height: 70, flexDirection: 'column', justifyContent:'space-between', paddingTop: 50, paddingLeft: 20, zIndex: 0}} onPress={toggleModal}>
          <View style={{width: '100%', height: 4, backgroundColor: 'white', borderRadius: 2}}></View>
          <View style={{width: '100%', height: 4, backgroundColor: 'white', borderRadius: 2}}></View>
          <View style={{width: '100%', height: 4, backgroundColor: 'white', borderRadius: 2}}></View>
        </TouchableOpacity>
        <Text style={styles.text}>BookSmart™</Text>
        <View style={{width: 50, height: 20}} />
      </View>
      <View style={styles.bottomStyle}></View>
          <Modal
            visible={modal}
            transparent= {true}
            animationType="fade"
            onRequestClose={toggleModal}
          >
            <StatusBar hidden={true}/>
            <TouchableWithoutFeedback onPress={toggleModal}>
              <View style={styles.modalContainer} >
                <TouchableWithoutFeedback>
                  <View style={styles.calendarContainer}>
                    <View style={styles.header}>
                      <Text style={styles.headerText}>{firstName + ' ' + lastName}</Text>
                      {/* <TouchableOpacity style={{width: 20, height: 20, }} onPress={toggleModal}>
                        <Image source = {images.close} style={{width: 20, height: 20,}}/>
                      </TouchableOpacity> */}
                    </View>
                    <View style={styles.body}>
                      <View style={styles.modalBody}>
                        <Text style={[styles.subTitle, currentPage === 0 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminDashboard')}>📊 Admin Dashboard</Text>
                        <Text style={[styles.subTitle, currentPage === 1 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AllJobShiftListing')}>📋 All Job  / Shift Listings</Text>
                        <Text style={[styles.subTitle, currentPage === 2 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminCompany')}>💼 Admin / Company Profile</Text>
                        <Text style={[styles.subTitle, currentPage === 3 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminHome')}>🏚️ Admin Home</Text>
                        <Text style={[styles.subTitle, currentPage === 4 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AllCaregivers')}>👩‍⚕️ All Caregivers</Text>
                        <Text style={[styles.subTitle, currentPage === 5 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminAllUser')}>🎯 Admin - All Users </Text>
                        <Text style={[styles.subTitle, currentPage === 6 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('AdminFacilities')}>🏢 All Facilites</Text>
                        <Text style={[styles.subTitle, currentPage === 7 && {backgroundColor: 'grey'}]} onPress={() => handlePageNavigate('CaregiverTimeSheet')}>Caregiver Timesheet</Text>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal> 
    </Card>
  );
}

const styles = StyleSheet.create({
  shadow: {
    borderRadius: 0,
    backgroundColor: '#13032f',
    width: '100%',
    top: 0,
    position:'absolute',
  },
  text: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingRight: 20,
    paddingTop: 50,
    paddingVertical: 10,
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
    // marginRight: 20
  },
  bottomStyle: {
    width: '100%',
    height: 5,
    backgroundColor: "#BC222F"
  },
  modalContainer: {
    display: 'block',
    height: '100%',
    zIndex: 10
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: '#f2f2f2',
    elevation: 5,
    width: '70%',
    borderColor: '#7bf4f4',
    height: '100%'
  },
  modalBody: {
    // backgroundColor: 'rgba(79, 44, 73, 0.19)',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    width: '100%'
  },
  header: {
    height: 60,
    paddingLeft: 20,
    paddingTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
  },
  subTitle: {
    paddingVertical: 10,
    color: 'blue',
    fontSize: 18,
    width: '100%'
  }
});
