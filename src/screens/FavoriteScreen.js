/**
 * FavoritesScreen.js
 * 
 * Screen for displaying the list of favorite songs.
 */
import React, { useContext } from 'react';
import { View, FlatList, Text, TouchableOpacity, Button, StyleSheet } from 'react-native';
import { FavoritesContext } from '../context/FavoriteContext';

const FavoriteScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const renderSong = ({ item }) => (
    <View style={styles.songContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('Detail', { song: item })}>
        <Text style={styles.songText}>{item.trackName} - {item.artistName}</Text>
      </TouchableOpacity>
      <Button title="Remove" onPress={() => toggleFavorite(item)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={item => item.trackId.toString()}
        renderItem={renderSong}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  songContainer: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  songText: {
    fontSize: 18,
  },
});

export default FavoriteScreen;
