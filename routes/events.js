const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Get an event by the ID.
 */
router.get('/v1/view/:eventId', async function (req, res) {
  try {
    const sqlQuery = 'SELECT * FROM EVENT WHERE eventId=?';
    const rows = await db.query(sqlQuery, req.params.eventId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Get all events.
 */
router.get('/v1/all', async function (req, res) {
  try {
    const sqlQuery = 'SELECT * FROM EVENT';
    const rows = await db.query(sqlQuery, req.params.eventId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Add an event.
 */
router.post('/v1/addEvent', async function (req, res) {
  try {
    console.log('req', req.body);
    const {
      title,
      description,
      status,
      start_date_time,
      end_date_time,
      banner_image
    } = req.body;
    const sqlQuery =
      'INSERT INTO EVENT (title, description, status, start_date_time, end_date_time, banner_image) VALUES (?, ?, ?, ?, ?, ?)';
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
    res.status(400).send(error.message);
  }
});

module.exports = router;
