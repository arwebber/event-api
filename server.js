const express = require('express');
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const dotenv = require('dotenv');
dotenv.config({ path: '.env' });
const PORT = process.env.PORT || '3001';
const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Add cors headers.
 */
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
 * Set the routers.
 */
const eventsRouter = require('./routes/events.js');
const eventSessionsRouter = require('./routes/event-sessions.js');
const cartRouter = require('./routes/cart.js');
const ticketsSoldRouter = require('./routes/tickets-sold.js');

/**
 * Assign routes for the events application.
 */
app.use('/api/events', eventsRouter);
app.use('/api/event-sessions', eventSessionsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/sold', ticketsSoldRouter);

/**
 * Swagger doc options
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Checkout Site Express API with Swagger",
      version: "0.1.0",
      description:
        "The documentation for the Event Checkout Site's Express API with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Andrew Webber",
        url: "https://webber-event-checkout.herokuapp.com/",
        email: "webber.andrewr@gmail.com",
      },
    },
    servers: [
      {
        url: "https://event-checkout-api.herokuapp.com/",
      },
    ],
  },
  apis: ["./routes/cart.js", "./routes/tickets-sold.js", "./routes/event-sessions.js", "./routes/events.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

/**
 * Start listening.
 */
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}`);
});
