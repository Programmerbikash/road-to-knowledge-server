const express = require('express')
// const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const app = express();

// Middle Wares
app.use(cors()); // For Get Method
app.use(express.json()); // For Post Method

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})