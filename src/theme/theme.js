import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export function Styles(newMode) {
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: newMode === 'dark' ? '#000000' : '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
    });

  console.log(newMode);
  setMode(newMode);
  return styles
}

export default function Test() {
  const scheme = useColorScheme();
  const [mode, setMode] = useState(scheme);

  return (
    <>
      <Button onPress={() => switchMode('light')}>Light</Button>
      <Button onPress={() => switchMode('dark')}>Dark</Button>
      <Button onPress={() => switchMode(scheme)}>Automatic</Button>
    </>
  );
}
