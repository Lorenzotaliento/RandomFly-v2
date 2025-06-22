const express = require('express');
const Trip = require('../models/Trip');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Cerca viaggi con filtri
router.get('/search', async (req, res) => {
  try {
    const { budget, type } = req.query;
    const query = {};
    if (budget) query.budget = { $lte: parseFloat(budget) };
    if (type) query.type = type;
    const trips = await Trip.find(query);
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Salva un viaggio
router.post('/save/:tripId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const tripId = req.params.tripId;
    if (!user.savedTrips.includes(tripId)) {
      user.savedTrips.push(tripId);
      await user.save();
    }
    res.json({ message: 'Viaggio salvato' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rimuovi un viaggio salvato
router.delete('/savedTrips/:tripId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const tripId = req.params.tripId;
    user.savedTrips = user.savedTrips.filter(id => id.toString() !== tripId);
    await user.save();
    res.json({ message: 'Viaggio rimosso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;