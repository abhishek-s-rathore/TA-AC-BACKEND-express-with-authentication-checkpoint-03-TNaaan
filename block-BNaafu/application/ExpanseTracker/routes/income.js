const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Budget = require('../models/Budget');

router.get('/newIncome', function (req, res, next) {
  res.render('newIncome');
});

router.post('/addIncome', (req, res, next) => {
  var data = req.body;
  data.userId = req.user._id;
  data.budget = 'Income';
  Income.create(data, (err, income) => {
    if (err) return next(err);
    Budget.create(data, (err, budget) => {
      if (err) return next(err);
      res.redirect('/users/dashboard');
    });
  });
});

module.exports = router;
