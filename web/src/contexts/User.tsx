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
  | { type: 'COMPLETED_ONBOARDING' }
  | { type: 'SYNC_STATE'; data: { state: State } };

function reducer(state: State, action: Action): State {
  switch (state.status) {
    case 'not-setup':
      switch (action.type) {
        case 'SETUP': {
          const { programId } = action.data;
          return { ...state, status: 'setup', programId };
        }
        case 'SYNC_STATE': {
          return action.data.state;
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
          return { ...state, status: 'setup', programId };
        }
        case 'COMPLETED_ONBOARDING': {
          if (state.completedOnboarding) {
            return state;
          }
          return { ...state, completedOnboarding: true };
        }
        case 'SYNC_STATE': {
          return action.data.state;
        }
        default:
          return state;
      }
    }
  }
}

function validateState(key: any, value: any) {
  const statuses: State['status'][] = ['setup', 'not-setup'];

  switch (key as keyof State) {
    case 'status': {
      if (statuses.includes(value)) {
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
    // Reviver callback runs for every array item and uses the index as key hence
    // returning the value here for unknown keys instead of throwing an error
    default:
      return value;
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

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stateString = JSON.stringify(state);
    // Update local storage on every state change
    if (stateString !== localStorage.getItem(STATE_KEY)) {
      localStorage.setItem(STATE_KEY, stateString);
    }
  }, [state]);

  useEffect(() => {
    function handleStateChangeInOtherTab(e: StorageEvent) {
      try {
        // On update
        if (e.key === STATE_KEY && e.oldValue && e.newValue) {
          const newState: State = JSON.parse(e.newValue, validateState);
          dispatch({ type: 'SYNC_STATE', data: { state: newState } });
        }
        // On delete
        if (e.key === STATE_KEY && e.oldValue && !e.newValue) {
          dispatch({ type: 'SYNC_STATE', data: { state: defaultState } });
        }
      } catch (error) {
        console.error(error);
      }
    }

    window.addEventListener('storage', handleStateChangeInOtherTab);

    return () => {
      window.removeEventListener('storage', handleStateChangeInOtherTab);
    };
  }, [dispatch]);

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
