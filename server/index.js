const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});