import { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebase.apps.length) firebase.initializeApp(config);

const FirebaseContext = createContext(null);

export const FirebaseProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);
  const [userStore, setUserStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setUserAuth(!authUser ? null : authUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [firebase]);

  const isAuthenticated = !!userAuth;

  useEffect(() => {
    if (isAuthenticated) {
      const unsubscribe = firebase
        .firestore()
        .doc(`users/${userAuth.uid}`)
        .onSnapshot((document) => setUserStore(document.data()));

      return () => unsubscribe();
    }
  }, [firebase, userAuth, isAuthenticated]);

  const user = (() => {
    if (!isAuthenticated) return null;

    // combine user auth & firestore data to single object (for simplicity)
    const { uid, email, displayName, photoURL } = userAuth;
    return { uid, email, displayName, photoURL, ...userStore };
  })();

  return (
    <FirebaseContext.Provider
      value={{
        firebase,
        isLoading,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);
