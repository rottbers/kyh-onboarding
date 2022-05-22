import { createContext, useContext, useEffect, useReducer } from 'react';
import router from 'next/router';
import { useUserState } from './User';

/** TODO: look into codegen */
type Program = {
  _id: string;
  classCodes: [];
  csn: [
    {
      endDate: string;
      points: number;
      semester: string;
      startDate: string;
      weeks: number;
    }
  ];
  email: string;
  location: {
    title: string;
  };
  title: string;
};

/** TODO: look into codegen */
type Topic = {
  image: {
    metadata: {
      lqip: string;
    };
    url: string;
  };
  title: string;
};

type State = {
  status: 'idle' | 'loading' | 'success' | 'error';
  topics: Topic[];
  program?: Program;
  error?: { code?: number; message: string };
};

type Action =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; data: { topics: any[]; program: Program } }
  | { type: 'ERROR'; error: { code?: number; message: string } };

function reducer(state: State, action: Action): State {
  switch (state.status) {
    case 'idle': {
      switch (action.type) {
        case 'LOADING':
          return { ...state, status: 'loading' };
        default:
          return state;
      }
    }
    case 'loading': {
      switch (action.type) {
        case 'SUCCESS':
          return { ...state, status: 'success', ...action.data };
        case 'ERROR':
          return { ...state, status: 'error', error: action.error };
        default:
          return state;
      }
    }
    case 'success': {
      switch (action.type) {
        case 'LOADING':
          return {
            ...state,
            topics: [],
            program: undefined,
            status: 'loading',
          };
        default:
          return state;
      }
    }
    case 'error': {
      switch (action.type) {
        case 'LOADING':
          return { ...state, error: undefined, status: 'loading' };
        default:
          return state;
      }
    }
  }
}

const initialState: State = {
  status: 'idle',
  topics: [],
  program: undefined,
  error: undefined,
};

const ContentContext = createContext(initialState);

export const ContentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { programId } = useUserState();

  useEffect(() => {
    async function getContent() {
      dispatch({ type: 'LOADING' });

      try {
        const response = await fetch(`/api/content/${programId}`);
        const { data, error } = await response.json(); // TODO: add type

        // getContent only runs if the user got a programId so if our
        // API returns a 404 we can assume the users programId no longer exist
        // in the CMS and they need to pick a new one, hence the redirect
        if (response.status === 404) {
          router.push('/setup');
          return;
        }

        if (!response.ok) {
          dispatch({
            type: 'ERROR',
            error: {
              code: response.status,
              message: `${response.statusText}, ${error.message}`,
            },
          });
          return;
        }

        dispatch({ type: 'SUCCESS', data });
      } catch (error) {
        dispatch({ type: 'ERROR', error: { message: error.message } });
      }
    }

    if (!programId) {
      router.push('/setup');
      return;
    }

    getContent();
  }, [programId]);

  return (
    <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
  );
};

export const useContent = () => useContext(ContentContext);
