import { TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';

export default function HButton({
  children,
  mode = 'contained',
  style,
  ...props
}) {
  return (
    <TouchableOpacity {...props}>
      <Text style={[styles.text, style]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: 800,
    color: 'white',
    textAlign: 'center',
    // borderRadius: 10,
    backgroundColor: '#BC222F',
    padding: 20,
    marginTop: 20,
    width: 170,
  }
});
