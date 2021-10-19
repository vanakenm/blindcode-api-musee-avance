import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const URL =
  "https://opendata.bruxelles.be/api/records/1.0/search/?dataset=museums-in-brussels&q=";
const Stack = createNativeStackNavigator();

export default function App() {
  const [musees, setMusees] = useState([]);
  const [totalResults, setTotalResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  function MuseeList(props) {
    let totalPages = props.totalPages;
    let navigation = props.navigation
    return (
      <View style={styles.container}>
        <View>
          <Text>
            Vous visionnez la page {currentPage} sur {totalPages} disponibles (
            {totalResults} musées)
          </Text>
        </View>
        <FlatList
          data={musees}
          renderItem={(item) => <View><Text>{item.item.fields.nom_du_musee} </Text>
                  <Button
        title="Go to Details for musee"
        onPress={() => navigation.navigate('Details', { id: item.item.recordid})}
      /></View>}
          keyExtractor={(item) => item.recordid}
        />
        <Button
          disabled={currentPage === 1}
          title="Précédent"
          onPress={() => setCurrentPage(currentPage - 1)}
        />
        <Button
          disabled={currentPage === totalPages}
          title="Suivant"
          onPress={() => setCurrentPage(currentPage + 1)}
        />
        <StatusBar style="auto" />
      </View>
    );
  }

  function MuseeDetails(props) {
    let id = props.route.params.id;
    let musee = musees.find((musee) => musee.recordid === id);
    return (
      <View>
        <Text>{musee.fields.nom_du_musee}</Text>
        <Text>{musee.fields.e_mail}</Text>
        <Text>{musee.fields.adres}</Text>
      </View>
    );
  }

  function buildPaginatedUrl(page) {
    return URL + "&start=" + (page - 1) * 10;
  }

  async function fetchData() {
    let response = await fetch(buildPaginatedUrl(currentPage));
    let data = await response.json();
    setMusees(data.records);
    setTotalResults(data.nhits);
  }

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  let totalPages = Math.ceil(totalResults / 10);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={(props) => (
            <MuseeList
              {...props}
              totalPages={totalPages}
            />
          )}
        />
        <Stack.Screen
          name="Details"
          component={(props) => <MuseeDetails {...props}  />}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
