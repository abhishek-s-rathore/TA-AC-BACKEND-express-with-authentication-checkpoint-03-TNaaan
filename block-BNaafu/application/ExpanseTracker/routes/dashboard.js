var express = require('express');
var router = express.Router();

const User = require('../models/User');
const Expense = require('../models/Expense');
const Income = require('../models/Income');

var moment = require('moment');
var mongoose = require('mongoose');

var auth = require('../middlewares/auth');

// Dashboard ~Current Month Details
router.get('/', auth.loggedInUser, async (req, res, next) => {
  var currMonth = moment().month();
  var currYear = moment().year();
  var budgetData = [];
  var yearArr = [];
  var ipOne = moment().format('MMMM');
  var ipTwo = moment().format('YYYY');

  const expenseTypes = await Expense.distinct('expense');
  const incomeTypes = await Income.distinct('source');

  const expenseYear = await Expense.distinct('year');
  const incomeYear = await Income.distinct('year');
  yearArr = [...expenseYear, ...incomeYear];
  yearArr = [...new Set(yearArr)];

  Expense.aggregate(
    [
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      { $match: { month: moment().format('MMMM') } },
      { $match: { year: moment().format('YYYY') } },
      { $sort: { date: 1 } },
    ],
    (err, expenses) => {
      if (err) return next(err);
      budgetData = budgetData.concat(expenses);
    }
  );
  Income.aggregate(
    [
      { $match: { userId: mongoose.Types.ObjectId(req.user.id) } },
      { $match: { month: moment().format('MMMM') } },
      { $match: { year: moment().format('YYYY') } },
      { $sort: { date: 1 } },
    ],
    (err, incomes) => {
      if (err) return next(err);
      budgetData = budgetData.concat(incomes);
      budgetData.sort((a, b) => {
        return b.date - a.date;
      });
      console.log(expenseTypes, incomeTypes);
      res.render('dashboard', {
        budgetData,
        expenseTypes,
        incomeTypes,
        yearArr,
        ipOne,
        ipTwo,
        moment,
      });
    }
  );
});

//Dashboard ~ Filter By Date
router.post('/filter/byDate', async (req, res, next) => {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var budgetData = [];
  var yearArr = [];
  var ipOne = moment(startDate).format('DD-MM-YYYY');
  var ipTwo = moment(endDate).format('DD-MM-YYYY');

  const expenseTypes = await Expense.distinct('expense');
  const incomeTypes = await Income.distinct('source');

  const expenseYear = await Expense.distinct('year');
  const incomeYear = await Income.distinct('year');
  yearArr = [...expenseYear, ...incomeYear];
  yearArr = [...new Set(yearArr)];

  Expense.find(
    { date: { $gte: startDate, $lte: endDate } },
    (err, expenses) => {
      if (err) return next(err);
      budgetData = budgetData.concat(expenses);
    }
  );
  Income.find({ date: { $gte: startDate, $lte: endDate } }, (err, incomes) => {
    if (err) return next(err);
    budgetData = budgetData.concat(incomes);
    budgetData.sort((a, b) => {
      return b.date - a.date;
    });
    res.render('dashboard', {
      budgetData,
      ipOne,
      ipTwo,
      expenseTypes,
      incomeTypes,
      yearArr,
      moment,
    });
  });
});

//Dashboard Filter By Income Category
router.post('/filter/byIncomeType', async (req, res, next) => {
  var data = req.body;
  var incomeType = data.incomeType;
  var budgetData = [];
  var yearArr = [];
  var ipOne = moment().format('DD-MM-YYYY');
  var ipTwo = moment().format('DD-MM-YYYY');

  const expenseTypes = await Expense.distinct('expense');
  const incomeTypes = await Income.distinct('source');

  const expenseYear = await Expense.distinct('year');
  const incomeYear = await Income.distinct('year');
  yearArr = [...expenseYear, ...incomeYear];
  yearArr = [...new Set(yearArr)];

  Income.find({ source: incomeType }, (err, incomes) => {
    if (err) return next(err);
    budgetData = budgetData.concat(incomes);
    budgetData.sort((a, b) => {
      return b.date - a.date;
    });
    res.render('dashboard', {
      budgetData,
      ipOne,
      ipTwo,
      expenseTypes,
      incomeTypes,
      yearArr,
      moment,
    });
  });
});

