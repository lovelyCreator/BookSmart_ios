import React, { useEffect, useState } from 'react';
import { Alert, View, TextInput, Image, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { Text, PaperProvider, DataTable } from 'react-native-paper';
import images from '../../assets/images';
import  { useNavigation, useRoute } from '@react-navigation/native';
import HButton from '../../components/Hbutton'
import MFooter from '../../components/Mfooter';
import MHeader from '../../components/Mheader';
import SubNavbar from '../../components/SubNavbar';
import { useAtom } from 'jotai';
import { contactEmailAtom } from '../../context/FacilityAuthProvider';
import { VerifyCodeSend } from '../../utils/useApi';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

export default function FacilityPassVerify ({ navigation }) {
  const handleNavigate = (navigateUrl) => {
      navigation.navigate(navigateUrl);
  }

  const [credentials, setCredentials] = useState(
    {
      verifyCode: 0,
    }
  );

  const handleCredentials = (target, e) => {
    setCredentials({...credentials, [target]: e})
    console.log(credentials)
  }

  
  const [value, setValue] = useState('');
  // const [enableMask, setEnableMask] = useState(true);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  
  // const toggleMask = () => setEnableMask((f) => !f);
  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;
    const borderColor = isFocused ? '#53FAFB' : '#151515';

    if (symbol) {
      textChild = symbol;
    } else if (isFocused) {
      textChild = <Cursor />;
    }
  //   console.log('symbol', symbol, 'textChild', textChild);
    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell,{ borderWidth: 1, borderColor }]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const handleSubmit = async () => {
    handleCredentials('verifyCode', value)
    const response = await VerifyCodeSend({verifyCode: value}, 'facilities');
    console.log(response)
    if (!response.error) {
      console.log('success');
      
      navigation.navigate('FacilityResetPassword')
    }
    else {
      Alert.alert(
        'Failed!',
        `${response.error}`,
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
    }
  }
  const handleBack = () => {
    navigation.navigate('FacilityLogin');
  }
  return (
      <View style={styles.container}>
        <StatusBar 
          translucent backgroundColor="transparent"
        />
        <MHeader navigation={navigation} />
        <View style={{width: '100%', height: '60%', marginTop: 110, justifyContent:'center', alignItems: 'center', display: 'flex'}}
        >
          <View style={styles.authInfo}>
            <Text style={styles.subject}> You Received Verify Code? </Text>
            <Text style={[styles.subtitle,{textAlign: 'left', width: '90%', fontWeight: '400'}]}> Enter your verify code below. </Text>
            <View style={styles.email}>
              <Text style={styles.subtitle}> Verify Code </Text>
              <View style={{flexDirection: 'row', width: '100%', gap: 5}}>
                {/* <TextInput
                  style={[styles.input, {width: '100%'}]}
                  placeholder=""
                  autoCorrect={false}
                  autoCapitalize="none"
                  keyboardType="phone-pad"
                  onChangeText={e => handleCredentials('verifyCode', parseInt(e))}
                  value={credentials.verifyCode || ''}
                /> */}
                
                {/* <View style = {styles.verify}> */}
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        cellCount={CELL_COUNT}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={renderCell}
                    />
                {/* </View> */}
              </View>
            </View>
            <View style={[styles.btn, {marginTop: 20}]}>
              <HButton style={styles.subBtn} onPress={ handleSubmit }>
                Submit
              </HButton>
            </View>
            <Text style={{textDecorationLine: 'underline', color: '#2a53c1', marginBottom: 100, textAlign: 'left', width: '90%'}}
              onPress={handleBack}
            >
              Back to 🏚️ Caregiver Home
            </Text>
          </View>
        </View>
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
    width: '100%',
    backgroundColor: '#cccccc'
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
  },
  subtitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: 'white', 
    height: 30, 
    marginBottom: 10, 
    borderWidth: 1, 
    borderColor: 'hsl(0, 0%, 86%)',
    paddingVertical: 5
  },
  subject: {
    borderRadius: 2,
    borderColor: 'black',
    width: '90%',
    color: 'black',
    marginTop: 30,
    fontSize: 24,
    borderRadius: 5,
  },
  email: {
    width: '90%',
  },
  authInfo: {
    display:'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    marginTop: 140
  },
  btn: {flexDirection: 'column',
    gap: 20,
    marginBottom: 30,
    width: '90%'
  },
  subBtn: {
    marginTop: 0,
    padding: 10,
    backgroundColor: '#447feb',
    color: 'black',
    fontSize: 16,
  },
  verify: {
      width: "100%",
      aspectRatio: 360/78,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: "4%"
  },
  cell: {
    width: 40,
    height: 50,
    lineHeight: 20,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    textAlignVertical:'center',
    marginLeft: "2.8%",
    borderRadius: 10,
    backgroundColor: '#dddddd',
    color: 'black'
  },
  focusCell: {
    borderColor: 'black',
    color: 'black'
  },
});
  