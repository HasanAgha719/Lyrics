import mongoose from 'mongoose';

const lyricSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    person: {
      type: String,
      required: [true, 'Person/personality dedicated to is required'],
      trim: true
    },
    reciter: {
      type: String,
      default: '',
      trim: true
    },
    lyricsEnglish: {
      type: String,
      required: [true, 'English/Roman Urdu lyrics are required']
    },
    lyricsUrdu: {
      type: String,
      required: [true, 'Urdu lyrics are required']
    },
    orderNumber: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes for regular category/person filtering
lyricSchema.index({ category: 1, person: 1 });
lyricSchema.index({ category: 1 });
lyricSchema.index({ person: 1 });

// Full-text index on all fields, with different weights
lyricSchema.index(
  {
    title: 'text',
    person: 'text',
    reciter: 'text',
    lyricsEnglish: 'text',
    lyricsUrdu: 'text'
  },
  {
    weights: {
      title: 10,
      person: 5,
      reciter: 3,
      lyricsEnglish: 1,
      lyricsUrdu: 1
    },
    name: 'lyrics_text_index'
  }
);

const Lyric = mongoose.model('Lyric', lyricSchema);

export default Lyric;
