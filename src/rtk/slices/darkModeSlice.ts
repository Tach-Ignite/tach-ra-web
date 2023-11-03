import { DarkModeConfigurationViewModel } from '@/models';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type DarkModeSettings = {
  initialized: boolean;
  theme?: 'dark' | 'light' | 'system';
};

export const fetchDarkModeSettings = createAsyncThunk(
  'darkModeSettings/fetch',
  async () => {
    const response = await fetch('/api/config/darkMode');
    if (!response.ok || response.status === 204) {
      return { initialized: true };
    }
    const data: DarkModeConfigurationViewModel = await response.json();
    return { initialized: true, theme: data.default } as DarkModeSettings;
  },
);

const darkModeSettingsSlice = createSlice({
  name: 'darkModeSettings',
  initialState: { initialized: false } as DarkModeSettings,
  reducers: {
    setDarkModeSettings(
      state,
      action: { type: string; payload: DarkModeSettings },
    ) {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchDarkModeSettings.fulfilled,
      (state, action) => action.payload,
    );
  },
});

const { actions, reducer } = darkModeSettingsSlice;
export const { setDarkModeSettings } = actions;
export { reducer as darkModeSettingsSliceReducer };
