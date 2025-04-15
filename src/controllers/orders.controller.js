const { v6 } = require("uuid");

const { mysqlClient } = require("../db");

const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      house_number,
      street_name,
      state_name,
      city_name,
      pincode,
    } = req.body;

    mysqlClient.query(
      `
          select 
          cart.id,
          cart.qty,
    
          restaurants.id as restaurant_id,
          restaurants.name as restaurant_name,
    
          products.id as product_id,
          products.name as product_name,
          products.price as product_price
    
          from cart
          inner join users on cart.user_id = users.id
          inner join restaurants on cart.restaurant_id = restaurants.id
          inner join products on cart.product_id = products.id
    
          where cart.user_id=${user_id};
          `,
      (err, results) => {
        if (err) {
          res.status(400).json({ message: "Error in DB" });
          return;
        }

        const uuid = v6();

        // Create Master_Order Records
        mysqlClient.query(
          `
          insert into master_orders (uuid, user_id, house_number, street_name, state_name, city_name, pincode)
          values ('${uuid}', ${user_id}, '${house_number}', '${street_name}', '${state_name}', '${city_name}', '${pincode}')
          `,
          (err) => {
            if (err) {
              res.status(400).json({ message: "Error in DB" });
              return;
            }

            const values = results.map((order) => [
              uuid,
              order.restaurant_id,
              order.product_id,
              order.qty,
            ]);

            const query = `
            insert into orders (uuid, restaurant_id, product_id, qty)
            values ?
            `;

            // Create Order Records
            mysqlClient.query(query, [values], (err, results) => {
              if (err) {
                res.status(400).json({ message: "Error in DB" });
                return;
              }

              // Clear cart
              mysqlClient.query(`delete from cart where user_id=${user_id}`);

              res.status(200).json({ message: "Order placed" });
            });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", err });
  }
};

const getOrders = async (req, res) => {
  try {
    const { user_id } = req.query;

    mysqlClient.query(
      `
      SELECT 
        mo.id AS master_order_id,
        mo.uuid,
        mo.user_id,
        mo.house_number,
        mo.street_name,
        mo.state_name,
        mo.city_name,
        mo.pincode,
        mo.created_at,

        o.id AS order_id,
        o.restaurant_id,
        r.name AS restaurant_name,
        o.product_id,
        p.name AS product_name,
        p.price AS product_price,
        o.qty

      FROM master_orders mo
      LEFT JOIN orders o ON mo.uuid = o.uuid
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      LEFT JOIN products p ON o.product_id = p.id
      WHERE mo.user_id = ?
      `,
      [user_id],
      (err, results) => {
        if (err) {
          console.error(err);
          return res.status(400).json({ message: "Error in DB" });
        }

        const grouped = {};

        results.forEach((row) => {
          if (!grouped[row.uuid]) {
            grouped[row.uuid] = {
              id: row.master_order_id,
              uuid: row.uuid,
              user_id: row.user_id,
              house_number: row.house_number,
              street_name: row.street_name,
              state_name: row.state_name,
              city_name: row.city_name,
              pincode: row.pincode,
              created_at: row.created_at,
              orders: [],
            };
          }

          if (row.order_id) {
            grouped[row.uuid].orders.push({
              order_id: row.order_id,
              restaurant_id: row.restaurant_id,
              restaurant_name: row.restaurant_name,
              product_id: row.product_id,
              product_name: row.product_name,
              product_price: row.product_price,
              qty: row.qty,
            });
          }
        });

        const finalData = Object.values(grouped);

        res.status(200).json({ message: "Data retrieved", data: finalData });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", err });
  }
};

const ordersController = {
  createOrder,
  getOrders,
};

module.exports = ordersController;
