const { mysqlClient } = require("../db");

const getRestaurants = async (req, res) => {
  try {
    mysqlClient.query("select * from restaurants", (err, results) => {
      if (err) {
        console.log(err);
        res.status(400).json({ message: "Error in DB" });
        return;
      }

      res.status(200).json({ message: "Data retrieved", results });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", err });
  }
};

const getProducts = async (req, res) => {
  try {
    const { id } = req.params;

    mysqlClient.query(
      `select * from products where restaurant_id=${id}`,
      (err, results) => {
        if (err) {
          res.status(400).json({ message: "Error in DB" });
          return;
        }

        res.status(200).json({ message: "Data retrieved", results });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error", err });
  }
};

const restaurantsController = {
  getRestaurants,
  getProducts,
};

module.exports = restaurantsController;
