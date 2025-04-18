import React, { useEffect, useState } from 'react';
import { SplashScreen, Slot } from 'expo-router';
import './global.css';
import { useFonts } from 'expo-font';
import { useThemeStore } from '@/interface/theme/useThemeStore';
import { useColorScheme } from 'nativewind';
import { View } from 'react-native';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    'WorkSans-Bold': require('../assets/fonts/WorkSans-Bold.ttf'),
    'WorkSans-Regular': require('../assets/fonts/WorkSans-Regular.ttf'),
    'WorkSans-Medium': require('../assets/fonts/WorkSans-Medium.ttf'),
    'WorkSans-Light': require('../assets/fonts/WorkSans-Light.ttf'),
  });

  const [themeReady, setThemeReady] = useState(false);
  const { theme, loadTheme } = useThemeStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    if (fontError) throw fontError;
    if (fontsLoaded && themeReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, themeReady]);

  useEffect(() => {
    loadTheme().finally(() => setThemeReady(true));
  }, []);

  useEffect(() => {
    setColorScheme(theme);
  }, [theme]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {fontsLoaded && themeReady ? <Slot /> : null}
    </View>
  );
};

export default RootLayout;
