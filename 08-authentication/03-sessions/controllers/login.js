const passport = require('../libs/passport');
const Session = require('../models/Session');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const token = await ctx.login(user);
    const now = new Date();
    await Session.create({token, user, lastVisit: now});

    ctx.body = {token};
  })(ctx, next);
};
