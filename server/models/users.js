const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number },
  website: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  status: {
    type: String,
    enum: ['active', 'inactive', 'new'],
    default: 'active',
  },
  description: { type: String },
  my_publishing: [{ type: Schema.Types.ObjectId, ref: 'book' }],
  my_channels: [{ type: Schema.Types.ObjectId, ref: 'channel' }],
  my_favourite: [{ type: Schema.Types.ObjectId, ref: 'book' }],
}, { timestamps: true });

userSchema.index({ name: 'text' });

module.exports = mongoose.model('user', userSchema);
