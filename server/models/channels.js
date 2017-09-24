const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const channelSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['private', 'public'] },
  description: { type: String },
  tags: [{ type: String }],
  genre: [{ type: String, required: true }],
  channel_image: { type: String },
  book_list: [{ type: Schema.Types.ObjectId, ref: 'book' }],
  creator: { type: Schema.Types.ObjectId, ref: 'user' },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

channelSchema.index({ name: 'text' });

module.exports = mongoose.model('channel', channelSchema);
