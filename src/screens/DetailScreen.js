import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, Button, ScrollView } from 'react-native';
import { FavoritesContext } from '../context/FavoriteContext';

const DetailScreen = ({ route }) => {
  const { song } = route.params;
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const isFavorite = favorites.some(fav => fav.trackId === song.trackId);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: song.artworkUrl100 }} style={styles.albumArt} />
      <Text style={styles.songTitle}>{song.trackName}</Text>
      <Text style={styles.artistName}>{song.artistName}</Text>
      <Text style={styles.collectionName}>{song.collectionName}</Text>
      <View style={styles.details}>
        <Text style={styles.detailItem}>Release Date: {new Date(song.releaseDate).toDateString()}</Text>
        <Text style={styles.detailItem}>Genre: {song.primaryGenreName}</Text>
        <Text style={styles.detailItem}>Track Price: ${song.trackPrice}</Text>
      </View>
      <Button
        title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        onPress={() => toggleFavorite(song)}
        color={isFavorite ? '#FF6347' : '#4682B4'}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  albumArt: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  songTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  artistName: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  collectionName: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  details: {
    width: '100%',
    marginBottom: 20,
  },
  detailItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
});

export default DetailScreen;
