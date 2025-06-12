const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  type: { type: String, enum: ['Natura', 'Avventura', 'Relax'], required: true },
  image: { type: String }, // URL dell'immagine opzionale
});

module.exports = mongoose.model('Trip', tripSchema);