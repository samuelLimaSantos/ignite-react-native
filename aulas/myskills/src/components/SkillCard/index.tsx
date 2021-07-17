import React from 'react';
import { Text, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type Props = TouchableOpacityProps & {
  skill: string;
};

export function SkillCard({ skill, ...rest }: Props) {
  return (
    <TouchableOpacity style={styles.buttonSkill} {...rest} >
      <Text style={styles.textSkill} >
        {skill}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonSkill: {
    backgroundColor: '#1f1e25',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10
  },
  textSkill: {
    color: '#fff',
    backgroundColor: '#1f1e25',
    fontSize: 22,
    fontWeight: 'bold',
  }
});
