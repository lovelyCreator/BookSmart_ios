import React, { useEffect } from 'react';
import { AppState } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { fetchInvoices } from './useApi';
import { invoiceFetchAtom } from '../context/BackProvider';
import { useAtom } from 'jotai';

const BackgroundTask = () => {
  const [invoiceFetch, setInvoiceFetch] = useAtom(invoiceFetchAtom);
  useEffect(() => {
    console.log('time', new Date());

    const scheduleTask = () => {
      const currentDate = new Date();
      const targetDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + ((5 - currentDate.getDay() + 7) % 7), // Friday
        10, // 6 AM
        21, // 51 minutes
        0 // 0 seconds
      );
      const timeUntilTarget = targetDate.getTime() - currentDate.getTime();
    
      const backgroundTimerId = BackgroundTimer.setTimeout(async () => {
        const fetch = await fetchInvoices();
        if (!fetch.error) {
          console.log(fetch.invoiceData);
          const invoice = fetch.invoiceData.forEach(item => {
            item.status = true;
          });
          setInvoiceFetch(fetch.invoiceData);
        }
        console.log('Result', fetch);
      }, timeUntilTarget);
    
      // Handle app state changes to ensure the task continues running in the background
      const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
      // Clean up the task and event listener when the component unmounts
      return () => {
        BackgroundTimer.clearTimeout(backgroundTimerId);
        appStateSubscription.remove();
      };
    };

    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        scheduleTask();
      }
    };

    scheduleTask(); // Start the initial scheduling
  }, []);

  return null;
};

export default BackgroundTask;
