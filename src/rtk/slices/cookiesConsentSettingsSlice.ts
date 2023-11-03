import { createSlice } from '@reduxjs/toolkit';

export type CookiesConsentSettings = {
  analyticsCookiesAllowed: boolean;
};

const cookiesConsentSettingsSlice = createSlice({
  name: 'cookiesConsentSettings',
  initialState: { analyticsCookiesAllowed: false },
  reducers: {
    setCookiesConsentSettings(
      state,
      action: { type: string; payload: CookiesConsentSettings },
    ) {
      return action.payload;
    },
  },
});

const { actions, reducer } = cookiesConsentSettingsSlice;
export const { setCookiesConsentSettings } = actions;
export { reducer as cookiesConsentSettingsReducer };
