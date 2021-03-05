import { createContext, useContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import router from 'next/router';
import Spinner from '../components/Spinner';

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
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'unauthenticated' | 'authenticated' | 'subscribed'
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (user) => {
        setUserAuth(user ? user : null);
        setStatus(user ? 'authenticated' : 'unauthenticated');
      },
      (error) => {
        setError(error);
        setStatus('error');
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userAuth) return;

    const unsubscribe = firebase
      .firestore()
      .doc(`users/${userAuth.uid}`)
      .onSnapshot(
        (doc) => {
          setUserStore(doc.data());
          setStatus('subscribed');
        },
        (error) => {
          setError(error);
          setStatus('error');
        }
      );

    return () => unsubscribe();
  }, [userAuth]);

  const user = (() => {
    if (!userAuth) return null;
    const { uid, email, displayName, photoURL } = userAuth;
    return { uid, email, displayName, photoURL, ...userStore };
  })();

  return (
    <FirebaseContext.Provider value={{ firebase, user, status, error }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseAuthorization = ({ children }) => {
  const { status } = useFirebase();

  switch (status) {
    case 'loading':
      return <Spinner fullscreen />;
    case 'error':
      return <p>Error...</p>; // TODO: deal with error state
    case 'unauthenticated': {
      if (router.pathname !== '/signin') {
        router.push('/signin');
        return <Spinner fullscreen />;
      }
      return children;
    }
    case 'authenticated':
      return <Spinner fullscreen />;
    case 'subscribed': {
      return children;
    }
  }
};
