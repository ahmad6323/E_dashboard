const express = require("express");
require("./db/config");
const cors = require("cors");
const User = require("./db/users");
const Product = require("./db/product");
const app = express();
app.use(express.json());
app.use(cors());

app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();
  delete result.password;
  res.send(result);
});
app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "user was not found" });
    }
  } else {
    res.send({ result: "user not found" });
  }
});
app.post("/product", async (req, res) => {
  let products = new Product(req.body);
  let result = await products.save();
  res.send(result);
});

app.get("/productlist", async (req, res) => {
  let product = await Product.find();
  if (product.length > 0) {
    res.send(product);
  } else {
    res.send({ result: "no product found" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
}),
  app.get("/product/:id", async (req, res) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send({ result: "result not found " });
    }
  });
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  res.send(result);
});

app.listen(5000);
