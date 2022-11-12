const mongoose = require("mongoose");
const product = mongoose.Schema({
  vendor_id: { type: String, required: true },
  store_id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  discount: { type: String, required: true },
  category_id: { type: String, required: true },
  sub_cat_id: { type: String, required: true },
  images: {
    type: Array,
    required: true,
    validate: [(val) => val.length <= 5, "You can pass max 5 product images"],
  },
});

module.exports = mongoose.model("Product", product);
