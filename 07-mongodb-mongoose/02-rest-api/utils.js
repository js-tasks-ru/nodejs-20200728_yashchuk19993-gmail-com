const mongoose = require('mongoose');

const isIdValid = (id) => mongoose.Types.ObjectId.isValid(id);

const validateObjectId = (ctx, next) => {
  if (!isIdValid(ctx.params.id)) {
    ctx.status = 400;
    ctx.body = {message: 'invalid id'};
    return;
  }

  return next();
};

module.exports.validateObjectId = validateObjectId;
module.exports.isIdValid = isIdValid;
