const Products = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const {query} = ctx.request.query;
  const products = await Products.find({$text: {$search: query}});
  ctx.body = {products: products};
  ctx.status = 200;
};
