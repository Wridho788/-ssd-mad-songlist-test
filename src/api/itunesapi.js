export const fetchSongs = async (query) => {
    try {
      const response = await fetch(`https://itunes.apple.com/search?term=${query}&limit=30&media=music`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
    }
  };
  