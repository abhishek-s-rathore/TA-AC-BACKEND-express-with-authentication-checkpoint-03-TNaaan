const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const moment = require('moment');

router.get('/newExpense', function (req, res, next) {
  res.render('newExpense');
});

router.post('/addExpense', (req, res, next) => {
  var data = req.body;
  data.budget = 'Expense';
  data.userId = req.user._id;
  data.month = moment(data.date).format('MMMM');
  data.year = moment(data.date).format('YYYY');
  Expense.create(data, (err, expense) => {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

module.exports = router;
