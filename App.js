import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

const URL = "https://opendata.bruxelles.be/api/records/1.0/search/?dataset=museums-in-brussels&q="

export default function App() {
  const [musees, setMusees] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  function renderMusee(item) {
    console.log(item)
    return (
      <Text>
        {item.item.fields.nom_du_musee}
      </Text>
    )
  }

  async function fetchData() {
    let response = await fetch(URL);
    let data = await response.json();
    setMusees(data.records)
    setTotalResults(data.nhits)
    setCurrentPage(1)
  }

  useEffect(() => {
    fetchData();
  }, [])

  let totalPages = Math.ceil(totalResults / 10);
  
  return (
    <View style={styles.container}>
      <View>
        <Text>Vous visionnez la page {currentPage} sur {totalPages} disponibles ({totalResults} musées)</Text>
      </View>
        <FlatList data={musees} renderItem={renderMusee} keyExtractor={item => item.recordid} />
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
