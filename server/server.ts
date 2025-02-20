import app from './app';
import dotenv from 'dotenv';
import sequelize from './config/database';
import { initUser } from './models/User';

dotenv.config();

const PORT = process.env.PORT || 3000;

// Initialize models
initUser(sequelize);

// Sync database
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Database synced');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
