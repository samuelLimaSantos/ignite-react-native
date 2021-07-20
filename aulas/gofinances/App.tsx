import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from 'styled-components';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import { Dashboard } from './src/screens/Dashboard'; 
import { Register } from './src/screens/Register';
import { CategorySelect } from './src/screens/CategorySelect';
import theme from './src/global/styles/theme';


export default function App() {

  const [ fontsLoaded ] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar translucent animated style="light"/>
      <CategorySelect />
    </ThemeProvider>
  );
}
