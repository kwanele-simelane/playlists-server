const express = require("express");
const axios = require("axios");
const queryString = require("querystring");
const router = express.Router();

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
  process.env;

router.get("/login", (req, res) => {
  const scopes =
    "user-read-playback-state user-modify-playback-state playlist-modify-public playlist-modify-private";
  const authURL =
    "https://accounts.spotify.com/authorize?" +
    queryString.stringify({
      response_type: "code",
      client_id: SPOTIFY_CLIENT_ID,
      scope: scopes,
      redirect_uri: SPOTIFY_REDIRECT_URI,
    });
  res.redirect(authURL);
});

router.get("/callback", async (req, res) => {
  const { code } = req.query;
  const body = queryString.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    const { access_token, refresh_token } = response.data;

    return res.redirect(
      `http://localhost:3000/playlist?access_token=${access_token}`
    );
  } catch (error) {
    return res.status(400).json({
      error: "Failed to authenticate with Spotify",
    });
  }
});

module.exports = router;
