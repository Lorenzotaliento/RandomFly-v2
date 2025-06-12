const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
});

module.exports = mongoose.model('User', userSchema);