const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

router.get('/newExpense', function (req, res, next) {
  res.render('newExpense');
});

router.post('/addExpense', (req, res, next) => {
  var data = req.body;
  data.budget = 'Expense';
  data.userId = req.user._id;
  Expense.create(data, (err, expense) => {
    if (err) return next(err);
    Budget.create(data, (err, budget) => {
      if (err) return next(err);
      res.redirect('/users/dashboard');
    });
  });
});

router.get('/deleteExpense/:id', (req, res, next) => {
  var id = req.params.id;
});

module.exports = router;
