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
    review: {
      type: String,
      required: [true, 'Please provide a review'],
      maxlength: 500,
    },
    rate: {
      type: String,
      enum: ['amazing', 'good', 'mediocre', 'bad'],
      default: 'amazing',
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
