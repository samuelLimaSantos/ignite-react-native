import React from 'react';
import { 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TouchableOpacityProps 
} from 'react-native';

type Props = TouchableOpacityProps & {
  title: string;
}

export function Button({ title, ...rest}: Props) {
  return(
    <TouchableOpacity 
        style={styles.button}
        {...rest}
      >
      <Text 
        style={styles.buttonText}
      >
        { title }
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#A370F7',
    padding: 15,
    borderRadius: 7,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17
  },
});
