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
    const { user_id, restaurant_id, product_id, qty } = req.body;

    mysqlClient.query(`select * from cart`, (err, results) => {
      if (err) {
        res.status(400).json({ message: "Error in DB" });
        return;
      }

      res.status(200).json({ message: "Item added to cart retrieved" });
    });

    // mysqlClient.query(
    //   `insert into cart (user_id, restaurant_id, product_id, qty) values (${user_id}, ${restaurant_id}, ${product_id}, ${qty})`,
    //   (err, results) => {
    //     if (err) {
    //       res.status(400).json({ message: "Error in DB" });
    //       return;
    //     }

    //     res.status(200).json({ message: "Item added to cart retrieved" });
    //   }
    // );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", err });
  }
};

const ordersController = {
  createOrder,
  getOrders,
};

module.exports = ordersController;
