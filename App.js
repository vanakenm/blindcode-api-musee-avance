import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const URL = "https://opendata.bruxelles.be/api/records/1.0/search/?dataset=museums-in-brussels&q="

export default function App() {
  const [musees, setMusees] = useState([]);
  async function fetchData() {
    let response = await fetch(URL);
    let data = await response.json();
    setMusees(data.records)
  }

  useEffect(() => {
    fetchData();
  }, [])
  
  return (
    <View style={styles.container}>
      { musees.map(musee => (
        <Text key={musee.recordid}>{musee.fields.nom_du_musee}</Text>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
