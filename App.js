import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Button } from 'react-native';

const URL = "https://opendata.bruxelles.be/api/records/1.0/search/?dataset=museums-in-brussels&q="

export default function App() {
  const [musees, setMusees] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  function buildPaginatedUrl(page) {
    return URL + "&start=" + ((page-1) * 10)
  }

  function renderMusee(item) {
    console.log(item)
    return (
      <Text>
        {item.item.fields.nom_du_musee}
      </Text>
    )
  }

  async function fetchData() {
    let response = await fetch(buildPaginatedUrl(currentPage));
    let data = await response.json();
    setMusees(data.records)
    setTotalResults(data.nhits)
  }

  useEffect(() => {
    fetchData();
  }, [currentPage])

  let totalPages = Math.ceil(totalResults / 10);
  
  return (
    <View style={styles.container}>
      <View>
        <Text>Vous visionnez la page {currentPage} sur {totalPages} disponibles ({totalResults} musées)</Text>
      </View>
        <FlatList data={musees} renderItem={renderMusee} keyExtractor={item => item.recordid} />
        <Button disabled={currentPage === 1} title="Précédent" onPress={() => setCurrentPage(currentPage - 1)} />
        <Button disabled={currentPage === totalPages} title="Suivant" onPress={() => setCurrentPage(currentPage + 1)} />
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
