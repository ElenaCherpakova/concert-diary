const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConcertSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      maxlength: 100,
    },
    artist: {
      type: String,
      required: [true, 'Please provide an artist'],
      maxlength: 100,
    },
    body: {
      type: String,
      required: [true, 'Please provide a body'],
      maxlength: 1000,
    },
    rate: {
      type: String,
      enum: ['amazing', 'very good', 'good', 'mediocre', 'bad'],
      default: 'good',
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide a user'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Concert', ConcertSchema);
