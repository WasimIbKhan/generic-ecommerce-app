import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import Colors from '../../constants/Colors';

const AuthBtn = props => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{...styles.button, ...props.style}}>
        <Text style={{...styles.buttonText, ...props.style}}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderColor: Colors.darkMode,
    borderWidth: 1,
    paddingVertical: Dimensions.get('window').height * 0.015,
    paddingHorizontal: '3%',
    marginHorizontal: Dimensions.get('window').width * 0.15,
    borderRadius: Dimensions.get('window').width * 0.1
  },
  buttonText: {
    fontWeight: '800',
    alignSelf: 'center',
    fontSize: 18
  }
});

export default AuthBtn;
