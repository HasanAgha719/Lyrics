import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import lyricRoutes from './routes/lyricRoutes.js';

// Load env vars
dotenv.config();

// Connect database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Mount API Routes
app.use('/api', lyricRoutes);

// Base route for sanity check
app.get('/', (req, res) => {
  res.send('Zikr-e-Karbala Lyrics API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in mode on port ${PORT}`);
});
