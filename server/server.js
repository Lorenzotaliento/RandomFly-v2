require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(`${process.env.MONGODB_URL}${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connesso a MongoDB'))
  .catch((err) => console.error('Errore di connessione:', err));

app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server in esecuzione sulla porta ${PORT}`));