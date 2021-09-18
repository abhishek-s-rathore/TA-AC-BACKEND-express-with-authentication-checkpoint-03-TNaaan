const passport = require('passport');
const User = require('../models/User');

module.exports = {
  loggedInUser: (req, res, next) => {
    if (req.session && req.session.user) {
      next();
    } else if (req.session && req.session.passport) {
      next();
    } else {
      req.flash('error', 'To use this feature, you have to signin first...');
      // req.session.returnTo = req.originalUrl;
      res.redirect('/users/signin');
    }
  },

  userInfo: (req, res, next) => {
    if (req.session.user) {
      var userId = req.session && req.session.user;
      User.findById(userId, 'email name avatar', (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else if (req.session.passport) {
      let userId = req.session && req.session.passport.user;
      User.findById(userId, 'name email avatar', (err, user) => {
        if (err) return next(err);
        req.user = user;
        res.locals.user = user;
        next();
      });
    } else {
      req.user = null;
      res.locals.user = null;
      next();
    }
  },
};
