const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  imagePath: String,
});

mongoose.model('Blog', blogSchema);
