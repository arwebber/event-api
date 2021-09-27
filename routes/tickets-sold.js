const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Get number of sold tickets for an event.
 */
router.get('/v1/tickets/event', async function (req, res) {
    const { eventId } = req.body;

    if (eventId == null) {
        res.status(400).send('Event ID cannot be null.');
        return false;
    }

    try {
        const sqlQuery = 'SELECT es.event_id as event_id, SUM(ts.quantity) as totalSold FROM EVENT_SESSION es JOIN TICKETS_SOLD ts ON ts.event_session_id=es.event_session_id WHERE es.event_id=?';
        const rows = await db.query(sqlQuery, eventId);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Get number of sold tickets for an event session.
 */
router.get('/v1/tickets/event/session', async function (req, res) {
    const { eventSessionId } = req.body;

    if (eventSessionId == null) {
        res.status(400).send('Event Session ID cannot be null.');
        return false;
    }

    try {
        const sqlQuery = 'SELECT es.event_id as event_id, SUM(ts.quantity) as totalSold FROM EVENT_SESSION es JOIN TICKETS_SOLD ts ON ts.event_session_id=es.event_session_id WHERE es.event_session_id=?';
        const rows = await db.query(sqlQuery, req.params.eventSessionId);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

/**
 * Add an event session.
 */
router.post('/v1/add/tickets/sold', async function (req, res) {
    try {
        const {
            event_session_id,
            quantity,
            email
        } = req.body;
        const sqlQuery =
            'INSERT INTO TICKETS_SOLD (event_session_id, quantity, email) VALUES (?, ?, ?)';
        const result = await db.query(sqlQuery, [
            event_session_id,
            quantity,
            email
        ]);
        res.status(200).json({ tickets_sold_id: result.insertId });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;
