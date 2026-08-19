import Lyric from '../models/Lyric.js';
import { rankLyrics } from '../utils/searchHelper.js';

const DEFAULT_CATEGORIES = [
  'Nouhay',
  'Salaam',
  'Marsiya',
  'Manqabat',
  'Qasiday',
  'Munaajaat',
  'Ziyaraat',
  'Duas'
];

// @desc    Get all unique categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const dbCategories = await Lyric.distinct('category');
    // Combine with default categories to make sure they are always present, and return unique set
    const categoriesSet = new Set([...DEFAULT_CATEGORIES, ...dbCategories]);
    res.json(Array.from(categoriesSet));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// @desc    Get lyrics with filtering (category, person)
// @route   GET /api/lyrics
// @access  Public
export const getLyrics = async (req, res) => {
  try {
    const { category, person, ids } = req.query;
    const filter = {};

    if (ids) {
      // Filter by array of ID strings, ignoring empty values
      const idArray = ids.split(',').filter(id => id.trim() !== '');
      if (idArray.length > 0) {
        filter._id = { $in: idArray };
      }
    }
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    if (category) {
      filter.category = { $regex: new RegExp(`^${escapeRegExp(category)}$`, 'i') };
    }
    if (person) {
      filter.person = { $regex: new RegExp(`^${escapeRegExp(person)}$`, 'i') };
    }

    const lyrics = await Lyric.find(filter).sort({ orderNumber: 1, createdAt: 1 });
    res.json(lyrics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lyrics', error: error.message });
  }
};

// @desc    Get single lyric
// @route   GET /api/lyrics/:id
// @access  Public
export const getLyricById = async (req, res) => {
  try {
    const lyric = await Lyric.findById(req.params.id);
    if (!lyric) {
      return res.status(404).json({ message: 'Lyric not found' });
    }
    res.json(lyric);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lyric', error: error.message });
  }
};

// @desc    Search lyrics with fuzzy logic
// @route   GET /api/lyrics/search
// @access  Public
export const searchLyrics = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Fetch all documents. Since the collection is expected to be in hundreds/thousands,
    // in-memory fuzzy search ranking in Node is fast and efficient.
    const allLyrics = await Lyric.find({});
    
    const results = rankLyrics(allLyrics, q);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error searching lyrics', error: error.message });
  }
};

// @desc    Create a lyric
// @route   POST /api/lyrics
// @access  Public (No Auth per requirements)
export const createLyric = async (req, res) => {
  try {
    const { title, category, person, reciter, lyricsEnglish, lyricsUrdu, orderNumber } = req.body;

    if (!title || !category || !person || !lyricsEnglish || !lyricsUrdu) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newLyric = new Lyric({
      title,
      category,
      person,
      reciter,
      lyricsEnglish,
      lyricsUrdu,
      orderNumber: orderNumber || 0
    });

    const savedLyric = await newLyric.save();
    res.status(201).json(savedLyric);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lyric', error: error.message });
  }
};

// @desc    Update a lyric
// @route   PUT /api/lyrics/:id
// @access  Public (No Auth per requirements)
export const updateLyric = async (req, res) => {
  try {
    const lyric = await Lyric.findById(req.params.id);
    if (!lyric) {
      return res.status(404).json({ message: 'Lyric not found' });
    }

    const updatedLyric = await Lyric.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedLyric);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lyric', error: error.message });
  }
};

// @desc    Delete a lyric
// @route   DELETE /api/lyrics/:id
// @access  Public (No Auth per requirements)
export const deleteLyric = async (req, res) => {
  try {
    const lyric = await Lyric.findById(req.params.id);
    if (!lyric) {
      return res.status(404).json({ message: 'Lyric not found' });
    }

    await Lyric.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lyric removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lyric', error: error.message });
  }
};
