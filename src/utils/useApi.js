import axios from './axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import  { useNavigation, useRoute } from '@react-navigation/native';
import { Alert } from 'react-native';

const baseURL = ''

export const Signup = async (userData, endpoint) => {
  try {
    console.log('success')
    const response = await axios.post(`api/${endpoint}/signup`, userData);
    // const response = await axios.get("/test");
    return response.data;
  } catch (error) {
    console.log("================");
    console.log(error)
    throw error;
  }
};

export const Signin = async (credentials, endpoint) => {
  try {
    console.log("login");
    const response = await axios.post(`api/${endpoint}/login`, credentials);
    console.log('ewrw', response.data);
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error(error)    
    return {error: error.response.data};
  }
}

export const ForgotPassword = async (credentials, endpoint) => {
  try {
    console.log("login");
    const response = await axios.post(`api/${endpoint}/forgotPassword`, credentials);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error)    
    return {error: error.response.data.message};
  }
}

export const PhoneSms = async (credentials, endpoint) => {
  try {
    console.log("login");
    const response = await axios.post(`api/${endpoint}/phoneSms`, credentials);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(error)    
    return {error: error.response.data.message};
  }
}

export const VerifyCodeSend = async (credentials, endpoint) => {
  try {
    console.log("login", credentials);
    const response = await axios.post(`api/${endpoint}/verifyCode`, credentials);
    console.log(response);
    // if (response.data.verifyCode) {
    //   await AsyncStorage.setItem('token', response.data.verifyCode);
    // }
    return response.data;
  } catch (error) {
    console.error(error)    
    return {error: error.response.data.message};
  }
}

export const VerifyPhoneCodeSend = async (credentials, endpoint) => {
  try {
    console.log("login", credentials);
    const response = await axios.post(`api/${endpoint}/verifyPhone`, credentials);
    console.log(response);
    if (response.data.verifyCode) {
      await AsyncStorage.setItem('token', response.data.verifyCode);
    }
    return response.data;
  } catch (error) {
    console.error(error)    
    return {error: error.response.data.message};
  }
}

export const ResetPassword = async (credentials, endpoint) => {
  try {
    console.log("login", credentials);
    const response = await axios.post(`api/${endpoint}/resetPassword`, credentials);
    console.log(response);
    // if (response.data.verifyCode) {
    //   await AsyncStorage.setItem('token', response.data.verifyCode);
    // }
    return response.data;
  } catch (error) {
    console.error(error)    
    return {error: error.response.data.message};
  }
}

export const Update = async (updateData, endpoint) => {
  try {
    console.log("update");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');

    // Include token in Authorization header
    const response = await axios.post(`api/${endpoint}/update`, updateData, {
      headers: {
        Authorization: `Bearer ${existingToken}`
      },
    });
    console.log('Success');
    

    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } 
    return response.data;
  } catch (error) {
    throw error;
  }
}


