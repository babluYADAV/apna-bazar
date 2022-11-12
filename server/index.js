const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 8000;

const server = http.createServer(app);

mongoose
  .connect("mongodb://localhost:27017/apna-bazar", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database connected");
    server.listen(port, () => {
      console.log("server is running on port " + port);
    });
  })
  .catch(() => {
    console.log("Database connection failed!");
  });

const userRoute = require("./routes/userRoute");
const storeRoute = require("./routes/storeRoute");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const productRoute = require("./routes/productRoute");
const commonRoute = require("./routes/commonRoute");
const cartRoute = require("./routes/cartRoute");
const addressRoute = require("./routes/addressRoute");
const buyProductRoute = require("./routes/buyProductRoute");

app.use("/api", userRoute);
app.use("/api", storeRoute);
app.use("/api", categoryRoute);
app.use("/api", subCategoryRoute);
app.use("/api", productRoute);
app.use("/api", commonRoute);
app.use("/api", cartRoute);
app.use("/api", addressRoute);
app.use("/api", buyProductRoute);
