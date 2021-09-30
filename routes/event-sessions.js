const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * @swagger
 * tags:
 *  name: Event Sessions
 *  description: API to manage the sessions for an event.
 */

/**
 * @swagger
 * /api/event-sessions/v1/:
 *   get:
 *     description: Get the event session details by event ID.
 *     tags: [Event Sessions]
 *     parameters:
 *       - name: eventId
 *         description: The event Id.
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Returns the corresponding event sessions.
 *       400:
 *         description: Event ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.get('/v1', async function (req, res) {
  const eventId = req.query.eventId;

  /**
   * Verify all query parameters are not null.
   */
  if (eventId == null) {
    res.status(400).send('Event ID cannot be null.');
    return false;
  }

  try {
    const sqlQuery = 'SELECT * FROM EVENT_SESSION WHERE event_id=? ORDER BY price ASC';
    const rows = await db.query(sqlQuery, eventId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/add/event/session:
 *   post:
 *     description: Add an event session to an event.
 *     tags: [Event Sessions]
 *     requestBody:
 *       description: JSON request object that includes the values for the event session.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *               description:
 *                 type: string
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 format: byte
 *               price:
 *                 type: number
 *                 format: float
 *               sale:
 *                 type: boolean
 *               sale_end_date_time:
 *                 type: string
 *                 format: date-time
 *               total_quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns the unique ID of the new event session.
 *       400:
 *         description: Null values not allowed.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.post('/v1/add/event/session', async function (req, res) {
  try {
    const {
      event_id,
      description,
      title,
      type,
      price,
      sale,
      sale_end_date_time,
      total_quantity
    } = req.body;


    /**
     * Verify all query parameters are not null.
     */
    if (eventId == null || description == null || title == null || type == null ||
      price == null || sale == null || sale_end_date_time == null || total_quantity == null) {
      res.status(400).send('Null values not allowed.');
      return false;
    }

    const sqlQuery =
      'INSERT INTO EVENT_SESSION (event_id, description, title, type, price, sale, sale_end_date_time, total_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await db.query(sqlQuery, [
      event_id,
      description,
      title,
      type,
      price,
      sale,
      sale_end_date_time,
      total_quantity
    ]);
    res.status(200).json({ event_session_id: result.insertId });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

module.exports = router;
