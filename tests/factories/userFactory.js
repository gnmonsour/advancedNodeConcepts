const mongoose = require('Mongoose');

const User = mongoose.model('User');

module.exports = {
  createUser: () => {
    return new User({}).save();
  },
  deleteUser: async (userId) => {
    return await User.findByIdAndRemove(userId);
  },
};
