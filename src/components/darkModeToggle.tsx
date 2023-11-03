import {
  AppDispatch,
  RootState,
  fetchDarkModeSettings,
  setDarkModeSettings,
} from '@/rtk';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { HiMoon, HiSun } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

export function DarkModeToggle() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [icon, setIcon] = useState<JSX.Element>();
  const darkModeSettings = useSelector(
    (state: RootState) => state.darkModeSettings,
  );
  const isHydrate = useSelector((state: RootState) => state.isHydrate);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isHydrate && !darkModeSettings.initialized) {
      dispatch(fetchDarkModeSettings());
    }
  }, [dispatch, darkModeSettings, isHydrate]);

  useEffect(() => {
    if (darkModeSettings && darkModeSettings.theme) {
      setTheme(darkModeSettings.theme);
    }
  }, [setTheme, darkModeSettings]);

  useEffect(() => {
    const currentTheme = theme === 'system' ? systemTheme : theme;
    if (currentTheme === 'dark') {
      setIcon(<HiSun className="w-full h-full" />);
    } else {
      setIcon(<HiMoon className="w-full h-full" />);
    }
  }, [theme, systemTheme]);

  function toggleThemeHandler() {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    dispatch(setDarkModeSettings({ initialized: true, theme: newTheme }));
  }

  return (
    <button
      type="button"
      className="h-10 w-10 border border-tachGrey rounded p-2 hover:bg-tachPurple transition duration-300"
      onClick={toggleThemeHandler}
    >
      {icon}
    </button>
  );
}
