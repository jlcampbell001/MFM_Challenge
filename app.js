var path = require('path');
var port = process.env.port || 1337;
var express = require('express');

var app = express();

var dir = path.join(__dirname, 'public');

var index = require('./routes/index');
var bcyper = require('./routes/bcypherapi');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(dir));

app.use('/', index);
app.use('/bc', bcyper);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    console.log(req.url);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(port);
