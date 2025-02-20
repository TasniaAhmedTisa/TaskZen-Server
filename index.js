const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Default route
app.get("/", (req, res) => {
    res.send(" Task Management Server is Running!");
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server is running on http://localhost:${PORT}`);
  });