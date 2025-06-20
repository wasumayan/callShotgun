import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './config/database';
import userRoutes from './routes/userRoutes';
import tripRoutes from './routes/tripRoutes';
import mapsRoutes from './routes/maps';
import authRoutes from './routes/auth';
import suggestionRoutes from './routes/suggestionRoutes';
import groupRoutes from './routes/groupRoutes';
import messageRoutes from './routes/messageRoutes';
import itineraryRoutes from './routes/itineraryRoutes';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/itineraries', itineraryRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Call Shotgun API!' });
});

// Test route
app.get('/api/maps/test', (req, res) => {
  res.json({ message: 'Google Maps API is working!' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => console.log('Error connecting to database:', error)); 