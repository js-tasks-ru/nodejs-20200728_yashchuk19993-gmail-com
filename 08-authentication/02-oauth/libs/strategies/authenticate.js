const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) return done(null, false, 'Не указан email');

  try {
    const user = await User.findOne({email}).exec();

    if (!user) {
      const newUser = new User({email, displayName});
      await newUser.save();
      return done(null, newUser);
    }


    return done(null, user);
  } catch (e) {
    return done(e);
  }
};