export const Updates = async (updateData, endpoint) => {
  try {
    console.log("update");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');

    // Include token in Authorization header
    const response = await axios.post(`api/${endpoint}/update`, updateData, {
      headers: {
        Authorization: `Bearer ${existingToken}`,
        userRole: 'Admin'
      }
    });
    console.log('Success');
    

    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } 
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const UpdateUser = async (updateData, endpoint) => {
  try {
    console.log("update");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');

    // Include token in Authorization header
    const response = await axios.post(`api/${endpoint}/updateUser`, updateData, {
      headers: {
        Authorization: `Bearer ${existingToken}`
      }
    });

    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } 
    console.log(response.data);
    
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const PostJob = async (jobData, endpoint) => {
  try {
    console.log('success')
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    const response = await axios.post(`api/${endpoint}/postJob`, jobData, {
      headers: {
        Authorization: `Bearer ${existingToken}`
      }
    });
    // const response = await axios.get("/test");
    return response.data;
  } catch (error) {
    console.log("================");
    console.log(error)
    throw error;
  }
};

export const Jobs = async (endpoint, role) => {
  try {
    // console.log("jobs");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    console.log(existingToken)
    // Include token in Authorization header
    const response = await axios.get(`api/${endpoint}/shifts`, {
      headers: {
        Authorization: `Bearer ${existingToken}`,
        Role: role
      }
    });
    console.log(response.data.jobData)
    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } else if (response.status === 401) {
      console.log('Token is expired')
      // navigation.navigate('Home')
    }
    return response.data.jobData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const MyShift = async (endpoint, role) => {
  try {
    // console.log("jobs");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    console.log(existingToken)
    // Include token in Authorization header
    const response = await axios.get(`api/${endpoint}/myShift`, {
      headers: {
        Authorization: `Bearer ${existingToken}`,
        Role: role
      }
    });
    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } else if (response.status === 401) {
      console.log('Token is expired')
      // navigation.navigate('Home')
    }
    return response.data.jobData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const UpdateTime = async (data, endpoint) => {
  try {
    console.log('success')
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    const response = await axios.post(`api/${endpoint}/updateTime`, data, {
      headers: {
        Authorization: `Bearer ${existingToken}`
      }
    });
    // const response = await axios.get("/test");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export const GetDashboardData = async (endpoint, role) => {
  try {
    // console.log("jobs");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    console.log(existingToken)
    // Include token in Authorization header
    const response = await axios.get(`api/${endpoint}/getDashboardData`, {
      headers: {
        Authorization: `Bearer ${existingToken}`,
        Role: role
      }
    });
    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } else if (response.status === 401) {
      console.log('Token is expired')
      // navigation.navigate('Home')
    }
    return response.data.jobData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const PostBid = async (bidData, endpoint) => {
  try {
    console.log('success')
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    const response = await axios.post(`api/${endpoint}/postBid`, bidData, {
      headers: {
        Authorization: `Bearer ${existingToken}`
      }
    });
    // const response = await axios.get("/test");
    return response.data;
  } catch (error) {
    console.log("================");
    console.log(error)
    throw error;
  }
};

export const isTokenInLocalStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    return token !== null;

  } catch (error) {
    console.error('Error checking for token in localstorage:', error);
    return false;
  }
}

const failedAlert = (msg) => {
  Alert.alert(
    "SignIn failed",
    "",
    [
      {
        text: msg,
        onPress: () => {
          console.log('OK pressed')
        },
      },
    ],
    { cancelable: false }
  )
}

export const Clinician = async (endpoint, role) => {
  try {
    // console.log("jobs");
    // Existing token (obtained from AsyncStorage or login)
    const existingToken = await AsyncStorage.getItem('token');
    console.log(existingToken)
    // Include token in Authorization header
    const response = await axios.get(`api/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${existingToken}`,
        Role: role
      }
    });
    console.log(response.data.jobData)
    // If the update is successful, you can potentially update the token in AsyncStorage
    if (response.status === 200) {
      // Optionally, if the backend sends a new token for some reason
      if (response.data.token) {
        await AsyncStorage.setItem('token', response.data.token);
      }
    } else if (response.status === 401) {
      console.log('Token is expired')
      // navigation.navigate('Home')
    }
    return response.data.jobData;
  } catch (error) {
    console.log(error);
    
    throw error;
  }
}

export const fetchInvoices = async () => {
  try {
    console.log('fetch');
    
    const response = await axios.get(`api/jobs/generateInvoice`);
    console.log('success', response.data);
    
    return response.data
  } catch (error) {
      console.error('Error generating invoice:', error);
      return {error: error.response.data}
  }
};


export const sendInvoice = async (facilityId, email) => {
  try {
    console.log('fetch', facilityId, email);
    
    const response = await axios.post('api/jobs/sendInvoice', {
      facilityId: facilityId,
      email: email,
    });
    console.log('success');
    
    return response.data.invoiceData
  } catch (error) {
      console.error('Error generating invoice:', error.response.data);
      return {error: error.response.data}
  }
};
