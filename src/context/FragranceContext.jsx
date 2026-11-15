import { createContext, useContext, useReducer, useEffect } from 'react';
import { SAMPLE_FRAGRANCES } from '../data/fragrances';

const STORAGE_KEYS = {
  fragrances: 'scentify_fragrances',
  history: 'scentify_history',
  settings: 'scentify_settings',
  favorites: 'scentify_favorites',
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

// Always use latest SAMPLE_FRAGRANCES for base items so schema changes (like
// adding the `gender` field) don't get masked by stale localStorage data.
// Custom fragrances (user-added, IDs not in SAMPLE_FRAGRANCES) are preserved.
function mergeFragrances(stored) {
  if (!stored) return SAMPLE_FRAGRANCES;
  const baseIds = new Set(SAMPLE_FRAGRANCES.map(f => f.id));
  const custom = stored.filter(f => !baseIds.has(f.id));
  return [...SAMPLE_FRAGRANCES, ...custom];
}

const initialState = {
  fragrances: mergeFragrances(loadFromStorage(STORAGE_KEYS.fragrances, null)),
  history: loadFromStorage(STORAGE_KEYS.history, []),
  settings: loadFromStorage(STORAGE_KEYS.settings, { onboarded: false }),
  favorites: loadFromStorage(STORAGE_KEYS.favorites, []),
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
        date: action.payload.date || new Date().toISOString().split('T')[0],
        fragranceId: action.payload.fragranceId,
        timestamp: Date.now(),
        occasion: action.payload.occasion || '',
        notes: action.payload.notes || '',
      };
      return { ...state, history: [...state.history, entry] };
    }
    case 'TOGGLE_FAVORITE': {
      const id = action.payload;
      const exists = state.favorites.includes(id);
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter(f => f !== id)
          : [...state.favorites, id],
      };
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
        favorites: [],
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

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.favorites, state.favorites);
  }, [state.favorites]);

  const value = {
    fragrances: state.fragrances,
    history: state.history,
    settings: state.settings,
    favorites: state.favorites,
    addFragrance: (data) => dispatch({ type: 'ADD_FRAGRANCE', payload: data }),
    updateFragrance: (data) => dispatch({ type: 'UPDATE_FRAGRANCE', payload: data }),
    deleteFragrance: (id) => dispatch({ type: 'DELETE_FRAGRANCE', payload: id }),
    logWear: (payload) => dispatch({ type: 'LOG_WEAR', payload: typeof payload === 'string' ? { fragranceId: payload } : payload }),
    toggleFavorite: (id) => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }),
    deleteWear: (timestamp) => dispatch({ type: 'DELETE_WEAR', payload: timestamp }),
    importData: (data) => dispatch({ type: 'IMPORT_DATA', payload: data }),
    resetData: () => dispatch({ type: 'RESET_DATA' }),
    updateSettings: (data) => dispatch({ type: 'UPDATE_SETTINGS', payload: data }),
    isFavorite: (id) => state.favorites.includes(id),
    exportData: () => JSON.stringify({
      fragrances: state.fragrances,
      history: state.history,
      settings: state.settings,
      favorites: state.favorites,
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
