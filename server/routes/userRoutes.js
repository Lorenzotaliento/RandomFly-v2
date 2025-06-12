const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Registrazione
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Dati ricevuti:', { email, password }); // Debug
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e password sono richiesti' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    /*
    const msg = {
      to: email,
      from: 'ltaliento3@gmail.com', // Sostituisci con email verificato
      subject: 'Benvenuto su ViaggiRandom!',
      text: 'Grazie per esserti registrato!',
    };
    await sgMail.send(msg);

    */

    res.status(201).json({ message: 'Utente registrato con successo' });
  } catch (err) {
    console.error('Errore registrazione backend:', err); // Debug
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenziali non valide' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenziali non valide' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profilo utente (viaggi salvati)
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('savedTrips');
    res.json({ savedTrips: user.savedTrips });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;