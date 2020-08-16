const Category = require('../models/Category');

const mapCategory = ({id, title, subcategories}) => ({
  id,
  title,
  subcategories: subcategories ? subcategories.map(mapCategory) : [],
});

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();

  ctx.body = {categories: categories.map(mapCategory)};
  ctx.status = 200;
};
