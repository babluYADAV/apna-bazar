const Address = require("../models/addressModel");
const add_address = async (req, res) => {
  try {
    const address_exist = await Address.findOne({ user_id: req.body.user_id });

    if (address_exist > 0) {
      var add_address = [];

      for (let i = 0; i < address.exist.address.length; i++) {
        add_address.push(address_exist.address[i]);
      }
      add_address.push(req.body.address);
      const updated_address = await Address.findOneAndUpdate(
        { user_id: req.body.user_id },
        { $set: { address: add_address } },
        { returnDocument: "after" }
      );
      res.status(200).send({
        success: true,
        message: "Address added  successfully",
        data: updated_address,
      });
    } else {
      const address = new Address({
        user_id: req.body.user_id,
        address: req.body.address,
      });

      const address_data = await address.save();
      res.status(200).send({
        success: true,
        message: "Address added  successfully",
        data: address_data,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  add_address,
};
