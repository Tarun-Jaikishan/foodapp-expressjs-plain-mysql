const express = require("express");

const restaurantsController = require("../controllers/restaurants.controller.js");

const router = express.Router();

router.get("/", restaurantsController.getRestaurants);
router.get("/:id/products", restaurantsController.getProducts);

module.exports = router;
