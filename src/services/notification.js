/**
 * notification.js
 * 
 * Handles the push notification registration and sending.
 */

/**
 * Registers the device for push notifications and returns the Expo push token.
 * 
 * @returns {string} The Expo push token.
 */
export const registerForPushNotificationsAsync = async () => {
  let token;

  // Set notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // Request permissions for notifications
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Ask for permission if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Stop if permission is not granted
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  try {
    // Get the push token
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.manifest.extra.eas.projectId,
    })).data;

    console.log('Expo Push Token:', token);
  } catch (error) {
    console.error('Failed to get expo push token:', error);
  }

  return token;
};

/**
 * Sends a push notification to the specified Expo push token.
 * 
 * @param {string} expoPushToken - The Expo push token.
 * @param {object} song - The song information.
 */
export const sendPushNotification = async (expoPushToken, song) => {
  if (!expoPushToken) {
    console.error('Expo push token is empty.');
    return;
  }

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: song.trackName,
    body: `Successfully added '${song.trackName}' to favourite`,
    data: { song },
    android: {
      channelId: 'default',
    },
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const responseData = await response.json();

    if (response.ok) {
      await scheduleLocalNotification(song);
    } else {
      console.error('Failed to send push notification:', responseData);
    }
  } catch (error) {
    console.error('Failed to send push notification:', error);
  }
};

/**
 * Schedules a local notification to be displayed immediately.
 * 
 * @param {object} song - The song information.
 */
const scheduleLocalNotification = async (song) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: song.trackName,
      body: `Successfully added '${song.trackName}' to favourite`,
      data: { song },
    },
    trigger: null, // Tampilkan segera
  });
};