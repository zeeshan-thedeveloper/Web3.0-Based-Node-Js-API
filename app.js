var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Account end-points.
const {
  createAccountRouter,
  getBalanceByAccountAddressRouter
}= require("./routes/AccountsEndpoints")

//Transactions end-points
const {
  sendAmountFromOneAccountToOtherRouter,
  getPendingTransactionListByAccountAddressRouter,
  getSentRecievedFundsTransactionsListByAccountAddressRouter,
  
} = require("./routes/TransactionsEndpoints")


//Authentication end-points.
const {signInRouter} = require("./routes/AuthenticationEndpoints")

//Contract end-points.
const {
  deployContractRouter,
  getDataFromBlockchainRotuer,
  storeDataOnBlockchainRouter
}=require("./routes/ContractEndpoints")

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/AccountEndpoints', createAccountRouter);
app.use('/AccountEndpoints', getBalanceByAccountAddressRouter);

app.use('/AuthenticationEndpoints', signInRouter);

app.use('/TransactionsEndpoints', sendAmountFromOneAccountToOtherRouter);
app.use('/TransactionsEndpoints', getPendingTransactionListByAccountAddressRouter);
app.use('/TransactionsEndpoints', getSentRecievedFundsTransactionsListByAccountAddressRouter);

app.use('/ContractEndpoints',deployContractRouter);
app.use('/ContractEndpoints',storeDataOnBlockchainRouter);
app.use('/ContractEndpoints',getDataFromBlockchainRotuer);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});  

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page 
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
