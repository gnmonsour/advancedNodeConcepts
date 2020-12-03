const mongoose = require('Mongoose');

const User = mongoose.model('User');

module.exports = () => {
  return new User({}).save();
};
