const express = require('express');
const router = express.Router();
const db = require('../db/database');

/**
 * @swagger
 * tags:
 *  name: Cart
 *  description: API to manage the users cart.
 */

/**
 * @swagger
 * /api/cart/v1/:
 *   get:
 *     description: Used to get the users cart from user's session ID
 *     tags: [Cart]
 *     parameters:
 *       - name: sessionId
 *         description: User's sessionId.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Returns the corresponding cart ID 
 *       400:
 *         description: Session ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
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
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/contents/by/id:
 *   get:
 *     description: Used to get the cart contents by the cart ID.
 *     tags: [Cart]
 *     parameters:
 *       - name: cartId
 *         description: User's cart ID.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Returns the cart contents.
 *       400:
 *         description: Cart ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.get('/v1/contents/by/id', async function (req, res) {
  const cartId = req.query.cartId;

  if (cartId == null) {
    res.status(400).send('Cart ID cannot be null.');
    return false;
  }

  try {
    const sqlQuery =
      'SELECT ci.*, es.event_id, es.title, es.price, e.title as event_title ' +
      'FROM CART_ITEM ci ' +
      'JOIN EVENT_SESSION es ON ci.event_session_id=es.event_session_id ' +
      'JOIN EVENT e ON es.event_id=e.event_id ' +
      'WHERE cart_id=? ORDER BY es.event_id ASC';
    const rows = await db.query(sqlQuery, cartId);
    res.status(200).json(rows);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/contents/by/session:
 *   get:
 *     description: Used to get the cart contents by the user session id.
 *     tags: [Cart]
 *     parameters:
 *       - name: sessionId
 *         description: User's session ID.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Returns the cart contents.
 *       400:
 *         description: Session ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
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
      'SELECT ci.*, es.event_id, es.title, es.price, e.title as event_title ' +
      'FROM CART_ITEM ci ' +
      'JOIN CART c ON ci.cart_id=c.cart_id ' +
      'JOIN EVENT_SESSION es ON ci.event_session_id=es.event_session_id ' +
      'JOIN EVENT e ON es.event_id=e.event_id ' +
      'WHERE c.session_id=? ORDER BY es.event_id ASC';
    const rows = await db.query(sqlQuery, [
      sessionId,
    ]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/contents/total:
 *   get:
 *     description: Used to caclulate and return the subtotal of the users cart.
 *     tags: [Cart]
 *     parameters:
 *       - name: sessionId
 *         description: User's session ID.
 *         in: query
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Returns the cart subtotal
 *       400:
 *         description: Session ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
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
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/add/cart:
 *   post:
 *     description: Create a cart. Used when a client begins the checkout process.
 *     tags: [Cart]
 *     requestBody:
 *       description: JSON request that includes the session ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns the cart subtotal
 *       400:
 *         description: Session ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.post('/v1/add/cart', async function (req, res) {
  try {
    const { session_id } = req.body;

    if (session_id == null) {
      res.status(400).send('Session ID cannot be null.');
      return false;
    }

    const sqlQuery = 'INSERT INTO CART (session_id) VALUES (?)';
    const result = await db.query(sqlQuery, [session_id]);
    res.status(200).json(result.insertId);
  } catch (error) {
    console.log('error', error)
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/add/cart/item:
 *   post:
 *     description: Add an item to the cart. If the item is already in the cart, update the quantity with the quantity provided.
 *     tags: [Cart]
 *     requestBody:
 *       description: JSON request object that includes the values for the var.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: integer
 *               event_session_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns the unique ID of the cart item.
 *       400:
 *         description: Null values not allowed.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.post('/v1/add/cart/item', async function (req, res) {
  try {
    const { cart_id, event_session_id, quantity } = req.body;

    /**
     * Verify the request body contains the fields needed.
     */
    if (cart_id == null || event_session_id == null || quantity == null) {
      res.status(400).send('Null values not allowed.');
      return false;
    }

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
    res.status(503).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/cart/v1/delete/cart/item:
 *   delete:
 *     description: Deletes and item from the cart. Either if user selects 0 for quantity or if the user deletes from cart.
 *     tags: [Cart]
 *     requestBody:
 *       description: JSON request object that includes the unique cart item ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_item_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns the unique ID of the cart item that was deleted.
 *       400:
 *         description: Cart Item ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.delete('/v1/delete/cart/item', async function (req, res) {
  try {
    const { cart_item_id } = req.body;

    /**
     * Verify the request body contains the fields needed.
     */
    if (cart_item_id == null) {
      res.status(400).send('Cart Item ID cannot be null.');
      return false;
    }

    const sqlQuery =
      'DELETE FROM CART_ITEM WHERE cart_item_id=?';
    const result = await db.query(sqlQuery, [
      cart_item_id,
    ]);
    res.status(200).json({ cart_item_id: cart_item_id });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

/**
 * Delete an item from the cart.
 */

/**
 * @swagger
 * /api/cart/v1/delete/cart/:
 *   delete:
 *     description: Deletes and a cart. Used after checkout is completed.
 *     tags: [Cart]
 *     requestBody:
 *       description: JSON request object that includes the unique cart ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Returns the unique ID of the cart item that was deleted.
 *       400:
 *         description: Cart ID cannot be null.
 *       503:
 *         description: Error Executing query - see returned message.
 */
router.delete('/v1/delete/cart/', async function (req, res) {
  try {
    const { cart_id } = req.body;

    /**
     * Verify the request body contains the fields needed.
     */
    if (cart_id == null) {
      res.status(400).send('Cart ID cannot be null.');
      return false;
    }

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
    res.status(503).json({ error: error.message });
  }
});

module.exports = router;
