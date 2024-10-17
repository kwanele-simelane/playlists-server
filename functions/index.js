const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");
const playlistRoutes = require("./routes/playlist");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/", authRoutes);
app.use("/playlists", playlistRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
