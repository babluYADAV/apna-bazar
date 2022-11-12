const SubCategory = require("../models/subCotegoryModel");
const add_sub_category = async (req, res) => {
  try {
    const subCategories = await SubCategory.find({
      category_id: req.body.category_id,
    });
    if (subCategories.length > 0) {
      let checking = false;
      for (let i = 0; i < subCategories.length; i++) {
        if (
          subCategories[i]["sub_category"].toLowerCase() ===
          req.body.sub_category.toLowerCase()
        ) {
          checking = true;
          break;
        }
      }

      if (checking == false) {
        const subCategory = new SubCategory({
          category_id: req.body.category_id,
          sub_category: req.body.sub_category,
        });
        const sub_cat_data = await subCategory.save();
        res.status(200).send({
          success: true,
          message: "sub category has been created successfully",
          data: sub_cat_data,
        });
      } else {
        res.status(200).send({
          success: false,
          message: "sub category already exists",
        });
      }
    } else {
      const subCategory = new SubCategory({
        category_id: req.body.category_id,
        sub_category: req.body.sub_category,
      });
      const sub_cat_data = await subCategory.save();
      res.status(200).send({
        success: true,
        message: "sub category has been created successfully",
        data: sub_cat_data,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = {
  add_sub_category,
};
