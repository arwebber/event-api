const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Get number of sold tickets for an event.
 */
router.get('/v1/tickets/event', async function (req, res) {
    const eventId = req.query.eventId;

    if (eventId == null) {
        res.status(400).send('Event ID cannot be null.');
        return false;
    }

    try {
        const sqlQuery = 'SELECT es.event_id as event_id, SUM(ts.quantity) as totalSold FROM EVENT_SESSION es JOIN TICKETS_SOLD ts ON ts.event_session_id=es.event_session_id WHERE es.event_id=?';
        const rows = await db.query(sqlQuery, eventId);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Get number of sold tickets for an event session.
 */
router.get('/v1/tickets/event/session', async function (req, res) {
    const eventSessionId = req.query.eventSessionId;

    if (eventSessionId == null) {
        res.status(400).send('Event Session ID cannot be null.');
        return false;
    }

    try {
        const sqlQuery = 'SELECT es.event_session_id as event_session_id, SUM(ts.quantity) as totalSold FROM EVENT_SESSION es JOIN TICKETS_SOLD ts ON ts.event_session_id=es.event_session_id WHERE ts.event_session_id=?';
        const rows = await db.query(sqlQuery, eventSessionId);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * Add an event session.
 * 
 */
router.post('/v1/add/tickets/sold', async function (req, res) {
    try {
        const {
            tickets
        } = req.body;

        console.log(tickets)

        if (!tickets || tickets.length == 0) {
            res.status(503).json({ error: 'Tickets cannot be null or empty.' });
            return false;
        }

        tickets.forEach(async ticket => {
            const sqlQuery =
                'INSERT INTO TICKETS_SOLD (event_session_id, quantity, first_name, last_name, email, phone, company) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?)';
            const result = await db.query(sqlQuery, [ticket.cartItem.event_session_id, ticket.cartItem.quantity, ticket.firstName, ticket.lastName, ticket.email, ticket.phone, ticket.company]);
        });

        tickets.forEach(async ticket => {
            const sqlQuery =
                'DELETE FROM CART_ITEM WHERE cart_item_id = ?';
            const result = await db.query(sqlQuery, ticket.cartItem.cart_item_id);
        });

        const sqlQuery = 'DELETE FROM CART WHERE cart_id = ?';
        const result = await db.query(sqlQuery, tickets[0].cartItem.cart_id);

        res.status(200).json();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
