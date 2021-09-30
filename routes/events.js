const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * @swagger
 * tags:
 *  name: Events
 *  description: API to manage the listed events.
 */

/**
 * @swagger
 * /api/events/v1/:
 *   get:
 *     description: Get the event details by event ID.
 *     tags: [Events]
 *     parameters:
 *       - name: eventId
 *         description: The event Id.
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Returns the corresponding event details.
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
    const sqlQuery = 'SELECT * FROM EVENT WHERE event_id=?';
    const rows = await db.query(sqlQuery, eventId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/events/v1/all:
 *   get:
 *     description: Get add listed events.
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Returns all the corresponding events.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.get('/v1/all', async function (req, res) {
  try {
    const sqlQuery = 'SELECT * FROM EVENT ORDER BY start_date_time ASC';
    const rows = await db.query(sqlQuery, req.params.eventId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/add/event:
 *   post:
 *     description: Add an event.
 *     tags: [Events]
 *     requestBody:
 *       description: JSON request object that includes the values for the event.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               start_date_time:
 *                 type: string
 *                 format: date-time
 *               end_date_time:
 *                 type: string
 *                 format: date-time
 *               banner_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the unique ID of the new event session.
 *       400:
 *         description: Null values not allowed.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.post('/v1/add/event', async function (req, res) {
  try {
    const {
      title,
      description,
      status,
      start_date_time,
      end_date_time,
      banner_image
    } = req.body;

    /**
     * Verify all query parameters are not null.
     */
    if (title == null || description == null || status == null || start_date_time == null ||
      end_date_time == null) {
      res.status(400).send('Null values not allowed.');
      return false;
    }

    const sqlQuery =
      'INSERT INTO EVENT (title, description, status, start_date_time, end_date_time, banner_image) ' +
      'VALUES (?, ?, ?, ?, ?, ?)';
    const result = await db.query(sqlQuery, [
      title,
      description,
      status,
      start_date_time,
      end_date_time,
      banner_image
    ]);
    res.status(200).json({ cart_item_id: result.insertId });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/update/event:
 *   post:
 *     description: Add an event.
 *     tags: [Events]
 *     requestBody:
 *       description: JSON request object that includes the values for updating the event.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *               start_date_time:
 *                 type: string
 *                 format: date-time
 *               end_date_time:
 *                 type: string
 *                 format: date-time
 *               banner_image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns a success value of true.
 *       400:
 *         description: Null values not allowed.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.post('/v1/update/event', async function (req, res) {
  try {
    const {
      event_id,
      title,
      description,
      status,
      start_date_time,
      end_date_time,
      banner_image
    } = req.body;

    /**
     * Verify all query parameters are not null.
     */
    if (title == null || description == null || status == null || start_date_time == null ||
      end_date_time == null) {
      res.status(400).send('Null values not allowed.');
      return false;
    }

    const sqlQuery =
      'UPDATE EVENT SET title=?, description=?, status=?, start_date_time=?, end_date_time=?, banner_image=? WHERE event_id=?';
    const result = await db.query(sqlQuery, [
      title,
      description,
      status,
      start_date_time,
      end_date_time,
      banner_image,
      event_id,
    ]);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

module.exports = router;
