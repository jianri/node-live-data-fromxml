var express = require('express'),
bodyParser = require('body-parser'),
api = require('./routes/api'),
http = require('http');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var env = process.env.NODE_ENV || 'production';

if (env === 'development') {
    app.use(express.errorHandler());
}

if (env === 'production') {

}

app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', api.getvalue);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});