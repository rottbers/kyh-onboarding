import { createContext, useContext, useEffect, useReducer } from 'react';

type State =
  | {
      status: 'not-setup';
      readTopics: string[];
      programId: null;
      completedOnboarding: false;
    }
  | {
      status: 'setup';
      readTopics: string[];
      programId: string;
      completedOnboarding: boolean;
    };

type Action =
  | { type: 'READ_TOPIC'; data: { topicId: string } }
  | { type: 'SETUP'; data: { programId: string } }
  | { type: 'COMPLETED_ONBOARDING' };

function reducer(state: State, action: Action): State {
  switch (state.status) {
    case 'not-setup':
      switch (action.type) {
        case 'SETUP': {
          const { programId } = action.data;
          return { ...state, status: 'setup', programId };
        }
        default:
          return state;
      }
    case 'setup': {
      switch (action.type) {
        case 'READ_TOPIC': {
          const { topicId } = action.data;
          if (state.readTopics.includes(topicId)) {
            return state;
          }
          const readTopics = [...state.readTopics, topicId];
          return { ...state, readTopics };
        }
        case 'SETUP': {
          const { programId } = action.data;
          return {
            ...state,
            status: 'setup',
            programId,
            completedOnboarding: false,
          };
        }
        case 'COMPLETED_ONBOARDING': {
          if (state.completedOnboarding) {
            return state;
          }
          return { ...state, completedOnboarding: true };
        }
        default:
          return state;
      }
    }
  }
}

function validateState(key: keyof State | '', value: any) {
  switch (key) {
    case 'status': {
      if (['setup', 'non-setup'].includes(value)) {
        return value;
      }
      throw new Error(`Invalid value for '${key}'.'`);
    }
    case 'programId': {
      if (typeof value === 'string' || value === null) {
        return value;
      }
      throw new Error(`Invalid value for '${key}'. Expected string or null.`);
    }
    case 'readTopics': {
      if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
        return value;
      }
      throw new Error(`Invalid value for '${key}'. Expected array of strings.`);
    }
    case 'completedOnboarding': {
      if (typeof value === 'boolean') {
        return value;
      }
      throw new Error(`Invalid value for '${key}'. Expected boolean.`);
    }
    // Reviver callback always seems to include an empty string key..
    case '': {
      return value;
    }
    default:
      throw new Error(`Unknow key '${key}'`);
  }
}

const defaultState: State = {
  status: 'not-setup',
  readTopics: [],
  programId: null,
  completedOnboarding: false,
};

const STATE_KEY = 'state';

const initialState = ((): State => {
  try {
    // Get local state on load and parse
    const state = localStorage.getItem(STATE_KEY);
    if (!state) {
      return defaultState;
    }
    return JSON.parse(state, validateState);
  } catch {
    // If error parsing, revert to default state
    return defaultState;
  }
})();

const UserStateContext = createContext<State>(initialState);
const UserDispatchContext = createContext<React.Dispatch<Action>>(() => null);

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Update local storage on every state change
  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

export const useUserState = () => useContext(UserStateContext);
export const useUserDispatch = () => useContext(UserDispatchContext);
