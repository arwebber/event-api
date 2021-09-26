const express = require('express');
// const dotenv = require('dotenv');
// dotenv.config({ path: '.env' });
const PORT = process.env.PORT || '3001';
const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Set the routers.
 */
const eventsRouter = require('./routes/events.js');
const eventSessionsRouter = require('./routes/event-sessions.js');
const cartRouter = require('./routes/cart.js');

/**
 * Assign routes for the events application.
 */
app.use('/api/events', eventsRouter);
app.use('/api/event-sessions', eventSessionsRouter);
app.use('/api/cart', cartRouter);

/**
 * Start listening.
 */
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}`);
});