//Dashboard Filter By Expense Category
router.post('/filter/byExpenseType', async (req, res, next) => {
  var data = req.body;
  var expenseType = data.expenseType;
  var budgetData = [];
  var yearArr = [];
  var ipOne = moment().format('DD-MM-YYYY');
  var ipTwo = moment().format('DD-MM-YYYY');

  const expenseTypes = await Expense.distinct('expense');
  const incomeTypes = await Income.distinct('source');

  const expenseYear = await Expense.distinct('year');
  const incomeYear = await Income.distinct('year');
  yearArr = [...expenseYear, ...incomeYear];
  yearArr = [...new Set(yearArr)];

  Expense.find({ expense: expenseType }, (err, expenses) => {
    if (err) return next(err);
    budgetData = budgetData.concat(expenses);
    budgetData.sort((a, b) => {
      return b.date - a.date;
    });
    res.render('dashboard', {
      budgetData,
      ipOne,
      ipTwo,
      expenseTypes,
      incomeTypes,
      yearArr,
      moment,
    });
  });
});

// Dashboard ~ Filter by Month
router.post('/filter/byMonth', async (req, res, next) => {
  var data = req.body;
  var year = data.year;
  var month = data.month;
  var budgetData = [];
  var yearArr = [];
  var ipOne = month;
  var ipTwo = year;

  const expenseTypes = await Expense.distinct('expense');
  const incomeTypes = await Income.distinct('source');

  const expenseYear = await Expense.distinct('year');
  const incomeYear = await Income.distinct('year');
  yearArr = [...expenseYear, ...incomeYear];
  yearArr = [...new Set(yearArr)];

  Expense.find({ year: year, month: month }, (err, expenses) => {
    if (err) return next(err);
    budgetData = budgetData.concat(expenses);
  });

  Income.find({ year: year, month: month }, (err, incomes) => {
    if (err) return next(err);
    budgetData = budgetData.concat(incomes);
    budgetData.sort((a, b) => {
      return b.date - a.date;
    });
    res.render('dashboard', {
      budgetData,
      ipOne,
      ipTwo,
      expenseTypes,
      incomeTypes,
      yearArr,
      moment,
    });
  });
});

// Dashboard ~ Filter by Date And Categories
router.post('/filter/mixed', async (req, res, next) => {
  var data = req.body;
  var startDate = data.startDate;
  var endDate = data.endDate;
  var incomeType = data.incomeType;
  var expenseType = data.expenseType;

  var budgetData = [];
  var yearArr = [];
  var ipOne = moment(startDate).format('DD-MM-YYYY');
  var ipTwo = moment(endDate).format('DD-MM-YYYY');

  const expenseTypes = await Expense.distinct('expense');
  const incomeTypes = await Income.distinct('source');

  const expenseYear = await Expense.distinct('year');
  const incomeYear = await Income.distinct('year');
  yearArr = [...expenseYear, ...incomeYear];
  yearArr = [...new Set(yearArr)];

  Expense.find(
    { date: { $gte: startDate, $lte: endDate }, expense: expenseType },
    (err, expenses) => {
      if (err) return next(err);
      budgetData = budgetData.concat(expenses);
    }
  );

  Income.find(
    { date: { $gte: startDate, $lte: endDate }, source: incomeType },
    (err, incomes) => {
      if (err) return next(err);
      budgetData = budgetData.concat(incomes);
      budgetData.sort((a, b) => {
        return b.date - a.date;
      });
      res.render('dashboard', {
        budgetData,
        ipOne,
        ipTwo,
        expenseTypes,
        incomeTypes,
        yearArr,
        moment,
      });
    }
  );
});

module.exports = router;

//   {
//     $project: {
//       budget: '$budget',
//       expense: '$expense',
//       expenseAmount: '$expenseAmount',
//       date: '$date',
//       userId: 'userId',
//       createdAt: '$createdAt',
//       updatedAt: '$updatedAt',
//       month: { $month: '$date' },
//       year: { $year: '$date' },
//     },
//   },
