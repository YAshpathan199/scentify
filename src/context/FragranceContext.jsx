import { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';

const STORAGE_KEYS = {
  fragrances: 'scentify_fragrances',
  history: 'scentify_history',
  settings: 'scentify_settings',
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* quota exceeded */ }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const initialState = {
  fragrances: loadFromStorage(STORAGE_KEYS.fragrances, null) || SAMPLE_FRAGRANCES,
  history: loadFromStorage(STORAGE_KEYS.history, []),
  settings: loadFromStorage(STORAGE_KEYS.settings, { onboarded: false }),
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_FRAGRANCE': {
      const newFragrance = {
        ...action.payload,
        id: generateId(),
        dateAdded: new Date().toISOString().split('T')[0],
      };
      return { ...state, fragrances: [...state.fragrances, newFragrance] };
    }
    case 'UPDATE_FRAGRANCE': {
      const updated = state.fragrances.map(f =>
        f.id === action.payload.id ? { ...f, ...action.payload } : f
      );
      return { ...state, fragrances: updated };
    }
    case 'DELETE_FRAGRANCE': {
      return {
        ...state,
        fragrances: state.fragrances.filter(f => f.id !== action.payload),
      };
    }
    case 'LOG_WEAR': {
      const entry = {
        date: new Date().toISOString().split('T')[0],
        fragranceId: action.payload.fragranceId,
        timestamp: Date.now(),
        occasion: action.payload.occasion || '',
      };
      return { ...state, history: [...state.history, entry] };
    }
    case 'DELETE_WEAR': {
      return {
        ...state,
        history: state.history.filter(h => h.timestamp !== action.payload),
      };
    }
    case 'IMPORT_DATA': {
      return {
        fragrances: action.payload.fragrances || state.fragrances,
        history: action.payload.history || state.history,
        settings: action.payload.settings || state.settings,
      };
    }
    case 'RESET_DATA': {
      return {
        fragrances: SAMPLE_FRAGRANCES,
        history: [],
        settings: { onboarded: false },
      };
    }
    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.payload } };
    }
    default:
      return state;
  }
}

const FragranceContext = createContext(null);

export function FragranceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.fragrances, state.fragrances);
  }, [state.fragrances]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.history, state.history);
  }, [state.history]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, state.settings);
  }, [state.settings]);

  const value = {
    fragrances: state.fragrances,
    history: state.history,
    settings: state.settings,
    addFragrance: (data) => dispatch({ type: 'ADD_FRAGRANCE', payload: data }),
    updateFragrance: (data) => dispatch({ type: 'UPDATE_FRAGRANCE', payload: data }),
    deleteFragrance: (id) => dispatch({ type: 'DELETE_FRAGRANCE', payload: id }),
    logWear: (fragranceId, occasion) => dispatch({ type: 'LOG_WEAR', payload: { fragranceId, occasion } }),
    deleteWear: (timestamp) => dispatch({ type: 'DELETE_WEAR', payload: timestamp }),
    importData: (data) => dispatch({ type: 'IMPORT_DATA', payload: data }),
    resetData: () => dispatch({ type: 'RESET_DATA' }),
    updateSettings: (data) => dispatch({ type: 'UPDATE_SETTINGS', payload: data }),
    exportData: () => JSON.stringify({
      fragrances: state.fragrances,
      history: state.history,
      settings: state.settings,
      exportedAt: new Date().toISOString(),
    }, null, 2),
  };

  return (
    <FragranceContext.Provider value={value}>
      {children}
    </FragranceContext.Provider>
  );
}

export function useFragrances() {
  const ctx = useContext(FragranceContext);
  if (!ctx) throw new Error('useFragrances must be used within FragranceProvider');
  return ctx;
}
