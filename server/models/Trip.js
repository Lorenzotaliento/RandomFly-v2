const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  type: { type: String, enum: ['Natura', 'Avventura', 'Relax'], required: true },
  image: { type: String }, 
  location: { type: String, required: true },
  temperature: {
    max: { type: Number, required: true },
    min: { type: Number, required: true }
  },
  costOfLiving: { type: Number, required: true },
  duration: { type: Number, required: true }, // in giorni
  season: { type: String, enum: ['Primavera', 'Estate', 'Autunno', 'Inverno'], required: true },
  recommendedActivities: [{ type: String }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  isSurprise: { type: Boolean, default: true }
});

module.exports = mongoose.model('Trip', tripSchema);