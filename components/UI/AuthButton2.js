import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

const AuthBtn = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: Colors.primary,
    alignSelf: 'center',
    fontSize: 14
  }
});

export default AuthBtn;
