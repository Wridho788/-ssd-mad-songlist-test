import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync, sendPushNotification } from '../services/notification';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    loadFavorites();
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  }, []);

  useEffect(() => {
    saveFavorites();
  }, [favorites]);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites", error);
    }
  };

  const saveFavorites = async () => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites", error);
    }
  };

  const toggleFavorite = (song) => {
    setFavorites((prevFavorites) => {
      let newFavorites;
      if (prevFavorites.some(fav => fav.trackId === song.trackId)) {
        newFavorites = prevFavorites.filter(fav => fav.trackId !== song.trackId);
      } else {
        newFavorites = [...prevFavorites, song];
        sendPushNotification(expoPushToken, song);
      }
      return newFavorites;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
