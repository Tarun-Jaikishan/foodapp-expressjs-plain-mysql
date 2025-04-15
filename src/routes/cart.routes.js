const express = require("express");

const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.get("/", cartController.getCartItems);
router.post("/", cartController.addItemToCart);
router.put("/", cartController.updateQty);
router.delete("/:cart_id", cartController.removeItemFromCart);

module.exports = router;
