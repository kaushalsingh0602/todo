import './firebaseConfig';// 🔥 Must be first
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import {  Text } from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import store from "./src/store";
// import firestore from '@react-native-firebase/firestore';
 import database from '@react-native-firebase/database';

const App = () => {



useEffect(() => {
  const ref = database().ref('test');
  ref
    .set({ msg: 'hello world' })
    .then(() => console.log('Data written!'))
    .catch(err => console.log('RTDB Error:', err));

  ref
    .once('value')
    .then(snapshot => console.log('Snapshot:', snapshot.val()))
    .catch(err => console.log('RTDB Error:', err));
}, []);


  return (
    <Provider store={store}>
      {/* Optional: wrap your navigator in SafeAreaView */}
      {/* <SafeAreaView style={{ flex: 1 }}> */}
        {/* <NavigationContainer> */}
        <AppNavigator />
        {/* </NavigationContainer> */}
      {/* </SafeAreaView> */}
    </Provider>
  );
};

export default App;
