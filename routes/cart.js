const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * Get the cart by session id.
 */
router.get('/v1', async function (req, res) {
  const sessionId = req.query.sessionId;

  if (sessionId == null) {
    res.status(400).send('Session ID cannot be null.');
    return false;
  }

  try {
    const sqlQuery = 'SELECT * FROM CART WHERE session_id=?';
    const rows = await db.query(sqlQuery, sessionId);

    if (rows.length > 1) {
      res.status(200).send("Too many carts. Please clear cookies");
      return false;
    } else if (rows.length == 0) {
      res.status(200).json(0);
    } else {
      res.status(200).json(rows[0].cart_id);
    }

    // res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Get the cart contents by the cart ID.
 */
router.get('/v1/contents/by/id', async function (req, res) {
  const cartId = req.query.cartId;

  if (cartId == null) {
    res.status(400).send('Cart ID cannot be null.');
    return false;
  }

  try {
    const sqlQuery =
      'SELECT ci.*, es.event_id, es.title, es.price ' +
      'FROM CART_ITEM ci ' +
      'JOIN EVENT_SESSION es ON ci.event_session_id=es.event_session_id ' +
      'WHERE cart_id=?';
    const rows = await db.query(sqlQuery, cartId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Get the cart contents by the user session id.
 */
router.get('/v1/contents/by/session', async function (
  req,
  res
) {
  const sessionId = req.query.sessionId;

  if (sessionId == null) {
    res.status(400).send('Session ID cannot be null.');
    return false;
  }

  try {
    const sqlQuery =
      'SELECT ci.*, es.event_id, es.title, es.price ' +
      'FROM CART_ITEM ci ' +
      'JOIN CART c ON ci.cart_id=c.cart_id ' +
      'JOIN EVENT_SESSION es ON ci.event_session_id=es.event_session_id ' +
      'WHERE c.session_id=?';
    const rows = await db.query(sqlQuery, [
      sessionId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Get the cart contents by the user session id.
 */
router.get('/v1/contents/total/', async function (
  req,
  res
) {
  const sessionId = req.query.sessionId;

  if (sessionId == null) {
    res.status(400).send('Session ID cannot be null.');
    return false;
  }

  try {
    const sqlQuery =
      'SELECT SUM(ci.quantity*es.price) as subtotal ' +
      'FROM CART_ITEM ci ' +
      'JOIN CART c ON ci.cart_id=c.cart_id ' +
      'JOIN EVENT_SESSION es ON ci.event_session_id=es.event_session_id ' +
      'WHERE c.session_id=?';
    const rows = await db.query(sqlQuery, [
      sessionId,
    ]);
    if (rows.length == 1) {
      res.status(200).json({ subtotal: rows[0].subtotal });
    } else {
      res.status(200).json(rows);
    }

  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Create a cart. Used when a client begins the checkout process.
 */
router.post('/v1/add/cart', async function (req, res) {
  try {
    const { session_id } = req.body;
    const sqlQuery = 'INSERT INTO CART (session_id) VALUES (?)';
    const result = await db.query(sqlQuery, [session_id]);
    res.status(200).json(result.insertId);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Add an item to the cart.
 */
router.post('/v1/add/cart/item', async function (req, res) {
  try {
    const { cart_id, event_session_id, quantity } = req.body;

    /*
     * Check if the cart item already exists, if so we update the quantity instead of adding
     * another record.
     */
    const sqlQueryCheck = 'SELECT * FROM CART_ITEM WHERE cart_id=? AND event_session_id=?';
    const rows = await db.query(sqlQueryCheck, [
      cart_id,
      event_session_id
    ]);

    let sqlQuery = ''
    if (rows.length == 1) {
      if (quantity == 0) {
        sqlQuery = 'DELETE FROM CART_ITEM WHERE cart_item_id=?';
        const resultDelete = await db.query(sqlQuery, [
          rows[0].cart_item_id
        ]);
        res.status(200).json('Quantity 0, item deleted.');
        return true;
      } else {
        sqlQuery = 'UPDATE CART_ITEM SET quantity=? WHERE event_session_id=? AND cart_id=?';
      }
    } else {
      sqlQuery = 'INSERT INTO CART_ITEM (quantity, event_session_id, cart_id) VALUES (?, ?, ?)';
    }

    const result = await db.query(sqlQuery, [
      quantity,
      event_session_id,
      cart_id
    ]);
    res.status(200).json({ cart_item_id: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Delete an item from the cart.
 */
router.delete('/v1/delete/cart/item', async function (req, res) {
  try {
    const { cart_item_id } = req.body;
    const sqlQuery =
      'DELETE FROM CART_ITEM WHERE cart_item_id=?';
    const result = await db.query(sqlQuery, [
      cart_item_id,
    ]);
    res.status(200).json({ cart_item_id: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

/**
 * Delete an item from the cart.
 */
router.delete('/v1/delete/cart/', async function (req, res) {
  try {
    const { cart_id } = req.body;
    const sqlDeleteCartItemsQuery =
      'DELETE FROM CART_ITEMS WHERE cart_id=?';
    const sqlDeleteCartQuery =
      'DELETE FROM CART WHERE cart_id=?';
    const deleteCartItemsResult = await db.query(sqlDeleteCartItemsQuery, [
      cart_id,
    ]);
    const result = await db.query(sqlDeleteCartQuery, [
      cart_id,
    ]);
    res.status(200).json({ cart_id: result.insertId });
  } catch (error) {
    res.status(400).send(error.message);
  }
});



module.exports = router;
