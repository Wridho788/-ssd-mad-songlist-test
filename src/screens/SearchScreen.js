/**
 * SearchScreen.js
 * 
 * Screen for searching songs. Allows users to search by song name or artist name.
 */
import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { FavoritesContext } from '../context/FavoriteContext';

const SearchScreen = ({ navigation }) => {
  const { favorites, toggleFavorite } = useContext(FavoritesContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const searchSongs = async () => {
    const response = await fetch(`https://itunes.apple.com/search?term=${searchTerm}&limit=30&media=music`);
    const data = await response.json();
    setResults(data.results);
  };

  const renderSongItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detail', { song: item })}
      style={styles.songItem}
    >
      <Image source={{ uri: item.artworkUrl100 }} style={styles.albumArt} />
      <View style={styles.songDetails}>
        <Text style={styles.songTitle}>{item.trackName}</Text>
        <Text style={styles.artistName}>{item.artistName}</Text>
        <Button
          title={favorites.some(fav => fav.trackId === item.trackId) ? 'Unfavorite' : 'Favorite'}
          onPress={() => toggleFavorite(item)}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search for a song or artist"
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.searchInput}
      />
      <Button title="Search" onPress={searchSongs} />
      <FlatList
        data={results}
        keyExtractor={(item) => item.trackId.toString()}
        renderItem={renderSongItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  songItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  songDetails: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default SearchScreen;
