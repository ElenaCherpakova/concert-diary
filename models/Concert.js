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
    // I think that 500 characters is a bit conservative for a review, I'd
    // probably prefer this to be a text field, basically going as long as the
    // user wants.
    //
    // That being said, I can see how imposing a limit allowed you to avoid
    // some complexity with truncating the string in your card on the concert
    // list page, and I respect that you made a decision that kept things
    // simple, allowing you to ultimately deliver something polished, simple,
    // and functional.
    //
    // That being said, I think that opening up this limit, and then truncating
    // the text on the list page cards would be a nice feature to add.
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
