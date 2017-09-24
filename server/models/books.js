const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  name: { type: String, required: true },
  author: { type: String, required: true },
  content: { type: String, required: true },
  rating: { type: Number, enum: [0, 1, 2, 3, 4, 5], defalut: 0 },
  book_image: { type: String },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

bookSchema.index({ name: 'text' });

module.exports = mongoose.model('book', bookSchema);
