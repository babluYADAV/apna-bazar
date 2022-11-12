const User = require("../models/userModel");
const Store = require("../models/storeModel");

const create_Store = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.body.vendor_id });
    if (userData) {
      if (!req.body.latitude || !req.body.longitude) {
        res.status(200).send({
          success: false,
          message: "lat and long is required for this request",
        });
      } else {
        const vendorData = await Store.findOne({
          vendor_id: req.body.vendor_id,
        });

        if (vendorData) {
          res.status(200).send({
            success: false,
            message: "This vendor have already have a store",
          });
        } else {
          const store = new Store({
            vendor_id: req.body.vendor_id,
            logo: req.file.filename,
            business_email: req.body.business_email,
            address: req.body.address,
            pin: req.body.pin,
            location: {
              type: "Point",
              coordinates: [
                parseFloat(req.body.latitude),
                parseFloat(req.body.longitude),
              ],
            },
          });
          const storeData = await store.save();
          res.status(200).send({
            success: true,
            message: "Your store has been created successfully",
            data: storeData,
          });
        }
      }
    } else {
      res.status(200).send({
        success: false,
        message: "Vendor id does not exist",
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const get_store = async (id) => {
  try {
    return Store.findOne({ _id: id });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const find_store = async (req, res) => {
  try {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const near_store = await Store.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          key: "location",
          maxDistance: 1000,
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
    ]);
    res.status(200).send({
      success: true,
      message: "Store details",
      data: near_store,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  create_Store,
  get_store,
  find_store,
};
