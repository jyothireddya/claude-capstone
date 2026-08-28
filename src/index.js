const express = require("express");

const app = express();

app.use(express.json());

app.get("/orders", (req, res) => {
  res.json({ message: "Order list" });
});

app.get("/orders/:id", (req, res) => {
  res.json({ message: `Order ${req.params.id}` });
});

app.post("/orders", (req, res) => {
  res.status(201).json({ message: "Order created" });
});

app.put("/orders/:id", (req, res) => {
  res.json({ message: `Order ${req.params.id} updated` });
});

app.delete("/orders/:id", (req, res) => {
  res.json({ message: `Order ${req.params.id} cancelled` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Customer Order Service running on port ${PORT}`);
});
