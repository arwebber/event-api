const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Get the cart contents by the cart ID.
 */
router.get('/v1/cartContents/cartId/:cartId', async function (req, res) {
  try {
    const sqlQuery = 'SELECT * FROM CART_ITEMS WHERE cart_id=?';
    const rows = await db.query(sqlQuery, req.params.cartId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Get the cart contents by the user session id.
 */
router.get('/v1/cartContents/sessionId/:eventId/:userSessionId', async function (
  req,
  res
) {
  try {
    const sqlQuery =
      'SELECT ci.quantity, es.title, es.price ' +
      'FROM CART c ' +
      'JOIN CART_ITEM ci ON c.cart_id=ci.cart_id ' +
      'JOIN EVENT_SESSION es ON ci.event_session_id=es.event_session_id ' +
      'WHERE es.event_id=? AND user_session_id=?';
    const rows = await db.query(sqlQuery, [
      req.params.eventId,
      req.params.userSessionId
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Add an item to the cart.
 */
router.post('/v1/addToCart', async function (req, res) {
  try {
    console.log('req', req.body);
    const { cart_id, event_session_id, quantity } = req.body;
    const sqlQuery =
      'INSERT INTO CART_ITEM (cart_id, event_session_id, quantity) VALUES (?, ?, ?)';
    const result = await db.query(sqlQuery, [
      cart_id,
      event_session_id,
      quantity
    ]);
    res.status(200).json({ cart_item_id: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Create a cart. Used when a client begins the checkout process.
 */
router.post('/v1/createCart', async function (req, res) {
  try {
    console.log('req', req.body);
    const { cart_id } = req.body;
    const sqlQuery = 'INSERT INTO CART (cart_id) VALUES (?)';
    const result = await db.query(sqlQuery, [cart_id]);
    res.status(200).json({ cart_item_id: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
