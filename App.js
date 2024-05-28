import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './src/screens/SearchScreen';
import DetailScreen from './src/screens/DetailScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import { FavoritesProvider } from './src/context/FavoriteContext';
import { registerForPushNotificationsAsync } from './src/services/notification';

const Stack = createStackNavigator();

const App = () => {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    const getPushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    };

    getPushToken();
  }, []);

  const handleFavorite = async (song) => {
    if (expoPushToken) {
      await sendPushNotification(expoPushToken, song);
    } else {
      console.error('Expo push token is not available.');
    }
  };

  return (
    <FavoritesProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Search">
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
          <Stack.Screen name="Favorites" component={FavoriteScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
};

export default App;
