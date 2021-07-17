import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  Text, 
  StyleSheet, 
  TextInput, 
  Platform,
  FlatList,
} from 'react-native';
import { Button } from '../components/Button'
import { SkillCard } from '../components/SkillCard';

type SKill = {
  id: string;
  name: string;
}

export const Home = () => {

  const [ newSkill, setNewSkill ] = useState("");
  const [ mySkills, setMySkills ] = useState<SKill[] | []>([]);
  const [ greeting, setGreeting ] = useState("");

  function handleAddNewSkill() {
    const data = {
      id: new Date().getTime().toString(),
      name: newSkill
    }

    setMySkills(oldState => [...oldState, data]);
  }

  function handleDeleteSkill(id: string) {
    const skills = mySkills.filter(skill => skill.id !== id);

    setMySkills(skills);
  }

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour <= 12) return setGreeting('Good morning');
    if (currentHour <= 18) return setGreeting('Good afternoon');
    
    return setGreeting('Good night');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Welcome, Samuel
      </Text>

      <Text style={styles.greetings}>
        { greeting }
      </Text>

      <TextInput 
        style={styles.input}
        placeholder="New skill"
        placeholderTextColor="#555"
        onChangeText={setNewSkill}
      />

      <Button 
        title="Add"
        onPress={handleAddNewSkill}
      />

      <Text style={[styles.title, { marginVertical: 50 }]}>
        My Skills
      </Text>

      <FlatList 
        data={mySkills}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <SkillCard 
            skill={item.name} 
            onPress={() => handleDeleteSkill(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
       
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121015',
    paddingHorizontal: 30,
    paddingVertical: 70
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  input: {
    backgroundColor: '#1F1e25',
    color: '#fff',
    fontSize: 18,
    padding: Platform.OS === 'ios' ? 15 : 10,
    marginTop: 30,
    borderRadius: 7
  },
  greetings: {
    color: "#fff"
  }
});
