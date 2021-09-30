const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * @swagger
 * tags:
 *  name: Tickets Sold
 *  description: API to manage the event tickets sold.
 */

/**
 * @swagger
 * /api/sold/v1/tickets/event:
 *   get:
 *     description: Get number of sold tickets for an event.
 *     tags: [Tickets Sold]
 *     parameters:
 *       - name: eventId
 *         description: The unique event ID.
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Returns total number of tickets sold for an entire event.
 *       400:
 *         description: Event ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
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
        res.status(503).json({ error: error.message });
    }
});


/**
 * @swagger
 * /api/sold/v1/tickets/event/session:
 *   get:
 *     description: Get number of sold tickets for an event session.
 *     tags: [Tickets Sold]
 *     parameters:
 *       - name: eventSessionId
 *         description: The unique event session ID.
 *         in: query
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Returns total number of tickets sold for an entire event.
 *       400:
 *         description: Event ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
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
 * @swagger
 * /api/cart/v1/add/tickets/sold:
 *   post:
 *     description: Add tickets to sold database after user completes checkout process.
 *     tags: [Tickets Sold]
 *     requestBody:
 *       description: JSON request that includes the session ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tickets:
 *                 type: object
 *                 properties:
 *                   event_id:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Returns a success message if executed without error.
 *       400:
 *         description: Tickets cannot be null or empty.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.post('/v1/add/tickets/sold', async function (req, res) {
    try {
        const {
            tickets
        } = req.body;

        if (!tickets || tickets.length == 0) {
            res.status(400).json({ error: 'Tickets cannot be null or empty.' });
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

        res.status(200).json({ success: 'Added successfully' });
    } catch (error) {
        res.status(503).json({ error: error.message });
    }
});

module.exports = router;
