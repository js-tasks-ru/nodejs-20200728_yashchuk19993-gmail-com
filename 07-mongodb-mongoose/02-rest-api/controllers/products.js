const Product = require('../models/Product');
const Category = require('../models/Category');

const mapProduct = ({id, images, title, description, price, category, subcategory}) => ({
  id, images, title, description, price, category, subcategory,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.request.query;

  if (!subcategory) {
    const products = await Product.find();
    ctx.body = {products: products.map(mapProduct)};
    ctx.status = 200;
    return;
  }

  const category = await Category.find({'subcategories._id': subcategory});
  debugger;
  if (!category.length) {
    ctx.status = 200;
    ctx.body = {products: []};
    return;
  }

  ctx.category = category;
  return next();
};

module.exports.productList = async function productList(ctx, next) {
  const {category} = ctx;
  debugger;
  const products = await Product.find({category});

  ctx.body = {products: products.map(mapProduct)};
  ctx.status = 200;
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  const product = await Product.findById(id);

  if (product) {
    ctx.status = 200;
    ctx.body = {product: mapProduct(product)};
  } else {
    ctx.status = 404;
    ctx.body = {message: `Product with id: ${id}} not found`};
  }
};

