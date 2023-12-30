import { Reducer, combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { emptyAppApi } from './apis/emptyAppApi';
import {
  userAddressReducer,
  favoritesReducer,
  cookiesConsentSettingsReducer,
  darkModeSettingsSliceReducer,
  hydrateReducer,
} from './slices';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: [emptyAppApi.reducerPath],
};

const hydrateReducerWithMiddleware: Reducer<boolean> = (state, action) => {
  if (action.type === REHYDRATE) {
    return true;
  }

  return hydrateReducer(state, action);
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    [emptyAppApi.reducerPath]: emptyAppApi.reducer,
    cookiesConsentSettings: cookiesConsentSettingsReducer,
    favorites: favoritesReducer,
    userAddress: userAddressReducer,
    darkModeSettings: darkModeSettingsSliceReducer,
    isHydrate: hydrateReducerWithMiddleware,
  }),
);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (gDM) =>
      gDM({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(emptyAppApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
