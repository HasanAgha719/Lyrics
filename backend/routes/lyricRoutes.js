import express from 'express';
import {
  getCategories,
  getLyrics,
  getLyricById,
  searchLyrics,
  createLyric,
  updateLyric,
  deleteLyric
} from '../controllers/lyricController.js';

const router = express.Router();

// Category routes
router.get('/categories', getCategories);

// Search route (must be defined BEFORE /:id to prevent matching 'search' as an ID)
router.get('/lyrics/search', searchLyrics);

// Lyrics general routes
router.route('/lyrics')
  .get(getLyrics)
  .post(createLyric);

router.route('/lyrics/:id')
  .get(getLyricById)
  .put(updateLyric)
  .delete(deleteLyric);

export default router;
