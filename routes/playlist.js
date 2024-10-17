const express = require("express");
const axios = require("axios");
const router = express.Router();

// create a new playlist and add tracks
router.post("/create", async (req, res) => {
  const { accessToken, songsMeta, userId } = req.body;

  try {
    const { data } = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: "2 Hour Plays",
        description: "My songs in queue for the next 2 hours",
        public: false,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // search and add song to the playlist
    const trackURIs = [];
    const playlist = data;
    const playlistId = data.id;

    for (let song of songsMeta) {
      const { title, artist } = song;

      const query = `track:${title} artist:${artist}`;
      const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
        params: {
          q: query,
          type: "track",
          limit: 1,
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const tracks = data.tracks.items;

      if (tracks.length > 0) {
        trackURIs.push(tracks[0].uri);
      }
    }

    if (trackURIs.length > 0) {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        { uris: trackURIs },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }

    res.json({ playlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to create playlist. Try again..." });
  }
});

// Delete playlist after 2 hours
router.delete("/delete/:playlistId", async (req, res) => {
  const { accessToken } = req.body;
  const { playlistId } = req.params;

  try {
    await axios.delete(
      `https://api.spotify.com/v1/playlists/${playlistId}/followers`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    res.json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete playlist" });
  }
});

module.exports = router;
