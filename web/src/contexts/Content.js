import { createContext, useContext, useEffect, useReducer } from 'react';
import router from 'next/router';
import { useFirebase } from './Firebase';

const initialState = {
  status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
  topics: [],
  program: undefined,
  error: null,
};

const ContentContext = createContext(initialState);

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...initialState, status: 'loading' };
    case 'SUCCESS':
      return { ...state, status: 'success', ...action.content };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
  }
}

export const ContentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user } = useFirebase();

  const programId = user?.programId;

  useEffect(() => {
    async function getContent() {
      dispatch({ type: 'LOADING' });

      try {
        const response = await fetch(`/api/content/${programId}`);
        const { content, message } = await response.json();

        // getContent only runs if the user got a programId so if our
        // API returns a 404 we can assume the users programId no longer exist
        // in the CMS and they need to pick a new one, hence the redirect
        if (response.status === 404) router.push('/setup');

        !response.ok
          ? dispatch({ type: 'ERROR', error: { code: response.status, message: `${response.statusText}, ${message}` } }) // prettier-ignore
          : dispatch({ type: 'SUCCESS', content });
      } catch (error) {
        dispatch({ type: 'ERROR', error: { message: error.message } });
      }
    }

    if (programId) getContent();
  }, [programId]);

  return (
    <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
