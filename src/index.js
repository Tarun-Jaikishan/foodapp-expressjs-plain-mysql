const express = require("express");
const cors = require("cors");

const { mysqlClient } = require("./db.js");

// Routes
const restaurantsRoutes = require("./routes/restaurants.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const ordersRoutes = require("./routes/orders.routes.js");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/restaurants", restaurantsRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  mysqlClient.connect((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err.message);
      return;
    }

    console.log("Connected to MySQL");
  });
});
