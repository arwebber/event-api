const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Get the event session details by an ID.
 */
router.get('/v1/:eventId', async function (req, res) {
  try {
    const sqlQuery = 'SELECT * FROM EVENT_SESSION WHERE event_id=?';
    const rows = await db.query(sqlQuery, req.params.eventId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Add an event session.
 */
router.post('/v1/addEventSession', async function (req, res) {
  try {
    console.log('req', req.body);
    const {
      event_id,
      description,
      title,
      type,
      price,
      sale,
      sale_end_date_time,
      quantity_remaining,
      total_quantity
    } = req.body;
    const sqlQuery =
      'INSERT INTO EVENT_SESSION (event_id, description, title, type, price, sale, sale_end_date_time, quantity_remaining, total_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await db.query(sqlQuery, [
      event_id,
      description,
      title,
      type,
      price,
      sale,
      sale_end_date_time,
      quantity_remaining,
      total_quantity
    ]);
    res.status(200).json({ event_session_id: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
