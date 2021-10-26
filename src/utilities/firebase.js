import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup, signOut } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyBJw4ftYg7kYq2Z5UaHlaHGgxaNbRKPin4",
    authDomain: "fb-scheduler-tutorial.firebaseapp.com",
    databaseURL: "https://fb-scheduler-tutorial-default-rtdb.firebaseio.com",
    projectId: "fb-scheduler-tutorial",
    storageBucket: "fb-scheduler-tutorial.appspot.com",
    messagingSenderId: "69379602664",
    appId: "1:69379602664:web:bd7d41ba69518d5bfe315d",
    measurementId: "G-3GK0ZP9DG2"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

  export const setData = (path, value) => (
    set(ref(database, path), value)
  );

  export const signInWithGoogle = () => {
    signInWithPopup(getAuth(firebase), new GoogleAuthProvider());
  };

  const firebaseSignOut = () => signOut(getAuth(firebase));

  export { firebaseSignOut as signOut };

  export const useUserState = () => {
    const [user, setUser] = useState();
  
    useEffect(() => {
      onIdTokenChanged(getAuth(firebase), setUser);
    }, []);
  
    return [user];
  };
//  export const useUserState = () => useAuthState(firebase.auth());