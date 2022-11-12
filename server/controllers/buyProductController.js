const BuyProduct = require("../models/buyProductModel");

const buy_product = async (req, res) => {
  try {
    const buy_product = new BuyProduct({
      product_id: req.body.product_id,
      transaction_id: req.body.transaction_id,
      vendor_id: req.body.vendor_id,
      store_id: req.body.store_id,
      customer_id: req.body.customer_id,
    });
    const buy_product_data = await buy_product.save();

    res.status(200).send({
      success: true,
      message: "Buy product detail",
      data: buy_product_data,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  buy_product,
};
