import { createContext, useContext, useEffect, useReducer } from 'react';
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

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, status: 'loading', error: null };
    case 'ERROR':
      return { ...state, status: 'error', error: action.payload };
    case 'UNAUTHENTICATED':
      return { ...state, status: 'unauthenticated', user: null };
    case 'AUTHENTICATED': {
      const { uid, email, displayName, photoURL } = action.payload;
      return {
        ...state,
        status: 'authenticated',
        user: { uid, email, displayName, photoURL },
      };
    }
    case 'SUBSCRIBED':
      return {
        ...state,
        status: 'subscribed',
        user: { ...state.user, ...action.payload },
      };
    default:
      return state;
  }
}

const initialState = { status: 'loading', user: null, error: null };

export const FirebaseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(
      (user) =>
        user
          ? dispatch({ type: 'AUTHENTICATED', payload: user })
          : dispatch({ type: 'UNAUTHENTICATED' }),
      (error) => dispatch({ type: 'ERROR', payload: error })
    );

    return () => unsubscribe();
  }, [firebase]);

  useEffect(() => {
    if (state.status !== 'authenticated') return;

    const unsubscribe = firebase
      .firestore()
      .doc(`users/${state.user.uid}`)
      .onSnapshot(
        (doc) => dispatch({ type: 'SUBSCRIBED', payload: doc.data() }),
        (error) => dispatch({ type: 'ERROR', payload: error })
      );

    return () => unsubscribe();
  }, [firebase, state]);

  return (
    <FirebaseContext.Provider value={{ firebase, ...state }}>
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
      return <p>Error 😔</p>; // TODO: deal with error state
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
